import React from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Leaf, Gauge } from 'lucide-react'
import { GridOverviewData } from '../utils/mockData'

interface GridOverviewProps {
  data: GridOverviewData
}

const GridOverview: React.FC<GridOverviewProps> = ({ data }) => {
  const metrics = [
    {
      label: 'Total Generation',
      value: `${data.totalGeneration.toFixed(1)} GW`,
      icon: Zap,
      color: 'text-ocean-600',
      bgColor: 'bg-ocean-50'
    },
    {
      label: 'Total Demand',
      value: `${data.totalDemand.toFixed(1)} GW`,
      icon: TrendingUp,
      color: 'text-sunset-600',
      bgColor: 'bg-sunset-50'
    },
    {
      label: 'Renewable %',
      value: `${data.renewablePercentage.toFixed(1)}%`,
      icon: Leaf,
      color: 'text-forest-600',
      bgColor: 'bg-forest-50'
    },
    {
      label: 'Carbon Intensity',
      value: `${data.carbonIntensity} gCO₂/kWh`,
      icon: Gauge,
      color: 'text-earth-600',
      bgColor: 'bg-earth-50'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metric.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default GridOverview 