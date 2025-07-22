import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts'
import { EnergyMixData, CarbonEmissionsData } from '../utils/mockData'
import { format } from 'date-fns'
import { TrendingDown, Target, Leaf, Clock, BarChart3, Calendar, Settings } from 'lucide-react'

interface DecarbonizationChartProps {
  carbonEmissions: CarbonEmissionsData[]
  energyMix: EnergyMixData[]
}

type TimeFrame = '1h' | '6h' | '24h' | '7d' | '30d' | 'custom'

interface EnergyMixTimeData {
  timestamp: string
  renewable: number
  nuclear: number
  gas: number
  coal: number
  total: number
  renewablePercentage: number
  carbonIntensity: number
}

const DecarbonizationChart: React.FC<DecarbonizationChartProps> = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h')
  const [showCarbonIntensity, setShowCarbonIntensity] = useState(false)
  const [customYears, setCustomYears] = useState<number>(5)
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Generate time-based energy mix data
  const generateTimeSeriesData = (timeFrame: TimeFrame): EnergyMixTimeData[] => {
    const now = new Date()
    const data: EnergyMixTimeData[] = []
    
    let points: number
    let interval: number
    
    switch (timeFrame) {
      case '1h':
        points = 60
        interval = 1 * 60 * 1000 // 1 minute
        break
      case '6h':
        points = 72
        interval = 5 * 60 * 1000 // 5 minutes
        break
      case '24h':
        points = 96
        interval = 15 * 60 * 1000 // 15 minutes
        break
      case '7d':
        points = 168
        interval = 60 * 60 * 1000 // 1 hour
        break
      case '30d':
        points = 30
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      case 'custom':
        points = customYears * 365 // Daily data points for custom years
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      default:
        points = 96
        interval = 15 * 60 * 1000
    }

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * interval))
      
      // Generate realistic energy mix with decarbonization trends
      // For custom years, show more dramatic long-term trends
      const timeMultiplier = timeFrame === 'custom' ? (i / points) * 10 : 1
      const baseRenewable = 2000 + (i * 2 * timeMultiplier) // Gradual increase
      const baseNuclear = 8000 + (i * 0.5 * timeMultiplier) // Slight increase
      const baseGas = 3000 - (i * 1.5 * timeMultiplier) // Gradual decrease
      const baseCoal = 500 - (i * 0.8 * timeMultiplier) // Rapid decrease
      
      // Add some realistic variation
      const variation = Math.sin(i * 0.1) * 200
      
      const renewable = Math.max(0, baseRenewable + variation)
      const nuclear = Math.max(0, baseNuclear + variation * 0.5)
      const gas = Math.max(0, baseGas + variation * 0.3)
      const coal = Math.max(0, baseCoal + variation * 0.1)
      
      const total = renewable + nuclear + gas + coal
      const renewablePercentage = (renewable / total) * 100
      
      // Calculate carbon intensity (gCO2/kWh)
      const carbonIntensity = (
        (coal * 820) + // Coal: 820 gCO2/kWh
        (gas * 490) +  // Gas: 490 gCO2/kWh
        (nuclear * 12) + // Nuclear: 12 gCO2/kWh
        (renewable * 0)   // Renewables: 0 gCO2/kWh
      ) / total
      
      data.push({
        timestamp: timestamp.toISOString(),
        renewable,
        nuclear,
        gas,
        coal,
        total,
        renewablePercentage,
        carbonIntensity
      })
    }
    
    return data
  }

  const timeSeriesData = generateTimeSeriesData(timeFrame)

  // Calculate decarbonization metrics
  const currentData = timeSeriesData[timeSeriesData.length - 1]
  const previousData = timeSeriesData[Math.max(0, timeSeriesData.length - 2)]
  
  const renewableChange = currentData ? 
    ((currentData.renewablePercentage - (previousData?.renewablePercentage || 0)) / (previousData?.renewablePercentage || 1)) * 100 : 0
  
  const carbonIntensityChange = currentData && previousData ? 
    ((currentData.carbonIntensity - previousData.carbonIntensity) / previousData.carbonIntensity) * 100 : 0

  const timeFrameOptions: { value: TimeFrame; label: string; icon: any }[] = [
    { value: '1h', label: '1 Hour', icon: Clock },
    { value: '6h', label: '6 Hours', icon: Clock },
    { value: '24h', label: '24 Hours', icon: Clock },
    { value: '7d', label: '7 Days', icon: Calendar },
    { value: '30d', label: '30 Days', icon: Calendar },
    { value: 'custom', label: 'Custom Years', icon: Settings }
  ]

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    switch (timeFrame) {
      case '1h':
      case '6h':
        return format(date, 'HH:mm')
      case '24h':
        return format(date, 'HH:mm')
      case '7d':
        return format(date, 'MMM dd')
      case '30d':
        return format(date, 'MMM dd')
      case 'custom':
        return format(date, 'MMM yyyy')
      default:
        return format(date, 'HH:mm')
    }
  }

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame)
    if (newTimeFrame === 'custom') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
    }
  }

  const handleCustomYearsChange = (years: number) => {
    setCustomYears(Math.max(1, Math.min(50, years))); // Limit between 1 and 50 years
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as EnergyMixTimeData
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {format(new Date(label), timeFrame === 'custom' ? 'MMMM dd, yyyy' : 'MMM dd, yyyy HH:mm')}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-green-600">Renewable:</span>
              <span className="font-medium">{data.renewable.toFixed(0)} MW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-600">Nuclear:</span>
              <span className="font-medium">{data.nuclear.toFixed(0)} MW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Gas:</span>
              <span className="font-medium">{data.gas.toFixed(0)} MW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Coal:</span>
              <span className="font-medium">{data.coal.toFixed(0)} MW</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Renewable %:</span>
                <span className="font-medium text-green-600">{data.renewablePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Carbon Intensity:</span>
                <span className="font-medium">{data.carbonIntensity.toFixed(0)} gCO₂/kWh</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Decarbonization Progress</h2>
          <p className="text-gray-600">Energy mix evolution and carbon intensity trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Target: 100% Renewable by 2050</span>
          </div>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Time Frame:</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            {timeFrameOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleTimeFrameChange(option.value)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeFrame === option.value
                      ? 'bg-forest-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
          
          {/* Custom Years Input */}
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 ml-4"
            >
              <label className="text-sm text-gray-600">Years:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={customYears}
                onChange={(e) => handleCustomYearsChange(parseInt(e.target.value) || 5)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">(1-50)</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Renewable Energy</p>
              <p className="text-2xl font-bold text-green-700">
                {currentData?.renewablePercentage.toFixed(1)}%
              </p>
            </div>
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2">
            <span className={`text-sm ${renewableChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {renewableChange >= 0 ? '↗' : '↘'} {Math.abs(renewableChange).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs previous</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Nuclear Energy</p>
              <p className="text-2xl font-bold text-orange-700">
                {currentData?.nuclear.toFixed(0)} MW
              </p>
            </div>
            <div className="text-2xl">⚛️</div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {((currentData?.nuclear || 0) / (currentData?.total || 1) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Carbon Intensity</p>
              <p className="text-2xl font-bold text-red-700">
                {currentData?.carbonIntensity.toFixed(0)} gCO₂/kWh
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <div className="mt-2">
            <span className={`text-sm ${carbonIntensityChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {carbonIntensityChange <= 0 ? '↘' : '↗'} {Math.abs(carbonIntensityChange).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs previous</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Generation</p>
              <p className="text-2xl font-bold text-blue-700">
                {currentData?.total.toFixed(0)} MW
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              Peak demand: {(currentData?.total || 0) * 1.1} MW
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value} MW`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Energy Mix Areas */}
            <Area
              type="monotone"
              dataKey="renewable"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.8}
              name="Renewable"
            />
            <Area
              type="monotone"
              dataKey="nuclear"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.8}
              name="Nuclear"
            />
            <Area
              type="monotone"
              dataKey="gas"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.8}
              name="Gas"
            />
            <Area
              type="monotone"
              dataKey="coal"
              stackId="1"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.8}
              name="Coal"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Carbon Intensity Line (Optional) */}
      {showCarbonIntensity && (
        <div className="mt-6 h-64">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Carbon Intensity Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `${value} gCO₂/kWh`}
              />
              <Tooltip 
                labelFormatter={(label) => format(new Date(label), timeFrame === 'custom' ? 'MMMM dd, yyyy' : 'MMM dd, yyyy HH:mm')}
                formatter={(value: any) => [`${value.toFixed(0)} gCO₂/kWh`, 'Carbon Intensity']}
              />
              <Line
                type="monotone"
                dataKey="carbonIntensity"
                stroke="#dc2626"
                strokeWidth={3}
                dot={false}
                name="Carbon Intensity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Toggle for Carbon Intensity */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowCarbonIntensity(!showCarbonIntensity)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <TrendingDown className="w-4 h-4" />
          <span>{showCarbonIntensity ? 'Hide' : 'Show'} Carbon Intensity Trend</span>
        </button>
      </div>

      {/* Decarbonization Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Decarbonization Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Renewable Energy Target</span>
              <span className="text-sm font-medium text-green-600">100% by 2050</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(currentData?.renewablePercentage || 0, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current: {currentData?.renewablePercentage.toFixed(1)}% • Target: 100%
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Carbon Intensity Target</span>
              <span className="text-sm font-medium text-red-600">0 gCO₂/kWh by 2050</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, 100 - ((currentData?.carbonIntensity || 0) / 820) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current: {currentData?.carbonIntensity.toFixed(0)} gCO₂/kWh • Target: 0
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fossil Fuel Phase-out</span>
              <span className="text-sm font-medium text-orange-600">0% by 2050</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, 100 - (((currentData?.gas || 0) + (currentData?.coal || 0)) / (currentData?.total || 1) * 100))}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current: {(((currentData?.gas || 0) + (currentData?.coal || 0)) / (currentData?.total || 1) * 100).toFixed(1)}% • Target: 0%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DecarbonizationChart 