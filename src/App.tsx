import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { generateMockData } from './utils/mockData'
import { DashboardData } from './utils/mockData'
import TorontoGridAPIService from './services/torontoGridAPI'
import DecarbonizationChart from './components/DecarbonizationChart'
import GeographicEnergyMap from './components/GeographicEnergyMap'

function App() {
  const [data, setData] = useState<DashboardData>(generateMockData())
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('api')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const torontoAPI = new TorontoGridAPIService()

  const fetchRealData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting to fetch real Toronto grid data...')
      const realData = await torontoAPI.getDashboardData()
      console.log('Real data fetched successfully:', realData)
      setData(realData)
      setLastUpdated(new Date())
      setDataSource('api')
    } catch (err) {
      console.error('Failed to fetch real data:', err)
      setError('Failed to fetch real-time data. Using mock data as fallback.')
      setDataSource('mock')
      // Fallback to mock data
      const mockData = generateMockData()
      console.log('Using mock data as fallback:', mockData)
      setData(mockData)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    console.log('Initial data fetch starting...')
    fetchRealData()

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      console.log('Interval update triggered, dataSource:', dataSource)
      if (dataSource === 'api') {
        fetchRealData()
      } else {
        // Update mock data every 5 seconds
        console.log('Updating mock data...')
        const newMockData = generateMockData()
        console.log('New mock data generated:', newMockData)
        setData(newMockData)
        setLastUpdated(new Date())
      }
    }, dataSource === 'api' ? 300000 : 5000) // 5 minutes for API, 5 seconds for mock

    return () => clearInterval(interval)
  }, [dataSource])

  // Data source information
  const dataSources = {
    mock: {
      name: 'Mock Data',
      description: 'Simulated data for demonstration',
      location: 'Demo Environment',
      updateFrequency: '5 seconds',
      reliability: 'High (Simulated)',
      color: 'sunset'
    },
    api: {
      name: 'Toronto Grid API',
      description: 'Real-time data from IESO',
      location: 'Ontario, Canada',
      updateFrequency: '5 minutes',
      reliability: 'Live Data',
      color: 'forest'
    }
  }

  const currentSource = dataSources[dataSource]

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-ocean-50 to-earth-50">
      {/* Animated Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-gradient-to-r from-forest-500 to-ocean-500 rounded-lg"
              >
                <span className="text-white text-lg">🌱</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Grid Decarbonization Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Real-time monitoring of renewable energy integration
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-forest-500 rounded-full"
                />
                <span className="text-sm font-medium text-forest-700">Live</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Data Source & Location Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto px-4 pt-4"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data Source */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full bg-${currentSource.color}-500`} />
              <div>
                <p className="text-sm font-medium text-gray-700">Data Source</p>
                <p className="text-sm text-gray-600">{currentSource.name}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Monitoring Area</p>
                <p className="text-sm text-gray-600">{currentSource.location}</p>
              </div>
            </div>

            {/* Update Frequency */}
            <div className="flex items-center space-x-3">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Update Frequency</p>
                <p className="text-sm text-gray-600">{currentSource.updateFrequency}</p>
              </div>
            </div>

            {/* Reliability */}
            <div className="flex items-center space-x-3">
              <span className="text-lg">🛡️</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Data Reliability</p>
                <p className="text-sm text-gray-600">{currentSource.reliability}</p>
              </div>
            </div>
          </div>

          {/* Data Source Description */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {currentSource.description} • 
              {dataSource === 'api' ? ' Connected to IESO (Independent Electricity System Operator) for Ontario grid data' : ' Using realistic simulated data for demonstration purposes'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <p className="text-sm text-blue-700">Fetching real-time Toronto grid data...</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <main className="container mx-auto px-4 py-6">
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Debug: Data loaded - Generation: {data.gridOverview.totalGeneration} GW, 
              Demand: {data.gridOverview.totalDemand} GW, 
              Renewable: {data.gridOverview.renewablePercentage}%
            </p>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Animated Grid Overview Cards */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Generation</p>
                <p className="text-2xl font-bold text-gray-900">{data.gridOverview.totalGeneration.toFixed(1)} GW</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-lg bg-ocean-50"
              >
                <span className="text-ocean-600 text-2xl">⚡</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Demand</p>
                <p className="text-2xl font-bold text-gray-900">{data.gridOverview.totalDemand.toFixed(1)} GW</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-lg bg-sunset-50"
              >
                <span className="text-sunset-600 text-2xl">📈</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Renewable %</p>
                <p className="text-2xl font-bold text-gray-900">{data.gridOverview.renewablePercentage.toFixed(1)}%</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-lg bg-forest-50"
              >
                <span className="text-forest-600 text-2xl">🌿</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Carbon Intensity</p>
                <p className="text-2xl font-bold text-gray-900">{data.gridOverview.carbonIntensity} gCO₂/kWh</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-lg bg-earth-50"
              >
                <span className="text-earth-600 text-2xl">🌍</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Energy Mix Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Mix (Latest)</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <p className="text-sm text-gray-600">Solar</p>
                <p className="text-xl font-bold text-yellow-600">
                  {data.energyMix[data.energyMix.length - 1]?.solar.toFixed(1)} GW
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-gray-600">Wind</p>
                <p className="text-xl font-bold text-blue-600">
                  {data.energyMix[data.energyMix.length - 1]?.wind.toFixed(1)} GW
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200"
              >
                <p className="text-sm text-gray-600">Hydro</p>
                <p className="text-xl font-bold text-cyan-600">
                  {data.energyMix[data.energyMix.length - 1]?.hydro.toFixed(1)} GW
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <p className="text-sm text-gray-600">Nuclear</p>
                <p className="text-xl font-bold text-purple-600">
                  {data.energyMix[data.energyMix.length - 1]?.nuclear.toFixed(1)} GW
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid Status</h3>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">Status</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900 capitalize">{data.gridStatus.status}</span>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${
                      data.gridStatus.status === 'online' ? 'bg-forest-500' :
                      data.gridStatus.status === 'warning' ? 'bg-sunset-500' :
                      'bg-red-500'
                    }`} 
                  />
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">Frequency</span>
                <span className="text-sm font-semibold text-gray-900">{data.gridStatus.frequency} Hz</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">Stability</span>
                <span className="text-sm font-semibold text-gray-900">{data.gridStatus.stability}%</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Decarbonization Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <DecarbonizationChart 
            carbonEmissions={data.carbonEmissions}
            renewableProgress={data.renewableProgress}
          />
        </motion.div>

        {/* Geographic Energy Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <GeographicEnergyMap 
            renewableProgress={data.renewableProgress}
            energyMix={data.energyMix}
          />
        </motion.div>
      </main>
    </div>
  )
}

export default App 