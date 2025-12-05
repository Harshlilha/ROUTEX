import { useNavigate } from 'react-router-dom';
import { Zap, Shield, TrendingUp, Award } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-4xl">R</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Route X
            </h1>
            <p className="text-2xl text-purple-200 mb-4">
              AI-Powered Supplier Decision Assistant
            </p>
            <div className="flex items-center justify-center gap-2 text-violet-300">
              <Zap size={20} className="animate-pulse" />
              <span className="text-sm font-semibold">Powered by Enterprise RAG Technology</span>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-12 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Data-Driven Supplier Intelligence
            </h2>
            <p className="text-lg text-purple-100 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
              Leverage advanced Retrieval-Augmented Generation on 200 verified Bangalore suppliers. 
              <span className="text-violet-300 font-semibold"> Zero hallucination.</span> Every decision backed by real data.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur rounded-2xl p-6 text-center border border-violet-400/30 transform hover:scale-110 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-violet-300 mb-2">200</div>
                <div className="text-sm text-purple-200 font-medium">Verified Suppliers</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur rounded-2xl p-6 text-center border border-purple-400/30 transform hover:scale-110 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-purple-300 mb-2">100%</div>
                <div className="text-sm text-purple-200 font-medium">Data Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-violet-500/20 backdrop-blur rounded-2xl p-6 text-center border border-pink-400/30 transform hover:scale-110 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-pink-300 mb-2">95%</div>
                <div className="text-sm text-purple-200 font-medium">AI Confidence</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xl py-5 px-10 rounded-2xl shadow-2xl hover:shadow-violet-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Zap size={24} />
              Launch Dashboard
              <TrendingUp size={24} />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <div className="text-white font-bold mb-2 text-lg">Zero Hallucination</div>
              <div className="text-sm text-purple-200">100% data-backed decisions, no assumptions</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="text-white font-bold mb-2 text-lg">Smart Analytics</div>
              <div className="text-sm text-purple-200">Interactive dashboards with visual insights</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-pink-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <div className="text-white font-bold mb-2 text-lg">Instant Results</div>
              <div className="text-sm text-purple-200">Real-time supplier analysis and comparison</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="text-white" size={24} />
              </div>
              <div className="text-white font-bold mb-2 text-lg">Enterprise Grade</div>
              <div className="text-sm text-purple-200">Production-ready RAG architecture</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-purple-300/60 text-sm">
            © 2025 Route X • Enterprise Supplier Intelligence Platform
          </div>
        </div>
      </div>
    </div>
  );
};
