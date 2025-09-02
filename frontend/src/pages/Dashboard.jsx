import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { format, subDays } from 'date-fns'
import { statsAPI } from '../services/api'
import StatCard from '../components/StatCard'
import SeverityChart from '../components/charts/SeverityChart'
import HostnameChart from '../components/charts/HostnameChart'
import TimeSeriesChart from '../components/charts/TimeSeriesChart'
import DateRangePicker from '../components/DateRangePicker'

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })

  const { data: overview, isLoading, error } = useQuery(
    ['dashboard-overview', dateRange],
    () => statsAPI.getOverview(dateRange),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Error loading dashboard</div>
            <div className="text-gray-600">{error.message}</div>
          </div>
        </div>
      </div>
    )
  }

  const { summary, severity, hostnames, sources, categories } = overview?.data || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Logs"
          value={summary?.totalLogs?.toLocaleString() || '0'}
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Unique Hosts"
          value={summary?.uniqueHosts?.toLocaleString() || '0'}
          change="+5%"
          changeType="positive"
        />
        <StatCard
          title="Error Count"
          value={summary?.errorCount?.toLocaleString() || '0'}
          change="-8%"
          changeType="negative"
        />
        <StatCard
          title="Warning Count"
          value={summary?.warningCount?.toLocaleString() || '0'}
          change="+2%"
          changeType="positive"
        />
      </div>

      {/* Time Series Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Log Volume Over Time</h3>
        <TimeSeriesChart dateRange={dateRange} />
      </div>
      
      {/* Charts */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Severity Distribution</h3>
          <SeverityChart data={severity} />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Hostnames</h3>
          <HostnameChart data={hostnames} />
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Sources</h3>
          <div className="space-y-3">
            {sources?.slice(0, 8).map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{source.label}</span>
                <span className="text-sm font-medium text-gray-900">{source.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Categories</h3>
          <div className="space-y-3">
            {categories?.slice(0, 8).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{category.label}</span>
                <span className="text-sm font-medium text-gray-900">{category.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard



