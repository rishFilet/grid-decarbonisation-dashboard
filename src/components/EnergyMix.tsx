import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { EnergyMixData } from '../utils/mockData'
import { format } from 'date-fns'

interface EnergyMixProps {
  data: EnergyMixData[]
}

const EnergyMix: React.FC<EnergyMixProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'HH:mm')
  }))

  const colors = {
    solar: '#fbbf24',
    wind: '#3b82f6',
    hydro: '#06b6d4',
    nuclear: '#8b5cf6',
    gas: '#ef4444',
    coal: '#6b7280',
    biomass: '#10b981'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="chart-container"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Energy Mix (24h)</h3>
        <div className="text-sm text-gray-600">
          Real-time generation by source
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Generation (GW)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} GW`,
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="solar" 
            stackId="1" 
            stroke={colors.solar} 
            fill={colors.solar} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="wind" 
            stackId="1" 
            stroke={colors.wind} 
            fill={colors.wind} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="hydro" 
            stackId="1" 
            stroke={colors.hydro} 
            fill={colors.hydro} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="nuclear" 
            stackId="1" 
            stroke={colors.nuclear} 
            fill={colors.nuclear} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="gas" 
            stackId="1" 
            stroke={colors.gas} 
            fill={colors.gas} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="coal" 
            stackId="1" 
            stroke={colors.coal} 
            fill={colors.coal} 
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="biomass" 
            stackId="1" 
            stroke={colors.biomass} 
            fill={colors.biomass} 
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default EnergyMix 