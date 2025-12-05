# Route X - AI-Powered Supplier Decision Support Engine

## 🧠 RAG-Powered Intelligence System

Route X is an enterprise-grade **Retrieval-Augmented Generation (RAG)** supplier decision support platform built for Indian procurement teams. Unlike traditional AI that hallucinates data, Route X grounds every decision in verified historical records, contracts, reviews, and disruption events.

## 🎯 Core Capabilities

### 1. **RAG-Based Supplier Analysis**
- **Zero Hallucination Policy**: All outputs derived from retrieved documents
- Multi-source data retrieval from:
  - Supplier master dataset (1000+ verified suppliers)
  - Time-series contract history (12-24 month lookback)
  - NLP-analyzed customer & internal reviews
  - Geopolitical & logistics disruption events
  - AI vs Human decision conflict logs

### 2. **Intelligent Decision Engine**
- **AI Scoring Algorithm**:
  - 40% Delivery Reliability Weight
  - 25% Quality (Inverse Defect Rate)
  - 20% ESG Performance
  - 15% Risk Penalty (Geo + Financial)

- **Human Scorecard Comparison**:
  - Historical preference bias tracking
  - Trust rating aggregation
  - Manual override pattern detection

- **Conflict Index Calculation**:
  - Measures divergence between AI and Human assessments
  - Flags high-conflict decisions for review
  - Provides explainability for disagreements

### 3. **Multi-Dimensional Risk Analysis**
- **Logistics Risk**: Disruption event frequency, seasonal patterns, infrastructure status
- **Financial Risk**: Credit scores, payment history, bankruptcy probability
- **Geopolitical Risk**: Regional instability, trade policy changes, political unrest

### 4. **Predictive Analytics**
- **Trend-Based Forecasting**: IMPROVING / STABLE / DECLINING
- **Disruption Probability**: Based on historical event patterns
- **Next Quarter Reliability**: Time-series prediction model
- **No Speculation**: Only uses verified historical patterns

## 📊 Data Sources

### Structured Datasets (CSV Format)
1. **suppliers_1k.csv**
   - 1000+ Indian suppliers with baseline metrics
   - Fields: ESG score, delivery %, defect rate, location, category
   
2. **contracts_1k.csv**
   - Historical contract performance data
   - Fields: Value, on-time delivery, quality scores, AI/Human scores
   
3. **decisions_1k.csv**
   - Past decision outcomes and reasoning
   - Fields: Decision type, conflict indicators, justifications
   
4. **chats_1k.csv**
   - Procurement manager-AI conversation logs
   - Used for context and preference learning
   
5. **reviews_1k.csv**
   - Customer and internal supplier reviews
   - NLP sentiment analysis (Positive/Neutral/Negative)
   
6. **events_1k.csv**
   - Disruption events (floods, strikes, highway blockages)
   - Severity: Critical/High/Medium/Low
   - Affected cities and duration tracking

## 🚀 Key Features

### **RAG Analysis Dashboard**
Navigate to `/rag-analysis` for comprehensive supplier evaluation:
- **Intelligent Search**: Natural language queries like "best electronics supplier in Chennai with high ESG"
- **Deep Analysis**: Click any supplier for 9-section comprehensive report
- **Visual Insights**: Risk heatmaps, performance trends, prediction charts

### **AI Chat Interface**
RAG-powered chat at `/chat`:
```
User: "Which supplier is best for electronics in Chennai for Q3 2025 with low risk and high ESG?"

AI: Retrieves top 5-10 suppliers → Analyzes contracts → Checks disruption events
    → Returns data-grounded recommendation with metrics and justification
```

### **Decision Comparison**
Compare AI vs Human decisions:
- Side-by-side score visualization
- Conflict index highlighting
- Reasoning explanation for divergences

### **Disruption Tracking**
Real-time monitoring at `/events`:
- Active disruption events by region
- Severity-based filtering
- Impact on supplier reliability

## 🏗️ Architecture

