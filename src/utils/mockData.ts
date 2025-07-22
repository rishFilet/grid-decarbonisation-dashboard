export interface GridOverviewData {
  totalGeneration: number;
  totalDemand: number;
  renewablePercentage: number;
  carbonIntensity: number;
  gridEfficiency: number;
}

export interface EnergyMixData {
  timestamp: string;
  solar: number;
  wind: number;
  hydro: number;
  nuclear: number;
  gas: number;
  coal: number;
  biomass: number;
}

export interface CarbonEmissionsData {
  timestamp: string;
  emissions: number;
  target: number;
  reduction: number;
}

export interface RenewableProgressData {
  current: number;
  target: number;
  solarCapacity: number;
  windCapacity: number;
  hydroCapacity: number;
  biomassCapacity: number;
}

export interface GridStatusData {
  status: "online" | "warning" | "offline";
  frequency: number;
  voltage: number;
  stability: number;
  alerts: string[];
}

export interface DashboardData {
  gridOverview: GridOverviewData;
  energyMix: EnergyMixData[];
  carbonEmissions: CarbonEmissionsData[];
  renewableProgress: RenewableProgressData;
  gridStatus: GridStatusData;
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateTimeSeriesData(hours: number = 24): string[] {
  const timestamps: string[] = [];
  const now = new Date();

  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    timestamps.push(time.toISOString());
  }

  return timestamps;
}

export function generateMockData(): DashboardData {
  const timestamps = generateTimeSeriesData(24);

  // Generate energy mix data with realistic variations
  const energyMix: EnergyMixData[] = timestamps.map((timestamp) => {
    const hour = new Date(timestamp).getHours();
    const isDaytime = hour >= 6 && hour <= 18;

    return {
      timestamp,
      solar: isDaytime ? randomBetween(15, 35) : randomBetween(0, 5),
      wind: randomBetween(20, 45),
      hydro: randomBetween(10, 25),
      nuclear: randomBetween(15, 25),
      gas: randomBetween(5, 20),
      coal: randomBetween(0, 10),
      biomass: randomBetween(2, 8),
    };
  });

  // Generate carbon emissions data
  const carbonEmissions: CarbonEmissionsData[] = timestamps.map((timestamp) => {
    const baseEmissions = 250;
    const variation = randomBetween(-20, 20);
    const emissions = Math.max(0, baseEmissions + variation);

    return {
      timestamp,
      emissions,
      target: 200,
      reduction: Math.max(0, ((250 - emissions) / 250) * 100),
    };
  });

  // Calculate current totals from energy mix
  const currentMix = energyMix[energyMix.length - 1];
  const totalGeneration = Object.values(currentMix).reduce(
    (sum, val) => (typeof val === "number" ? sum + val : sum),
    0
  );
  const renewableGeneration =
    currentMix.solar + currentMix.wind + currentMix.hydro + currentMix.biomass;
  const renewablePercentage = (renewableGeneration / totalGeneration) * 100;

  return {
    gridOverview: {
      totalGeneration: Math.round(totalGeneration * 100) / 100,
      totalDemand:
        Math.round(totalGeneration * randomBetween(0.9, 1.1) * 100) / 100,
      renewablePercentage: Math.round(renewablePercentage * 100) / 100,
      carbonIntensity: Math.round(randomBetween(150, 300) * 100) / 100,
      gridEfficiency: Math.round(randomBetween(85, 98) * 100) / 100,
    },
    energyMix,
    carbonEmissions,
    renewableProgress: {
      current: Math.round(renewablePercentage * 100) / 100,
      target: 80,
      solarCapacity: Math.round(randomBetween(8000, 12000) * 100) / 100,
      windCapacity: Math.round(randomBetween(15000, 25000) * 100) / 100,
      hydroCapacity: Math.round(randomBetween(5000, 8000) * 100) / 100,
      biomassCapacity: Math.round(randomBetween(2000, 4000) * 100) / 100,
    },
    gridStatus: {
      status:
        Math.random() > 0.1
          ? "online"
          : Math.random() > 0.5
          ? "warning"
          : "offline",
      frequency: Math.round(randomBetween(49.8, 50.2) * 100) / 100,
      voltage: Math.round(randomBetween(220, 240) * 100) / 100,
      stability: Math.round(randomBetween(85, 99) * 100) / 100,
      alerts:
        Math.random() > 0.8
          ? ["High demand detected", "Voltage fluctuation"]
          : [],
    },
  };
}
