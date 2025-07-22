// API Configuration for Toronto Grid Data
export const API_CONFIG = {
  // IESO (Independent Electricity System Operator) - Ontario
  IESO: {
    BASE_URL: "https://www.ieso.ca/-/media/files/ieso/uploaded/chart",
    ENDPOINTS: {
      DEMAND: "/price_forecast.csv",
      GENERATION: "/generation_by_fuel_type.csv",
      MARKET_PRICES: "/market_prices.csv",
      INTERCONNECTION_FLOWS: "/interconnection_flows.csv",
    },
    UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
    REGION: "Ontario",
  },

  // Environment Canada Weather API
  WEATHER: {
    BASE_URL: "https://api.weather.gc.ca/collections/observation/items",
    STATION_ID: "TORONTO", // Toronto Pearson Airport
    UPDATE_INTERVAL: 15 * 60 * 1000, // 15 minutes
    REGION: "Toronto",
  },

  // Ontario Energy Board
  OEB: {
    BASE_URL: "https://www.oeb.ca/api",
    ENDPOINTS: {
      CONSUMPTION: "/consumption",
      RATES: "/rates",
      UTILITIES: "/utilities",
    },
    UPDATE_INTERVAL: 60 * 60 * 1000, // 1 hour
    REGION: "Ontario",
  },

  // Natural Resources Canada
  NRCAN: {
    BASE_URL: "https://www.nrcan.gc.ca/api",
    ENDPOINTS: {
      ENERGY_STATS: "/energy-statistics",
      RENEWABLE_DATA: "/renewable-energy",
      PROVINCIAL_DATA: "/provincial-energy",
    },
    UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
    REGION: "Canada",
  },
};

// Environment variables (set these in your .env file)
export const ENV_VARS = {
  WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY || "",
  IESO_API_KEY: import.meta.env.VITE_IESO_API_KEY || "",
  OEB_API_KEY: import.meta.env.VITE_OEB_API_KEY || "",
  NRCAN_API_KEY: import.meta.env.VITE_NRCAN_API_KEY || "",
};

// API Rate limiting configuration
export const RATE_LIMITS = {
  IESO: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  },
  WEATHER: {
    requestsPerMinute: 30,
    requestsPerHour: 500,
  },
  OEB: {
    requestsPerMinute: 20,
    requestsPerHour: 200,
  },
  NRCAN: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
  },
};

// Error handling configuration
export const ERROR_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  TIMEOUT: 10000, // 10 seconds
  FALLBACK_TO_MOCK: true,
};

// Data validation schemas
export const DATA_SCHEMAS = {
  DEMAND_DATA: {
    required: ["timestamp", "demand"],
    types: {
      timestamp: "string",
      demand: "number",
    },
  },
  GENERATION_DATA: {
    required: ["timestamp", "nuclear", "hydro", "gas", "wind", "solar"],
    types: {
      timestamp: "string",
      nuclear: "number",
      hydro: "number",
      gas: "number",
      wind: "number",
      solar: "number",
      biomass: "number",
      coal: "number",
    },
  },
};
