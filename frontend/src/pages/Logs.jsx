import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { logsAPI } from '../services/api'
import LogFilters from '../components/LogFilters'
import LogTable from '../components/LogTable'
import Pagination from '../components/Pagination'
import DateRangePicker from '../components/DateRangePicker'

const Logs = () => {
  const [filters, setFilters] = useState({
    severity: '',
    hostname: '',
    source: '',
    category: '',
    search: '',
  })
  
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    sortBy: 'timestamp',
    sortOrder: 'DESC',
  })

  const { data: logsData, isLoading, error, refetch } = useQuery(
    ['logs', { ...filters, ...dateRange, ...pagination }],
    () => logsAPI.getLogs({ ...filters, ...dateRange, ...pagination }),
    {
      keepPreviousData: true,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleSortChange = (sortBy, sortOrder) => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  const handleRefresh = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
          <button
            onClick={handleRefresh}
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Error loading logs</div>
            <div className="text-gray-600">{error.message}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
        <div className="flex items-center space-x-4">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <button
            onClick={handleRefresh}
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <LogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Logs Table */}
      <div className="card">
        <LogTable
          logs={logsData?.data || []}
          isLoading={isLoading}
          sortBy={pagination.sortBy}
          sortOrder={pagination.sortOrder}
          onSort={handleSortChange}
        />
      </div>

      {/* Pagination */}
      {logsData?.pagination && (
        <Pagination
          currentPage={logsData.pagination.page}
          totalPages={logsData.pagination.totalPages}
          totalItems={logsData.pagination.total}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handleLimitChange}
        />
      )}
    </div>
  )
}

export default Logs