```
Frontend (React + TypeScript)
├── RAG Analysis Page (Deep supplier evaluation)
├── AI Chat (Natural language interface)
├── Contracts Dashboard (Performance tracking)
├── Reviews Dashboard (Sentiment analysis)
├── Events Dashboard (Disruption monitoring)
└── Analytics (Aggregate insights)

Backend (Supabase)
├── PostgreSQL Database
│   ├── suppliers (Master data)
│   ├── contracts (Time-series performance)
│   ├── decisions (Historical outcomes)
│   ├── chats (Conversation logs)
│   ├── reviews (NLP sentiment data)
│   └── events (Disruption records)
└── Real-time subscriptions

RAG Service (src/services/rag.service.ts)
├── retrieveRelevantSuppliers() - Vector similarity search
├── getSupplierContext() - Multi-source retrieval
├── calculateAIScore() - Weighted algorithm
├── calculateHumanScore() - Historical patterns
├── analyzeRisks() - Multi-dimensional risk
├── analyzeSupplier() - Comprehensive evaluation
└── getAIChatResponse() - Natural language interface
```

## 📋 Output Format (Strict)

Every RAG analysis includes **9 mandatory sections**:

1. 📦 **Supplier Overview** - Name, location, category
2. 📊 **Key Performance Metrics** - Delivery, quality, ESG, cost
3. 🧠 **AI Score vs 👤 Human Score** - Comparative analysis
4. ⚠️ **Risk Analysis** - Logistics, financial, geopolitical
5. 🗺️ **Disruption Impact** - Event correlation
6. 💬 **Review Insights** - Sentiment analysis
7. ✅ **Final Decision** - APPROVE / APPROVE_WITH_MONITORING / REJECT
8. 🔮 **Performance Prediction** - 3-6 month forecast
9. 👍 **Confidence Score** - 0-100% based on data quality

## 🎨 Design Philosophy

### **Apple-Inspired 3D Animations**
- Gradient orb floating backgrounds
- Mouse-tracking particle effects
- Glass morphism UI (backdrop-blur, transparency)
- Smooth Framer Motion transitions
- Violet/Purple color scheme replacing traditional blue

### **Enterprise-Grade UX**
- Zero-clutter information architecture
- Progressive disclosure of complex data
- Accessibility-first design
- Mobile-responsive layouts

## 🔒 Behavior Rules

1. **No Hallucination**: If retrieved data is insufficient → Return: *"Insufficient verified data for reliable decision"*
2. **Always Cite**: Reference dataset fields in reasoning
3. **Indian Context**: Consider monsoons, ports, highways, GST delays, labor unions
4. **Enterprise Tone**: Professional, data-driven, actionable

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1, TypeScript, Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1, Framer Motion 12.23.25
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Routing**: React Router DOM 7.10.1
- **State**: Zustand (src/store/useStore.ts)

## 📦 Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## 🌐 Environment Variables

```env
VITE_SUPABASE_URL=https://lfgvflgdjggqbvtavhje.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🎯 Goal

Outperform traditional human scorecards by:
- ✅ Reducing supplier failure risk by 40%
- ✅ Improving ESG compliance by 35%
- ✅ Increasing delivery reliability by 25%
- ✅ Avoiding 90% of predictable disruptions

## 🚦 Getting Started

1. **Sign Up** → Create account at `/signup`
2. **Explore RAG Analysis** → Navigate to `/rag-analysis`
3. **Search Suppliers** → Use natural language queries
4. **Analyze Deeply** → Select supplier for comprehensive 9-section report
5. **Chat with AI** → Ask questions at `/chat` with data-grounded responses

## 📱 Page Routes

- `/` - Landing page with feature overview
- `/login` - User authentication
- `/signup` - New user registration
- `/dashboard` - Main dashboard with stats
- `/chat` - RAG-powered AI chat interface
- `/rag-analysis` - Comprehensive supplier analysis (NEW)
- `/contracts` - Contract performance tracking
- `/reviews` - Review sentiment analysis
- `/events` - Disruption event monitoring
- `/analytics` - Aggregate insights
- `/comparison` - Supplier comparison tool
- `/history` - Decision history
- `/profile` - User profile management

## 📈 Future Roadmap

- [ ] Real-time disruption alerts via WebSocket
- [ ] ML model training on historical decisions
- [ ] PDF contract parsing and ingestion
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile app (React Native)
- [ ] Advanced vector similarity search
- [ ] Custom RAG model fine-tuning

## 📄 License

Proprietary - Route X Enterprise Platform

---

**Built with ❤️ for Indian Procurement Teams**
