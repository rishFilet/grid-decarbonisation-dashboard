# Toronto Grid Data APIs

This document outlines the available APIs for real-time grid data in Toronto and Ontario, Canada.

## 🇨🇦 **Primary Data Sources**

### **1. IESO (Independent Electricity System Operator) - Ontario**

**Best option for Toronto grid data**

**Website**: https://www.ieso.ca/en/power-data
**API Base URL**: https://www.ieso.ca/-/media/files/ieso/uploaded/chart
**Coverage**: Ontario (includes Toronto)
**Cost**: Free (public data)
**Update Frequency**: 5 minutes

#### **Available Endpoints:**

```typescript
// Real-time demand and forecast
const demandURL =
  "https://www.ieso.ca/-/media/files/ieso/uploaded/chart/price_forecast.csv";

// Generation by fuel type
const generationURL =
  "https://www.ieso.ca/-/media/files/ieso/uploaded/chart/generation_by_fuel_type.csv";

// Market prices
const pricesURL =
  "https://www.ieso.ca/-/media/files/ieso/uploaded/chart/market_prices.csv";

// Interconnection flows
const flowsURL =
  "https://www.ieso.ca/-/media/files/ieso/uploaded/chart/interconnection_flows.csv";
```

#### **Data Format (CSV):**

```csv
Timestamp,Demand,Forecast
2024-01-15T10:00:00,15000,15200
2024-01-15T10:05:00,15100,15300
```

#### **Generation Data Format:**

```csv
Timestamp,Nuclear,Hydro,Gas,Wind,Solar,Biomass,Coal
2024-01-15T10:00:00,8000,3000,2000,1500,500,200,0
```

### **2. Environment Canada Weather API**

**For weather correlation with renewable energy**

**API Base URL**: https://api.weather.gc.ca/collections/observation/items
**Coverage**: Toronto Pearson Airport
**Cost**: Free
**Update Frequency**: 15 minutes

#### **Endpoint:**

```typescript
const weatherURL =
  "https://api.weather.gc.ca/collections/observation/items?station=TORONTO&limit=1";
```

#### **Response Format:**

```json
{
  "features": [
    {
      "properties": {
        "temperature": { "value": 25.5 },
        "wind_speed": { "value": 12.3 },
        "solar_radiation": { "value": 850 },
        "humidity": { "value": 65 }
      }
    }
  ]
}
```

### **3. Ontario Energy Board (OEB)**

**For consumption and rate data**

**Website**: https://www.oeb.ca/industry/regulatory-filings
**Coverage**: Ontario utilities
**Cost**: Free
**Update Frequency**: Hourly

#### **Available Data:**

- Energy consumption by utility
- Rate information
- Regulatory filings
- Utility performance metrics

### **4. Natural Resources Canada (NRCan)**

**For provincial energy statistics**

**Website**: https://www.nrcan.gc.ca/energy-economy/data-analysis/energy-data
**Coverage**: Canada-wide (provincial breakdown)
**Cost**: Free
**Update Frequency**: Daily

#### **Available Data:**

- Provincial energy statistics
- Renewable energy capacity
- Energy consumption trends
- Carbon emissions data

## 🔌 **API Integration Examples**

### **Fetching IESO Data:**

```typescript
async function fetchIESODemand() {
  try {
    const response = await fetch(
      "https://www.ieso.ca/-/media/files/ieso/uploaded/chart/price_forecast.csv"
    );
    const csvText = await response.text();

    // Parse CSV data
    const lines = csvText.split("\n").slice(1);
    return lines.map((line) => {
      const [timestamp, demand, forecast] = line.split(",");
      return {
        timestamp: new Date(timestamp).toISOString(),
        demand: parseFloat(demand) || 0,
        forecast: parseFloat(forecast) || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching IESO data:", error);
    return [];
  }
}
```

### **Fetching Weather Data:**

