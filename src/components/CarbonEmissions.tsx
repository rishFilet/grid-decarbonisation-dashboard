import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { CarbonEmissionsData } from '../utils/mockData'
import { format } from 'date-fns'

interface CarbonEmissionsProps {
  data: CarbonEmissionsData[]
}

const CarbonEmissions: React.FC<CarbonEmissionsProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'HH:mm')
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Carbon Emissions</h3>
        <div className="text-sm text-gray-600">
          gCO₂/kWh over 24h
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Emissions (gCO₂/kWh)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} gCO₂/kWh`,
              name === 'emissions' ? 'Current' : 'Target'
            ]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <ReferenceLine 
            y={200} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            label="Target"
          />
          <Line 
            type="monotone" 
            dataKey="emissions" 
            stroke="#dc2626" 
            strokeWidth={3}
            dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Current Average</p>
          <p className="text-xl font-bold text-red-600">
            {Math.round(data.reduce((sum, item) => sum + item.emissions, 0) / data.length)} gCO₂/kWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Reduction Achieved</p>
          <p className="text-xl font-bold text-forest-600">
            {Math.round(data[data.length - 1].reduction)}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default CarbonEmissions 