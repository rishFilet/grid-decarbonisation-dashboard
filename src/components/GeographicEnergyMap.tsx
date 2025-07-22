import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Wind, Droplets, Zap, Leaf, MapPin } from 'lucide-react'
import { RenewableProgressData, EnergyMixData } from '../utils/mockData'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface EnergySource {
  id: string
  name: string
  type: 'nuclear' | 'hydro' | 'wind' | 'solar' | 'biomass' | 'gas'
  latitude: number
  longitude: number
  capacity: number
  currentOutput: number
  status: 'online' | 'maintenance' | 'offline'
  icon: any
  color: string
  description: string
}

interface GeographicEnergyMapProps {
  renewableProgress: RenewableProgressData
  energyMix: EnergyMixData[]
}

const GeographicEnergyMap: React.FC<GeographicEnergyMapProps> = () => {
  const [selectedSource, setSelectedSource] = useState<EnergySource | null>(null)

  // Ontario energy sources with real coordinates
  const energySources: EnergySource[] = [
    // Nuclear Power Plants
    {
      id: 'bruce-nuclear',
      name: 'Bruce Nuclear Generating Station',
      type: 'nuclear',
      latitude: 44.3269,
      longitude: -81.5997,
      capacity: 6300,
      currentOutput: 5800,
      status: 'online',
      icon: Zap,
      color: '#f59e0b',
      description: 'Largest nuclear power plant in North America'
    },
    {
      id: 'pickering-nuclear',
      name: 'Pickering Nuclear Generating Station',
      type: 'nuclear',
      latitude: 43.8122,
      longitude: -79.0714,
      capacity: 3100,
      currentOutput: 2800,
      status: 'online',
      icon: Zap,
      color: '#f59e0b',
      description: 'Nuclear power plant near Toronto'
    },
    {
      id: 'darlington-nuclear',
      name: 'Darlington Nuclear Generating Station',
      type: 'nuclear',
      latitude: 43.8719,
      longitude: -78.7219,
      capacity: 3500,
      currentOutput: 3200,
      status: 'online',
      icon: Zap,
      color: '#f59e0b',
      description: 'Nuclear power plant on Lake Ontario'
    },
    // Hydroelectric Plants
    {
      id: 'niagara-falls-hydro',
      name: 'Niagara Falls Hydroelectric',
      type: 'hydro',
      latitude: 43.0962,
      longitude: -79.0377,
      capacity: 2400,
      currentOutput: 2200,
      status: 'online',
      icon: Droplets,
      color: '#3b82f6',
      description: 'Major hydroelectric facility at Niagara Falls'
    },
    {
      id: 'beck-hydro',
      name: 'Sir Adam Beck Hydroelectric',
      type: 'hydro',
      latitude: 43.0962,
      longitude: -79.0377,
      capacity: 1900,
      currentOutput: 1700,
      status: 'online',
      icon: Droplets,
      color: '#3b82f6',
      description: 'Hydroelectric station at Niagara'
    },
    // Wind Farms
    {
      id: 'melancthon-wind',
      name: 'Melancthon Wind Farm',
      type: 'wind',
      latitude: 44.1500,
      longitude: -80.4500,
      capacity: 200,
      currentOutput: 180,
      status: 'online',
      icon: Wind,
      color: '#10b981',
      description: 'Wind farm in Dufferin County'
    },
    {
      id: 'wolfe-island-wind',
      name: 'Wolfe Island Wind Farm',
      type: 'wind',
      latitude: 44.1833,
      longitude: -76.4167,
      capacity: 197,
      currentOutput: 150,
      status: 'online',
      icon: Wind,
      color: '#10b981',
      description: 'Wind farm on Wolfe Island'
    },
    // Solar Farms
    {
      id: 'sarnia-solar',
      name: 'Sarnia Solar Farm',
      type: 'solar',
      latitude: 42.9749,
      longitude: -82.4066,
      capacity: 80,
      currentOutput: 65,
      status: 'online',
      icon: Sun,
      color: '#f59e0b',
      description: 'Large solar photovoltaic facility'
    },
    // Biomass
    {
      id: 'atikokan-biomass',
      name: 'Atikokan Biomass Plant',
      type: 'biomass',
      latitude: 48.7500,
      longitude: -91.6167,
      capacity: 205,
      currentOutput: 190,
      status: 'online',
      icon: Leaf,
      color: '#22c55e',
      description: 'Biomass power plant in Northwestern Ontario'
    },
    // Gas Plants
    {
      id: 'portlands-energy',
      name: 'Portlands Energy Centre',
      type: 'gas',
      latitude: 43.6532,
      longitude: -79.3832,
      capacity: 550,
      currentOutput: 480,
      status: 'online',
      icon: Zap,
      color: '#ef4444',
      description: 'Natural gas power plant in Toronto'
    },
    {
      id: 'lennox-gas',
      name: 'Lennox Generating Station',
      type: 'gas',
      latitude: 44.2000,
      longitude: -76.7000,
      capacity: 2100,
      currentOutput: 1800,
      status: 'online',
      icon: Zap,
      color: '#ef4444',
      description: 'Oil and gas-fired power plant'
    }
  ]

  const getIconForType = (type: string) => {
    switch (type) {
      case 'nuclear': return Zap
      case 'hydro': return Droplets
      case 'wind': return Wind
      case 'solar': return Sun
      case 'biomass': return Leaf
      case 'gas': return Zap
      default: return MapPin
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'nuclear': return '#f59e0b'
      case 'hydro': return '#3b82f6'
      case 'wind': return '#10b981'
      case 'solar': return '#f59e0b'
      case 'biomass': return '#22c55e'
      case 'gas': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981'
      case 'maintenance': return '#f59e0b'
      case 'offline': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Calculate totals
  const capacityByType = energySources.reduce((acc, source) => {
    acc[source.type] = (acc[source.type] || 0) + source.capacity
    return acc
  }, {} as Record<string, number>)

  const outputByType = energySources.reduce((acc, source) => {
    acc[source.type] = (acc[source.type] || 0) + source.currentOutput
    return acc
  }, {} as Record<string, number>)

  // Custom marker icon function
  const createCustomIcon = (source: EnergySource) => {
    const Icon = source.icon
    const color = source.color
    const statusColor = getStatusColor(source.status)
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: white;
          border: 2px solid ${color};
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          position: relative;
        ">
          <div style="color: ${color}; font-size: 16px;">
            ${source.type === 'nuclear' ? '⚛️' : 
              source.type === 'hydro' ? '💧' :
              source.type === 'wind' ? '💨' :
              source.type === 'solar' ? '☀️' :
              source.type === 'biomass' ? '🌱' :
              source.type === 'gas' ? '🔥' : '⚡'}
          </div>
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            background: ${statusColor};
            border: 1px solid white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ontario Energy Grid Map</h2>
          <p className="text-gray-600">Real-time energy sources across Ontario</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Capacity</div>
          <div className="text-2xl font-bold text-forest-600">
            {Object.values(capacityByType).reduce((sum, capacity) => sum + capacity, 0).toLocaleString()} MW
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden border border-gray-200 mb-6">
        <MapContainer
          center={[44.5, -79.5]} // Center of Ontario
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {/* Energy Source Markers */}
          {energySources.map((source) => (
            <Marker
              key={source.id}
              position={[source.latitude, source.longitude]}
              icon={createCustomIcon(source)}
              eventHandlers={{
                click: () => setSelectedSource(selectedSource?.id === source.id ? null : source)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{source.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Type:</strong> {source.type.charAt(0).toUpperCase() + source.type.slice(1)}</div>
                    <div><strong>Capacity:</strong> {source.capacity.toLocaleString()} MW</div>
                    <div><strong>Current Output:</strong> {source.currentOutput.toLocaleString()} MW</div>
                    <div><strong>Utilization:</strong> {((source.currentOutput / source.capacity) * 100).toFixed(1)}%</div>
                    <div><strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        source.status === 'online' ? 'bg-green-100 text-green-800' :
                        source.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-600 mt-2">{source.description}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Source Details */}
      {selectedSource && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedSource.name}</h3>
              <p className="text-gray-600 mb-3">{selectedSource.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Capacity</div>
                  <div className="text-lg font-semibold">{selectedSource.capacity.toLocaleString()} MW</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Current Output</div>
                  <div className="text-lg font-semibold">{selectedSource.currentOutput.toLocaleString()} MW</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Utilization</div>
                  <div className="text-lg font-semibold">
                    {((selectedSource.currentOutput / selectedSource.capacity) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className={`text-lg font-semibold ${
                    selectedSource.status === 'online' ? 'text-green-600' :
                    selectedSource.status === 'maintenance' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {selectedSource.status.charAt(0).toUpperCase() + selectedSource.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedSource(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Energy Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(capacityByType).map(([type, capacity]) => {
          const output = outputByType[type] || 0
          const utilization = ((output / capacity) * 100).toFixed(1)
          const Icon = getIconForType(type)
          const color = getColorForType(type)
          
          return (
            <motion.div
              key={type}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center mb-2">
                <Icon size={20} style={{ color }} />
                <span className="ml-2 font-medium text-gray-700 capitalize">{type}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{capacity.toLocaleString()} MW</div>
              <div className="text-sm text-gray-500">
                {output.toLocaleString()} MW ({utilization}%)
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Offline</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GeographicEnergyMap 