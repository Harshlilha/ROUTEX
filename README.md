# 🚀 Route X - AI Supplier Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Route X** is an enterprise-grade AI-powered supplier intelligence platform that transforms how businesses analyze and compare suppliers. Built with cutting-edge technologies, it combines beautiful 3D animations, interactive data visualizations, and RAG-powered conversational AI.

![Route X Dashboard](https://via.placeholder.com/1200x600/4f46e5/ffffff?text=Route+X+Dashboard)

## ✨ Features

### 🎨 **Beautiful UI/UX**
- **3D Animations**: Smooth hover effects with rotation, scaling, and colored shadows
- **Multi-Gradient Backgrounds**: Dynamic color schemes (Indigo → Purple → Pink)
- **Animated Orbs**: 4 floating background orbs with staggered animations
- **Glass Morphism**: Modern frosted glass panels and cards

### 📊 **Interactive Dashboards**
- **Top 10 Quality Suppliers** - Bar chart with gradient fills
- **Price Distribution** - Pie chart with 8 price categories
- **Delivery Time Analysis** - Pie chart with 5 time brackets
- **Quality vs Price** - Scatter plot with 300+ data points

### 🤖 **RAG-Powered AI Chatbot**
Ask questions in natural language:
- "Which supplier has the best quality?"
- "Show me the cheapest suppliers"
- "Compare ABC Corp and XYZ Ltd"
- "Top 5 suppliers with fastest delivery"
- "Average price for electronics suppliers"

### 🔍 **Smart Search**
- **Autocomplete**: Intelligent supplier suggestions
- **Real-time Filtering**: Instant results as you type
- **Top 8 Results**: Prioritized best matches

### 📈 **Analytics & Insights**
- Quality score analysis
- Price/unit comparisons
- Delivery time metrics
- Location-based filtering
- Statistical aggregations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│            Frontend (React + Vite)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Dashboard │  │ Chatbot  │  │  Search  │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │              │            │
│       └─────────────┴──────────────┘            │
│                     │                           │
│              ┌──────▼──────┐                    │
│              │   Services  │                    │
│              │  (RAG/CSV)  │                    │
│              └──────┬──────┘                    │
└─────────────────────┼──────────────────────────┘
                      │
          ┌───────────▼───────────┐
          │   Supabase Backend    │
          │  - PostgreSQL DB      │
          │  - Authentication     │
          │  - Real-time Updates  │
          └───────────────────────┘
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture diagrams.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Harshlilha/route-x.git
cd route-x

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18.3** | UI framework with hooks |
| **TypeScript 5.5** | Type safety |
| **Vite 5.4** | Lightning-fast build tool |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Recharts 2.x** | Data visualization |
| **Supabase** | Backend & auth |
| **Zustand** | State management |

## 📖 Documentation

- **[Installation Guide](./docs/INSTALLATION.md)** - Setup, deployment, troubleshooting
- **[Architecture](./docs/ARCHITECTURE.md)** - System design, RAG pipeline, diagrams
- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute to this project
- **[GitHub Deployment](./GITHUB_DEPLOYMENT.md)** - Deploy to Vercel/Netlify

## 🎯 Key Components

### ChatBot (`src/components/ChatBot.tsx`)
RAG-powered conversational AI with 15+ query patterns:
- Quality-based searches
- Price comparisons
- Delivery time analysis
- Statistical calculations
- Multi-criteria filtering

### Dashboard (`src/pages/DashboardNew.tsx`)
Interactive control center with:
- 4 animated chart types
- 5 action buttons (Add, Compare, Export, Analytics, Refresh)
- Floating chatbot modal
- Search autocomplete
- Colorful gradient cards

### CSV RAG Service (`src/services/csv-rag.service.ts`)
- Cosine similarity search
- TF-IDF vectorization
- Natural language query processing
- 200+ supplier dataset

## 📊 Sample Queries

```typescript
// Chatbot understands these naturally:
"Show best quality suppliers"
"Cheapest electronics suppliers"
"Compare ABC Corp and XYZ Ltd"
"Top 5 fastest delivery times"
"Suppliers in Bangalore under ₹500"
"Average price for quality score > 90"
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server (with hot reload)
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**Harsh Lilha**
- GitHub: [@Harshlilha](https://github.com/Harshlilha)

## 🙏 Acknowledgments

- Recharts for beautiful visualizations
- Tailwind CSS for rapid styling
- Supabase for seamless backend
- React community for amazing tools

## 📸 Screenshots

### Dashboard with Charts
![Dashboard](https://via.placeholder.com/800x500/4f46e5/ffffff?text=Dashboard+View)

### AI Chatbot Interface
![Chatbot](https://via.placeholder.com/800x500/8b5cf6/ffffff?text=AI+Chatbot)

### Search Autocomplete
![Search](https://via.placeholder.com/800x500/ec4899/ffffff?text=Smart+Search)

---

<div align="center">

**[⭐ Star this repository](https://github.com/Harshlilha/route-x)** if you find it helpful!

Made with ❤️ by [Harsh Lilha](https://github.com/Harshlilha)

</div>
