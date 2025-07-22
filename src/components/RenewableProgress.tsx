import React from 'react'
import { motion } from 'framer-motion'
import { RenewableProgressData } from '../utils/mockData'
import { Sun, Wind, Droplets, Leaf } from 'lucide-react'

interface RenewableProgressProps {
  data: RenewableProgressData
}

const RenewableProgress: React.FC<RenewableProgressProps> = ({ data }) => {
  const progressPercentage = (data.current / data.target) * 100

  const renewableSources = [
    {
      name: 'Solar',
      capacity: data.solarCapacity,
      icon: Sun,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Wind',
      capacity: data.windCapacity,
      icon: Wind,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Hydro',
      capacity: data.hydroCapacity,
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    {
      name: 'Biomass',
      capacity: data.biomassCapacity,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Renewable Progress</h3>
        <div className="text-sm text-gray-600">
          Target: {data.target}%
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-forest-600">{data.current.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-forest-500 to-ocean-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Renewable Sources */}
      <div className="space-y-4">
        {renewableSources.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 rounded-lg ${source.bgColor}`}>
              <source.icon className={`h-4 w-4 ${source.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{source.name}</span>
                <span className="text-sm text-gray-600">{source.capacity.toFixed(0)} MW</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-forest-400 to-ocean-400 h-2 rounded-full"
                  style={{ width: `${Math.min((source.capacity / 30000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-forest-50 to-ocean-50 rounded-lg border border-forest-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <p className="text-xs text-gray-600">
              {progressPercentage >= 80 ? 'Excellent Progress' : 
               progressPercentage >= 60 ? 'Good Progress' : 
               progressPercentage >= 40 ? 'Moderate Progress' : 'Needs Improvement'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            progressPercentage >= 80 ? 'bg-forest-100 text-forest-800' :
            progressPercentage >= 60 ? 'bg-ocean-100 text-ocean-800' :
            progressPercentage >= 40 ? 'bg-sunset-100 text-sunset-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {progressPercentage.toFixed(0)}% Complete
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RenewableProgress 