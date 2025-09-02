import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { logsAPI } from '../services/api'

const LogFilters = ({ filters, onFilterChange, dateRange, onDateRangeChange }) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch distinct values for filter options
  const { data: severityOptions } = useQuery(['distinct', 'severity'], () => logsAPI.getDistinctValues('severity'))
  const { data: hostnameOptions } = useQuery(['distinct', 'hostname'], () => logsAPI.getDistinctValues('hostname'))
  const { data: sourceOptions } = useQuery(['distinct', 'source'], () => logsAPI.getDistinctValues('source'))
  const { data: categoryOptions } = useQuery(['distinct', 'category'], () => logsAPI.getDistinctValues('category'))

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      severity: '',
      hostname: '',
      source: '',
      category: '',
      search: '',
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FunnelIcon className="h-4 w-4 mr-1" />
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search Bar - Always visible */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search in messages and raw data..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={localFilters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="select"
              >
                <option value="">All Severities</option>
                {severityOptions?.data?.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hostname
              </label>
              <select
                value={localFilters.hostname}
                onChange={(e) => handleFilterChange('hostname', e.target.value)}
                className="select"
              >
                <option value="">All Hostnames</option>
                {hostnameOptions?.data?.map((hostname) => (
                  <option key={hostname} value={hostname}>
                    {hostname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={localFilters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="select"
              >
                <option value="">All Sources</option>
                {sourceOptions?.data?.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="select"
              >
                <option value="">All Categories</option>
                {categoryOptions?.data?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleApplyFilters}
                className="btn-primary"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                Clear All
              </button>
            </div>
            
            {hasActiveFilters && (
              <div className="text-sm text-gray-500">
                {Object.values(filters).filter(v => v !== '').length} active filters
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LogFilters



