import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const HostnameChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="label" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => [value.toLocaleString(), 'Count']}
          labelFormatter={(label) => `Hostname: ${label}`}
        />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default HostnameChart



