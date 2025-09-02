import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const SeverityChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  const COLORS = {
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    DEBUG: '#6b7280',
    CRITICAL: '#dc2626',
    FATAL: '#7c2d12',
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.label] || '#6b7280'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value.toLocaleString(), name]}
          labelFormatter={(label) => `Severity: ${label}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SeverityChart



