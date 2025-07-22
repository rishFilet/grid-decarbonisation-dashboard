# Grid Decarbonization Dashboard - Deployment Guide

## 🚀 Deploying to Netlify

### Prerequisites

- A GitHub/GitLab/Bitbucket account
- A Netlify account (free tier available)

### Method 1: Deploy via Netlify UI (Recommended)

1. **Push to Git Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with your Git provider
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Method 3: Drag & Drop

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Drag the `dist` folder** to [app.netlify.com/drop](https://app.netlify.com/drop)

## 🔧 Environment Variables (Optional)

If you want to use real API data, add these environment variables in Netlify:

1. Go to Site Settings > Environment Variables
2. Add the following variables:
   ```
   VITE_WEATHER_API_KEY=your_weather_api_key
   VITE_IESO_API_KEY=your_ieso_api_key
   VITE_OEB_API_KEY=your_oeb_api_key
   VITE_NRCAN_API_KEY=your_nrcan_api_key
   ```

## 📁 Project Structure

```
grid-decarbonization-dashboard/
├── dist/                    # Build output (deployed to Netlify)
├── src/
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── utils/             # Utilities and mock data
│   └── App.tsx           # Main app component
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## 🎯 Features Deployed

- ✅ Real-time grid decarbonization dashboard
- ✅ Interactive energy mix charts
- ✅ Geographic energy map with OpenStreetMap
- ✅ Custom timeframe selection (1h to 50 years)
- ✅ Responsive design with nature-inspired colors
- ✅ API integration with fallback to mock data
- ✅ Carbon intensity tracking
- ✅ Decarbonization progress indicators

## 🔄 Continuous Deployment

Once connected to Git, Netlify will automatically:

- Build and deploy on every push to main branch
- Create preview deployments for pull requests
- Provide instant rollbacks

## 🌐 Custom Domain (Optional)

1. Go to Site Settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## 📊 Performance

The dashboard is optimized for:

- Fast loading times (< 3s)
- Mobile responsiveness
- SEO-friendly structure
- Progressive enhancement

## 🛠️ Troubleshooting

### Build Errors

- Ensure Node.js version 18+ is used
- Check that all dependencies are installed
- Verify TypeScript compilation passes

### Runtime Errors

- Check browser console for errors
- Verify API endpoints are accessible
- Ensure environment variables are set correctly

### Performance Issues

- The build includes code splitting
- Large bundle size is expected due to chart libraries
- Consider lazy loading for non-critical components

## 📈 Analytics

Add Google Analytics or other tracking by modifying `index.html`:

```html
<!-- Add before closing </head> tag -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
```

## 🔒 Security

- Environment variables are encrypted
- API keys are not exposed in client-side code
- HTTPS is enabled by default on Netlify

## 📞 Support

For deployment issues:

1. Check Netlify build logs
2. Verify `netlify.toml` configuration
3. Ensure all files are committed to Git
4. Contact Netlify support if needed

---

**Happy Deploying! 🚀**