```typescript
async function fetchTorontoWeather() {
  try {
    const response = await fetch(
      "https://api.weather.gc.ca/collections/observation/items?station=TORONTO&limit=1"
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const observation = data.features[0].properties;
      return {
        temperature: observation.temperature?.value || 0,
        windSpeed: observation.wind_speed?.value || 0,
        solarRadiation: observation.solar_radiation?.value || 0,
        humidity: observation.humidity?.value || 0,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
```

## 📊 **Data Transformation**

### **Carbon Intensity Calculation:**

```typescript
function calculateCarbonIntensity(generation: any) {
  const factors = {
    nuclear: 0, // gCO2/kWh
    hydro: 0,
    wind: 0,
    solar: 0,
    biomass: 45,
    gas: 490,
    coal: 820,
  };

  const totalGeneration = Object.values(generation).reduce(
    (sum: number, val: number) => sum + val,
    0
  );
  if (totalGeneration === 0) return 0;

  const totalEmissions = Object.entries(generation).reduce(
    (sum: number, [fuel, amount]: [string, number]) => {
      return sum + amount * (factors[fuel as keyof typeof factors] || 0);
    },
    0
  );

  return totalEmissions / totalGeneration;
}
```

### **Renewable Percentage:**

```typescript
function calculateRenewablePercentage(generation: any) {
  const renewableSources = ["hydro", "wind", "solar", "biomass"];
  const totalGeneration = Object.values(generation).reduce(
    (sum: number, val: number) => sum + val,
    0
  );
  const renewableGeneration = renewableSources.reduce(
    (sum: number, source: string) => {
      return sum + (generation[source] || 0);
    },
    0
  );

  return totalGeneration > 0
    ? (renewableGeneration / totalGeneration) * 100
    : 0;
}
```

## 🚀 **Implementation in Dashboard**

The dashboard now includes:

1. **TorontoGridAPIService**: Handles all API calls
2. **Real-time data fetching**: Every 5 seconds
3. **Fallback to mock data**: If APIs fail
4. **Data source indicator**: Shows whether using real or mock data
5. **Error handling**: Graceful degradation

### **Usage:**

```typescript
import TorontoGridAPIService from "./services/torontoGridAPI";

const api = new TorontoGridAPIService();
const dashboardData = await api.getDashboardData();
```

## 🔧 **Setup Instructions**

1. **Copy environment file:**

```bash
cp env.example .env
```

2. **Add API keys (if required):**

```bash
# Edit .env file
VITE_WEATHER_API_KEY=your_key_here
VITE_IESO_API_KEY=your_key_here
```

3. **Start the application:**

```bash
npm run dev
```

## 📈 **Data Quality Notes**

- **IESO data**: Most reliable, updated every 5 minutes
- **Weather data**: Good for renewable energy correlation
- **OEB data**: Less frequent updates, good for historical analysis
- **NRCan data**: Daily updates, good for long-term trends

## 🌐 **Alternative Data Sources**

### **For More Detailed Data:**

- **Toronto Hydro**: https://www.torontohydro.com/
- **Hydro One**: https://www.hydroone.com/
- **IESO Market Data**: https://www.ieso.ca/en/market-data

### **For Historical Analysis:**

- **Statistics Canada**: https://www.statcan.gc.ca/
- **Ontario Ministry of Energy**: https://www.ontario.ca/page/energy

## 🔒 **Rate Limiting & Best Practices**

- **IESO**: 60 requests/minute, 1000/hour
- **Weather API**: 30 requests/minute, 500/hour
- **OEB**: 20 requests/minute, 200/hour
- **NRCan**: 10 requests/minute, 100/hour

### **Recommended Implementation:**

```typescript
// Cache data to avoid excessive API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(url: string) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await fetch(url);
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

## 📞 **Support & Documentation**

- **IESO**: https://www.ieso.ca/en/contact-us
- **Environment Canada**: https://weather.gc.ca/mainmenu/contact_us_e.html
- **OEB**: https://www.oeb.ca/contact-us
- **NRCan**: https://www.nrcan.gc.ca/contact-us

---

_Last updated: January 2024_
