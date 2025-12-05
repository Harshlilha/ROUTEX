import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { csvRAGService } from '../services/csv-rag.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m your AI Supplier Assistant. Ask me anything about the 200 Bangalore suppliers - quality scores, prices, delivery times, locations, or request comparisons!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    // Load suppliers data
    await csvRAGService.loadDataset();
    const suppliers = await csvRAGService.loadSupplierData();

    // Question: Supplier count
    if (lowerQuery.includes('how many') && lowerQuery.includes('supplier')) {
      return `📊 We have **${suppliers.length} verified suppliers** in the Bangalore dataset.`;
    }

    // Question: Best quality
    if (lowerQuery.includes('best quality') || lowerQuery.includes('highest quality')) {
      const best = suppliers.sort((a, b) => b.quality_score - a.quality_score)[0];
      return `🏆 **${best.supplier}** has the highest quality score of **${best.quality_score}/10**.\n\n📍 Location: ${best.supplier_location}\n💰 Price: ₹${best.price_per_unit_inr}/unit\n🚚 Delivery: ${best.delivery_time_days} days`;
    }

    // Question: Cheapest/lowest price
    if (lowerQuery.includes('cheapest') || lowerQuery.includes('lowest price') || lowerQuery.includes('best price')) {
      const cheapest = suppliers.sort((a, b) => a.price_per_unit_inr - b.price_per_unit_inr)[0];
      return `💰 **${cheapest.supplier}** offers the lowest price at **₹${cheapest.price_per_unit_inr}/unit**.\n\n⭐ Quality Score: ${cheapest.quality_score}/10\n🚚 Delivery: ${cheapest.delivery_time_days} days\n📍 Location: ${cheapest.supplier_location}`;
    }

    // Question: Fastest delivery
    if (lowerQuery.includes('fastest') || lowerQuery.includes('quickest delivery')) {
      const fastest = suppliers.sort((a, b) => a.delivery_time_days - b.delivery_time_days)[0];
      return `⚡ **${fastest.supplier}** has the fastest delivery time of **${fastest.delivery_time_days} days**.\n\n⭐ Quality Score: ${fastest.quality_score}/10\n💰 Price: ₹${fastest.price_per_unit_inr}/unit\n📍 Location: ${fastest.supplier_location}`;
    }

    // Question: Specific supplier
    const supplierMatch = suppliers.find(s => 
      lowerQuery.includes(s.supplier.toLowerCase())
    );
    if (supplierMatch) {
      return `📋 **${supplierMatch.supplier}** Details:\n\n⭐ Quality Score: ${supplierMatch.quality_score}/10\n💰 Price: ₹${supplierMatch.price_per_unit_inr}/unit\n🚚 Delivery: ${supplierMatch.delivery_time_days} days\n📍 Location: ${supplierMatch.supplier_location}\n👥 Employees: ${supplierMatch.number_of_employees}\n💼 Business Results: ${supplierMatch.business_results}\n🔧 Flexibility: ${supplierMatch.flexibility}/10\n💵 Financial Condition: ${supplierMatch.financial_condition}/10`;
    }

    // Question: Price range
    if (lowerQuery.includes('price') && (lowerQuery.includes('average') || lowerQuery.includes('mean'))) {
      const avgPrice = suppliers.reduce((sum, s) => sum + s.price_per_unit_inr, 0) / suppliers.length;
      const minPrice = Math.min(...suppliers.map(s => s.price_per_unit_inr));
      const maxPrice = Math.max(...suppliers.map(s => s.price_per_unit_inr));
      return `💰 **Price Statistics:**\n\n📊 Average: ₹${avgPrice.toFixed(2)}/unit\n📉 Minimum: ₹${minPrice}/unit\n📈 Maximum: ₹${maxPrice}/unit\n📍 Range: ₹${minPrice} - ₹${maxPrice}`;
    }

    // Question: Location-based
    if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
      const locations = Array.from(new Set(suppliers.map(s => s.supplier_location)));
      return `📍 **Supplier Locations:**\n\n${locations.slice(0, 10).map(loc => `• ${loc}`).join('\n')}\n\n...and ${locations.length - 10} more locations across Bangalore.`;
    }

    // Question: Top 5 suppliers
    if (lowerQuery.includes('top') && (lowerQuery.includes('supplier') || lowerQuery.includes('5') || lowerQuery.includes('10'))) {
      const top5 = suppliers
        .map(s => ({
          ...s,
          score: (s.quality_score * 0.4) + ((10 - (s.price_per_unit_inr / 50)) * 0.3) + ((10 - (s.delivery_time_days / 3)) * 0.3)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      return `🏆 **Top 5 Recommended Suppliers:**\n\n${top5.map((s, i) => 
        `${i + 1}. **${s.supplier}**\n   ⭐ Quality: ${s.quality_score}/10 | 💰 Price: ₹${s.price_per_unit_inr} | 🚚 ${s.delivery_time_days} days`
      ).join('\n\n')}`;
    }

    // Question: Compare two suppliers
    if (lowerQuery.includes('compare')) {
      const supplierNames = suppliers.map(s => s.supplier.toLowerCase());
      const mentioned = supplierNames.filter(name => lowerQuery.includes(name));
      
      if (mentioned.length >= 2) {
        const s1 = suppliers.find(s => s.supplier.toLowerCase() === mentioned[0])!;
        const s2 = suppliers.find(s => s.supplier.toLowerCase() === mentioned[1])!;
        
        return `⚖️ **Comparison: ${s1.supplier} vs ${s2.supplier}**\n\n` +
          `**Quality Score:**\n${s1.supplier}: ${s1.quality_score}/10\n${s2.supplier}: ${s2.quality_score}/10\n${s1.quality_score > s2.quality_score ? '✅ ' + s1.supplier + ' wins' : '✅ ' + s2.supplier + ' wins'}\n\n` +
          `**Price:**\n${s1.supplier}: ₹${s1.price_per_unit_inr}\n${s2.supplier}: ₹${s2.price_per_unit_inr}\n${s1.price_per_unit_inr < s2.price_per_unit_inr ? '✅ ' + s1.supplier + ' cheaper' : '✅ ' + s2.supplier + ' cheaper'}\n\n` +
          `**Delivery:**\n${s1.supplier}: ${s1.delivery_time_days} days\n${s2.supplier}: ${s2.delivery_time_days} days\n${s1.delivery_time_days < s2.delivery_time_days ? '✅ ' + s1.supplier + ' faster' : '✅ ' + s2.supplier + ' faster'}`;
      }
    }

    // Question: High quality under budget
    if (lowerQuery.match(/under|below|less than.*\d+/) && (lowerQuery.includes('quality') || lowerQuery.includes('good'))) {
      const priceMatch = lowerQuery.match(/\d+/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[0]);
        const filtered = suppliers
          .filter(s => s.price_per_unit_inr <= maxPrice)
          .sort((a, b) => b.quality_score - a.quality_score)
          .slice(0, 5);
        
        if (filtered.length > 0) {
          return `🎯 **Best Quality Suppliers Under ₹${maxPrice}:**\n\n${filtered.map((s, i) => 
            `${i + 1}. **${s.supplier}**\n   ⭐ Quality: ${s.quality_score}/10 | 💰 ₹${s.price_per_unit_inr}/unit`
          ).join('\n\n')}`;
        }
      }
    }

    // Generic retrieval - find relevant suppliers
    const keywords = lowerQuery.split(' ').filter(w => w.length > 3);
    const relevant = await csvRAGService.retrieveRelevantSuppliers(query, 5);
    
    if (relevant.length > 0) {
      return `🔍 **Based on your query, here are relevant suppliers:**\n\n${relevant.map((s, i) => 
        `${i + 1}. **${s.supplier}**\n   ⭐ Quality: ${s.quality_score}/10 | 💰 ₹${s.price_per_unit_inr} | 🚚 ${s.delivery_time_days} days\n   📍 ${s.supplier_location}`
      ).join('\n\n')}`;
    }

    return `💡 I can help you with:\n\n• Finding the best quality suppliers\n• Comparing prices and delivery times\n• Supplier details and locations\n• Top recommendations\n• Price statistics\n\nTry asking: "Who has the best quality?" or "Show me the top 5 suppliers"`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-violet-900/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/20 bg-gradient-to-r from-violet-500/20 to-purple-500/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Bot className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white">AI Supplier Assistant</h3>
          <p className="text-xs text-purple-200">Powered by RAG Technology</p>
        </div>
        <Sparkles className="ml-auto text-violet-300 animate-pulse" size={20} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-gray-900/50 to-purple-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about suppliers..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:border-violet-400 backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-purple-300/60 mt-2 text-center">
          Ask me about quality, prices, delivery times, or request comparisons!
        </p>
      </div>
    </div>
  );
};
