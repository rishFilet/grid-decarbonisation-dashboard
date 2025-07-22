import React from 'react'
import { motion } from 'framer-motion'
import { GridStatusData } from '../utils/mockData'
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface GridStatusProps {
  data: GridStatusData
}

const GridStatus: React.FC<GridStatusProps> = ({ data }) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-forest-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-sunset-600" />
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'online':
        return 'bg-forest-100 text-forest-800'
      case 'warning':
        return 'bg-sunset-100 text-sunset-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const gridMetrics = [
    {
      label: 'Frequency',
      value: `${data.frequency} Hz`,
      status: data.frequency >= 49.8 && data.frequency <= 50.2 ? 'normal' : 'warning'
    },
    {
      label: 'Voltage',
      value: `${data.voltage} V`,
      status: data.voltage >= 220 && data.voltage <= 240 ? 'normal' : 'warning'
    },
    {
      label: 'Stability',
      value: `${data.stability}%`,
      status: data.stability >= 90 ? 'normal' : data.stability >= 70 ? 'warning' : 'critical'
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
        <h3 className="text-lg font-semibold text-gray-900">Grid Status</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="space-y-4 mb-6">
        {gridMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
              <div className={`w-2 h-2 rounded-full ${
                metric.status === 'normal' ? 'bg-forest-500' :
                metric.status === 'warning' ? 'bg-sunset-500' :
                'bg-red-500'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Alerts</h4>
          {data.alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-sunset-50 border border-sunset-200 rounded-lg"
            >
              <AlertTriangle className="h-4 w-4 text-sunset-600" />
              <span className="text-sm text-sunset-800">{alert}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Status Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Grid Health</p>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              data.status === 'online' ? 'bg-forest-500' :
              data.status === 'warning' ? 'bg-sunset-500' :
              'bg-red-500'
            } animate-pulse`} />
            <span className="text-sm font-medium text-gray-700">
              {data.status === 'online' ? 'All Systems Operational' :
               data.status === 'warning' ? 'Minor Issues Detected' :
               'System Issues Detected'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GridStatus 