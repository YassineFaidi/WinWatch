import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { format, subDays } from 'date-fns'
import { statsAPI } from '../services/api'
import DateRangePicker from '../components/DateRangePicker'
import SeverityChart from '../components/charts/SeverityChart'
import HostnameChart from '../components/charts/HostnameChart'
import TimeSeriesChart from '../components/charts/TimeSeriesChart'

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })

  const [timeInterval, setTimeInterval] = useState('1 hour')

  const { data: summary, isLoading: summaryLoading } = useQuery(
    ['analytics-summary', dateRange],
    () => statsAPI.getSummary(dateRange)
  )

  const { data: severityData, isLoading: severityLoading } = useQuery(
    ['analytics-severity', dateRange],
    () => statsAPI.getSeverityDistribution(dateRange)
  )

  const { data: hostnameData, isLoading: hostnameLoading } = useQuery(
    ['analytics-hostnames', dateRange],
    () => statsAPI.getHostnameDistribution(dateRange, 15)
  )

  const { data: sourceData, isLoading: sourceLoading } = useQuery(
    ['analytics-sources', dateRange],
    () => statsAPI.getSourceDistribution(dateRange)
  )

  const { data: categoryData, isLoading: categoryLoading } = useQuery(
    ['analytics-categories', dateRange],
    () => statsAPI.getCategoryDistribution(dateRange)
  )

  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useQuery(
    ['analytics-timeseries', dateRange, timeInterval],
    () => statsAPI.getTimeSeriesData({ ...dateRange, interval: timeInterval })
  )

  const isLoading = summaryLoading || severityLoading || hostnameLoading || sourceLoading || categoryLoading || timeSeriesLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-4">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <select
              value={timeInterval}
              onChange={(e) => setTimeInterval(e.target.value)}
              className="select w-40"
            >
              <option value="1 minute">1 minute</option>
              <option value="5 minutes">5 minutes</option>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="6 hours">6 hours</option>
              <option value="12 hours">12 hours</option>
              <option value="1 day">1 day</option>
            </select>
          </div>
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center space-x-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <select
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
            className="select w-40"
          >
            <option value="1 minute">1 minute</option>
            <option value="5 minutes">5 minutes</option>
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="6 hours">6 hours</option>
            <option value="12 hours">12 hours</option>
            <option value="1 day">1 day</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Logs</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary?.data?.totalLogs?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Unique Hosts</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary?.data?.uniqueHosts?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Unique Sources</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary?.data?.uniqueSources?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Unique Categories</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary?.data?.uniqueCategories?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Severity Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Severity Distribution</h3>
          <SeverityChart data={severityData?.data} />
        </div>

        {/* Hostname Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Hostnames</h3>
          <HostnameChart data={hostnameData?.data} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Sources</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sourceData?.data?.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{source.label}</span>
                <span className="text-sm font-medium text-gray-900">{source.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Log Categories</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {categoryData?.data?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{category.label}</span>
                <span className="text-sm font-medium text-gray-900">{category.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Log Volume Over Time</h3>
        <TimeSeriesChart dateRange={dateRange} />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Error Analysis */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Error Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Count</span>
              <span className="text-lg font-semibold text-error-600">
                {summary?.data?.errorCount?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warning Count</span>
              <span className="text-lg font-semibold text-warning-600">
                {summary?.data?.warningCount?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Info Count</span>
              <span className="text-lg font-semibold text-info-600">
                {summary?.data?.infoCount?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Logs/Hour</span>
              <span className="text-lg font-semibold text-gray-900">
                {summary?.data?.totalLogs ? 
                  Math.round(summary.data.totalLogs / 24) : '0'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-lg font-semibold text-error-600">
                {summary?.data?.totalLogs && summary?.data?.errorCount ? 
                  `${((summary.data.errorCount / summary.data.totalLogs) * 100).toFixed(2)}%` : '0%'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warning Rate</span>
              <span className="text-lg font-semibold text-warning-600">
                {summary?.data?.totalLogs && summary?.data?.warningCount ? 
                  `${((summary.data.warningCount / summary.data.totalLogs) * 100).toFixed(2)}%` : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics



