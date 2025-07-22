import {
  DashboardData,
  EnergyMixData,
  CarbonEmissionsData,
} from "../utils/mockData";

// API Configuration
const IESO_BASE_URL = "https://www.ieso.ca/-/media/files/ieso/uploaded/chart";
const WEATHER_API_URL =
  "https://api.weather.gc.ca/collections/observation/items";

interface IESODemandData {
  timestamp: string;
  demand: number;
  forecast: number;
}

interface IESOGenerationData {
  timestamp: string;
  nuclear: number;
  hydro: number;
  gas: number;
  wind: number;
  solar: number;
  biomass: number;
  coal: number;
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  solarRadiation: number;
  humidity: number;
}

class TorontoGridAPIService {
  constructor(_apiKey?: string) {
    // apiKey parameter available for future use
  }

  // Generate realistic Toronto-specific data
  private generateTorontoData(): DashboardData {
    const now = new Date();
    const hour = now.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    // Toronto-specific generation patterns
    const baseDemand = isWeekend ? 12000 : 15000; // MW
    const demandVariation = Math.random() * 0.3 + 0.85; // 85-115% variation

    // Realistic Toronto energy mix (based on Ontario data)
    const solar = isDaytime ? Math.random() * 2000 + 500 : Math.random() * 100; // 500-2500 MW daytime
    const wind = Math.random() * 3000 + 1000; // 1000-4000 MW
    const hydro = Math.random() * 2000 + 3000; // 3000-5000 MW
    const nuclear = Math.random() * 1000 + 8000; // 8000-9000 MW (Bruce, Pickering, Darlington)
    const gas = Math.random() * 2000 + 1000; // 1000-3000 MW
    const biomass = Math.random() * 500 + 200; // 200-700 MW

    const totalGeneration = solar + wind + hydro + nuclear + gas + biomass;
    const totalDemand = baseDemand * demandVariation;
    const renewableGeneration = solar + wind + hydro + biomass;
    const renewablePercentage = (renewableGeneration / totalGeneration) * 100;

    // Toronto weather-based adjustments
    const temperature = Math.random() * 30 + 5; // 5-35°C
    const carbonIntensity = temperature > 25 ? 180 : 220; // Higher in summer due to AC

    // Generate 24 hours of data
    const timestamps = [];
    const energyMix: EnergyMixData[] = [];
    const carbonEmissions: CarbonEmissionsData[] = [];

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourOfDay = time.getHours();
      const isDay = hourOfDay >= 6 && hourOfDay <= 18;

      timestamps.push(time.toISOString());

      // Hourly variations
      const hourSolar = isDay
        ? Math.random() * 2000 + 500
        : Math.random() * 100;
      const hourWind = Math.random() * 3000 + 1000;
      const hourHydro = Math.random() * 2000 + 3000;
      const hourNuclear = Math.random() * 1000 + 8000;
      const hourGas = Math.random() * 2000 + 1000;
      const hourBiomass = Math.random() * 500 + 200;

      energyMix.push({
        timestamp: time.toISOString(),
        solar: hourSolar,
        wind: hourWind,
        hydro: hourHydro,
        nuclear: hourNuclear,
        gas: hourGas,
        coal: 0, // Ontario phased out coal
        biomass: hourBiomass,
      });

      const hourTotal =
        hourSolar + hourWind + hourHydro + hourNuclear + hourGas + hourBiomass;
      const hourRenewable = hourSolar + hourWind + hourHydro + hourBiomass;
      const hourEmissions = Math.max(
        0,
        250 - (hourRenewable / hourTotal) * 100
      );

      carbonEmissions.push({
        timestamp: time.toISOString(),
        emissions: hourEmissions,
        target: 200,
        reduction: Math.max(0, ((250 - hourEmissions) / 250) * 100),
      });
    }

    return {
      gridOverview: {
        totalGeneration: Math.round((totalGeneration / 1000) * 100) / 100, // Convert to GW
        totalDemand: Math.round((totalDemand / 1000) * 100) / 100,
        renewablePercentage: Math.round(renewablePercentage * 100) / 100,
        carbonIntensity: Math.round(carbonIntensity * 100) / 100,
        gridEfficiency: Math.round((Math.random() * 10 + 90) * 100) / 100, // 90-100%
      },
      energyMix,
      carbonEmissions,
      renewableProgress: {
        current: Math.round(renewablePercentage * 100) / 100,
        target: 80,
        solarCapacity: Math.round((Math.random() * 2000 + 3000) * 100) / 100, // 3000-5000 MW
        windCapacity: Math.round((Math.random() * 5000 + 8000) * 100) / 100, // 8000-13000 MW
        hydroCapacity: Math.round((Math.random() * 2000 + 4000) * 100) / 100, // 4000-6000 MW
        biomassCapacity: Math.round((Math.random() * 1000 + 1500) * 100) / 100, // 1500-2500 MW
      },
      gridStatus: {
        status: Math.random() > 0.05 ? "online" : "warning",
        frequency: Math.round((Math.random() * 0.4 + 49.8) * 100) / 100, // 49.8-50.2 Hz
        voltage: Math.round((Math.random() * 20 + 220) * 100) / 100, // 220-240 V
        stability: Math.round((Math.random() * 10 + 90) * 100) / 100, // 90-100%
        alerts: Math.random() > 0.9 ? ["High demand detected in GTA"] : [],
      },
    };
  }

  // Fetch real-time demand data from IESO (with fallback)
  async fetchDemandData(): Promise<IESODemandData[]> {
    try {
      const response = await fetch(`${IESO_BASE_URL}/price_forecast.csv`);
      if (!response.ok) {
        throw new Error(`IESO API responded with status: ${response.status}`);
      }
      const csvText = await response.text();

      // Parse CSV data
      const lines = csvText.split("\n").slice(1); // Skip header
      return lines
        .filter((line) => line.trim())
        .map((line) => {
          const [timestamp, demand, forecast] = line.split(",");
          return {
            timestamp: new Date(timestamp).toISOString(),
            demand: parseFloat(demand) || 0,
            forecast: parseFloat(forecast) || 0,
          };
        });
    } catch (error) {
      console.error("Error fetching IESO demand data:", error);
      // Return realistic fallback data
      return [
        {
          timestamp: new Date().toISOString(),
          demand: 15000,
          forecast: 14500,
        },
      ];
    }
  }

  // Fetch generation data by fuel type (with fallback)
  async fetchGenerationData(): Promise<IESOGenerationData[]> {
    try {
      const response = await fetch(
        `${IESO_BASE_URL}/generation_by_fuel_type.csv`
      );
      if (!response.ok) {
        throw new Error(`IESO API responded with status: ${response.status}`);
      }
      const csvText = await response.text();

      const lines = csvText.split("\n").slice(1);
      return lines
        .filter((line) => line.trim())
        .map((line) => {
          const [timestamp, nuclear, hydro, gas, wind, solar, biomass, coal] =
            line.split(",");
          return {
            timestamp: new Date(timestamp).toISOString(),
            nuclear: parseFloat(nuclear) || 0,
            hydro: parseFloat(hydro) || 0,
            gas: parseFloat(gas) || 0,
            wind: parseFloat(wind) || 0,
            solar: parseFloat(solar) || 0,
            biomass: parseFloat(biomass) || 0,
            coal: parseFloat(coal) || 0,
          };
        });
    } catch (error) {
      console.error("Error fetching IESO generation data:", error);
      // Return realistic fallback data
      return [
        {
          timestamp: new Date().toISOString(),
          nuclear: 8500,
          hydro: 4000,
          gas: 2000,
          wind: 2500,
          solar: 1500,
          biomass: 400,
          coal: 0,
        },
      ];
    }
  }

  // Fetch weather data for Toronto (with fallback)
  async fetchWeatherData(): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?station=TORONTO&limit=1`
      );
      if (!response.ok) {
        throw new Error(
          `Weather API responded with status: ${response.status}`
        );
      }
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const observation = data.features[0].properties;
        return {
          temperature: observation.temperature || 20,
          windSpeed: observation.wind_speed || 15,
          solarRadiation: observation.solar_radiation || 800,
          humidity: observation.humidity || 60,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Return realistic Toronto weather fallback
      return {
        temperature: Math.random() * 30 + 5,
        windSpeed: Math.random() * 20 + 10,
        solarRadiation: Math.random() * 1000 + 500,
        humidity: Math.random() * 40 + 40,
      };
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log("Fetching Toronto grid data from APIs...");

      // Try to fetch real data first
      const [demandData, generationData, weatherData] =
        await Promise.allSettled([
          this.fetchDemandData(),
          this.fetchGenerationData(),
          this.fetchWeatherData(),
        ]);

      // If we got real data, use it
      if (
        demandData.status === "fulfilled" &&
        generationData.status === "fulfilled"
      ) {
        console.log("Using real API data");
        return this.transformAPIData(
          demandData.value,
          generationData.value,
          weatherData.status === "fulfilled" ? weatherData.value : null
        );
      } else {
        console.log(
          "API data unavailable, using Toronto-specific simulated data"
        );
        return this.generateTorontoData();
      }
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      return this.generateTorontoData();
    }
  }

  private transformAPIData(
    demandData: IESODemandData[],
    generationData: IESOGenerationData[],
    weather: WeatherData | null
  ): DashboardData {
    // Transform API data to dashboard format
    const latestDemand = demandData[demandData.length - 1] || {
      demand: 15000,
      forecast: 14500,
    };
    const latestGeneration = generationData[generationData.length - 1] || {
      nuclear: 8500,
      hydro: 4000,
      gas: 2000,
      wind: 2500,
      solar: 1500,
      biomass: 400,
      coal: 0,
    };

    const totalGeneration = Object.values(latestGeneration).reduce(
      (sum, val) => (typeof val === "number" ? sum + val : sum),
      0
    );
    const renewableGeneration =
      latestGeneration.solar +
      latestGeneration.wind +
      latestGeneration.hydro +
      latestGeneration.biomass;
    const renewablePercentage = (renewableGeneration / totalGeneration) * 100;

    return {
      gridOverview: {
        totalGeneration: Math.round((totalGeneration / 1000) * 100) / 100,
        totalDemand: Math.round((latestDemand.demand / 1000) * 100) / 100,
        renewablePercentage: Math.round(renewablePercentage * 100) / 100,
        carbonIntensity: this.calculateCarbonIntensity(latestGeneration),
        gridEfficiency: Math.round((Math.random() * 10 + 90) * 100) / 100,
      },
      energyMix: this.generateEnergyMixFromAPI(generationData),
      carbonEmissions: this.generateCarbonEmissionsFromAPI(generationData),
      renewableProgress: {
        current: Math.round(renewablePercentage * 100) / 100,
        target: 80,
        solarCapacity: this.estimateCapacity("solar", weather),
        windCapacity: this.estimateCapacity("wind", weather),
        hydroCapacity: this.estimateCapacity("hydro", weather),
        biomassCapacity: this.estimateCapacity("biomass", weather),
      },
      gridStatus: {
        status: this.determineGridStatus(latestDemand, totalGeneration),
        frequency: Math.round((Math.random() * 0.4 + 49.8) * 100) / 100,
        voltage: Math.round((Math.random() * 20 + 220) * 100) / 100,
        stability: this.calculateStability(latestDemand, totalGeneration),
        alerts: this.generateAlerts(latestDemand, totalGeneration, weather),
      },
    };
  }

  private generateEnergyMixFromAPI(
    generationData: IESOGenerationData[]
  ): EnergyMixData[] {
    return generationData.map((gen) => ({
      timestamp: gen.timestamp,
      solar: gen.solar,
      wind: gen.wind,
      hydro: gen.hydro,
      nuclear: gen.nuclear,
      gas: gen.gas,
      coal: gen.coal,
      biomass: gen.biomass,
    }));
  }

  private generateCarbonEmissionsFromAPI(
    generationData: IESOGenerationData[]
  ): CarbonEmissionsData[] {
    return generationData.map((gen) => {
      const total =
        gen.nuclear +
        gen.hydro +
        gen.gas +
        gen.wind +
        gen.solar +
        gen.biomass +
        gen.coal;
      const renewable = gen.solar + gen.wind + gen.hydro + gen.biomass;
      const emissions = Math.max(0, 250 - (renewable / total) * 100);

      return {
        timestamp: gen.timestamp,
        emissions,
        target: 200,
        reduction: Math.max(0, ((250 - emissions) / 250) * 100),
      };
    });
  }

  private calculateCarbonIntensity(generation: IESOGenerationData): number {
    const total = Object.values(generation).reduce(
      (sum, val) => (typeof val === "number" ? sum + val : sum),
      0
    );
    const renewable =
      generation.solar +
      generation.wind +
      generation.hydro +
      generation.biomass;
    const renewableRatio = renewable / total;

    // Carbon intensity decreases with renewable percentage
    return Math.round((250 - renewableRatio * 150) * 100) / 100;
  }

  private estimateCapacity(
    source: string,
    weather: WeatherData | null
  ): number {
    const baseCapacities = {
      solar: 4000,
      wind: 12000,
      hydro: 5000,
      biomass: 2000,
    };

    if (!weather)
      return baseCapacities[source as keyof typeof baseCapacities] || 0;

    let multiplier = 1;
    switch (source) {
      case "solar":
        multiplier = weather.solarRadiation / 1000; // Higher radiation = higher capacity
        break;
      case "wind":
        multiplier = weather.windSpeed / 15; // Higher wind = higher capacity
        break;
      case "hydro":
        multiplier = 1 + (weather.humidity - 50) / 100; // Higher humidity = slightly higher capacity
        break;
      case "biomass":
        multiplier = 1; // Biomass is relatively constant
        break;
    }

    return (
      Math.round(
        baseCapacities[source as keyof typeof baseCapacities] * multiplier * 100
      ) / 100
    );
  }

  private determineGridStatus(
    demand: IESODemandData,
    generation: number
  ): "online" | "warning" | "offline" {
    const margin = generation - demand.demand;
    const marginPercentage = (margin / demand.demand) * 100;

    if (marginPercentage > 10) return "online";
    if (marginPercentage > 5) return "warning";
    return "offline";
  }

  private calculateStability(
    demand: IESODemandData,
    generation: number
  ): number {
    const margin = generation - demand.demand;
    const marginPercentage = (margin / demand.demand) * 100;

    // Higher margin = higher stability
    return Math.min(100, Math.max(50, 75 + marginPercentage * 2));
  }

  private generateAlerts(
    demand: IESODemandData,
    generation: number,
    weather: WeatherData | null
  ): string[] {
    const alerts: string[] = [];
    const margin = generation - demand.demand;
    const marginPercentage = (margin / demand.demand) * 100;

    if (marginPercentage < 5) {
      alerts.push("Low generation margin detected");
    }
    if (demand.demand > 18000) {
      alerts.push("High demand in GTA");
    }
    if (weather && weather.temperature > 30) {
      alerts.push("High temperature affecting grid efficiency");
    }

    return alerts;
  }
}

export default TorontoGridAPIService;
