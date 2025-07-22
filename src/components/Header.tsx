import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface HeaderProps {
  lastUpdated: Date
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-forest-500 to-ocean-500 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
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
              <Clock className="h-4 w-4" />
              <span>Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-forest-700">Live</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 