#!/bin/bash

# Open MES - Deployment Script

echo "📦 Preparing Open MES for deployment..."

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📝 Next steps to deploy:"
echo "1. Run: git add ."
echo "2. Run: git commit -m 'Initial commit: Open MES v1.0'"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "🚀 For Vercel deployment:"
echo "1. Go to https://vercel.com/import"
echo "2. Import your GitHub repository"
echo "3. Vercel will auto-detect Vite and deploy!"