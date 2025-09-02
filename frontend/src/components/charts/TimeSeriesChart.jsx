import React from 'react'
import { useQuery } from 'react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { statsAPI } from '../../services/api'

const TimeSeriesChart = ({ dateRange }) => {
  const { data: timeSeriesData, isLoading, error } = useQuery(
    ['time-series', dateRange],
    () => statsAPI.getTimeSeriesData({ ...dateRange, interval: '1 hour' }),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error loading time series data: {error.message}
      </div>
    )
  }

  if (!timeSeriesData?.data || timeSeriesData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No time series data available
      </div>
    )
  }

  const data = timeSeriesData.data.map(item => ({
    ...item,
    time: format(new Date(item.time), 'MMM dd HH:mm'),
  }))

  const severities = ['ERROR', 'WARNING', 'INFO', 'DEBUG']
  const colors = {
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    DEBUG: '#6b7280',
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [value?.toLocaleString() || 0, name]}
          labelFormatter={(label) => `Time: ${label}`}
        />
        <Legend />
        {severities.map((severity) => (
          <Line
            key={severity}
            type="monotone"
            dataKey={severity}
            stroke={colors[severity]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TimeSeriesChart



