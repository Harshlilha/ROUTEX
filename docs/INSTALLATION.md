# Route X - Setup & Deployment Guide

## 📥 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Local Development Setup

1. **Clone the Repository**
```bash
git clone https://github.com/Harshlilha/route-x.git
cd route-x
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

4. **Build for Production**
```bash
npm run build
```

5. **Preview Production Build**
```bash
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

### Deploy to GitHub Pages

1. **Update `vite.config.ts`**
```typescript
export default defineConfig({
  base: '/route-x/',
  // ... other config
});
```

2. **Build and Deploy**
```bash
npm run build
npx gh-pages -d dist
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Route X
VITE_API_URL=your-api-url
```

### CSV Data Location

Ensure the CSV file is in the correct location:
```
public/bangalore_supplier_realistic_dataset_200.csv
```

## 📊 Data Format

The CSV file must have the following columns:
- Supplier Name
- Quality Score
- Quantity Capacity
- Price/Unit (INR)
- Delivery Time (Days)
- Supplier Location
- Traffic Connections
- Business Results
- Number of Employees
- Serviceability
- Reputation
- Flexibility
- Financial Condition
- Asset Condition
- Payment Terms

## 🐛 Troubleshooting

### Common Issues

**Issue: CSV file not loading**
- Ensure the file is in `/public/` directory
- Check file name matches exactly
- Verify CSV format is valid

**Issue: Charts not displaying**
- Clear browser cache
- Check console for errors
- Verify recharts is installed: `npm install recharts`

**Issue: Build fails**
- Delete `node_modules` and `dist`
- Run `npm install` again
- Check TypeScript errors: `npm run type-check`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security

- No backend authentication required
- Data stored in CSV format
- Client-side only application
- No sensitive data transmission

## 🤝 Support

For issues and questions:
- GitHub Issues: [Create Issue](https://github.com/Harshlilha/route-x/issues)
- Email: support@routex.com
