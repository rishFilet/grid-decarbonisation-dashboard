# Grid Decarbonization Dashboard

A real-time interactive dashboard for monitoring grid decarbonization progress and renewable energy integration. Built with React, TypeScript, and modern web technologies.

## 🌱 Features

- **Real-time Data Visualization**: Live updates every 5 seconds with realistic mock data
- **Energy Mix Analysis**: Interactive stacked area chart showing generation by source
- **Carbon Emissions Tracking**: Line chart with target reference lines
- **Renewable Progress**: Progress bars and capacity indicators for renewable sources
- **Grid Status Monitoring**: Real-time grid health indicators and alerts
- **Nature-Inspired Design**: Earthy, climate-focused color scheme

## 🎨 Design Philosophy

The dashboard uses a nature-inspired color palette:

- **Forest Greens**: Representing renewable energy and sustainability
- **Ocean Blues**: Symbolizing clean energy and progress
- **Earth Browns**: Grounding the interface in natural elements
- **Sunset Oranges**: Highlighting important alerts and warnings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd grid-decarbonization-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📊 Dashboard Components

### Grid Overview

- Total generation and demand metrics
- Renewable energy percentage
- Carbon intensity indicators
- Grid efficiency monitoring

### Energy Mix Chart

- 24-hour stacked area chart
- Real-time generation by source:
  - Solar (with day/night variations)
  - Wind
  - Hydroelectric
  - Nuclear
  - Natural Gas
  - Coal
  - Biomass

### Carbon Emissions

- Real-time emissions tracking
- Target reference lines
- Reduction percentage calculations
- Historical trend analysis

### Renewable Progress

- Overall progress toward renewable targets
- Individual source capacity indicators
- Progress status and recommendations

### Grid Status

- Real-time grid health monitoring
- Frequency, voltage, and stability metrics
- Active alerts and warnings
- System status indicators

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful and composable charts
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful & consistent icon toolkit
- **date-fns** - Modern JavaScript date utility library

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Dashboard header
│   ├── GridOverview.tsx # Key metrics overview
│   ├── EnergyMix.tsx   # Energy mix chart
│   ├── CarbonEmissions.tsx # Emissions tracking
│   ├── RenewableProgress.tsx # Progress indicators
│   └── GridStatus.tsx  # Grid health monitoring
├── utils/
│   └── mockData.ts     # Mock data generation
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## 🎯 Key Features

### Real-time Updates

- Data refreshes every 5 seconds
- Smooth animations for data changes
- Live status indicators

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Interactive Charts

- Hover tooltips with detailed information
- Zoom and pan capabilities
- Customizable color schemes

### Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 🌍 Environmental Impact

This dashboard helps visualize and track:

- Renewable energy integration progress
- Carbon emission reductions
- Grid decarbonization targets
- Sustainable energy transition

## 📈 Future Enhancements

- Real API integration for live data
- Historical data analysis
- Predictive analytics
- Export functionality
- Mobile app version
- Multi-region support
- Advanced filtering and search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Icons from Lucide React
- Charts powered by Recharts
- Animations by Framer Motion
- Styling with Tailwind CSS

---

Built with ❤️ for a sustainable future
