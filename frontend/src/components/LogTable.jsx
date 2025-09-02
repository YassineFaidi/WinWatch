import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const LogTable = ({ logs, isLoading, sortBy, sortOrder, onSort }) => {
  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC'
    onSort(field, newOrder)
  }

  const getSeverityBadge = (severity) => {
    const badgeClasses = {
      ERROR: 'badge-error',
      WARNING: 'badge-warning',
      INFO: 'badge-info',
      DEBUG: 'badge-debug',
      CRITICAL: 'badge-error',
      FATAL: 'badge-error',
    }
    
    return (
      <span className={`badge ${badgeClasses[severity] || 'badge-debug'}`}>
        {severity}
      </span>
    )
  }

  const SortableHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === 'ASC' ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )
      )}
    </button>
  )

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hostname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No logs found</div>
        <div className="text-gray-400 text-sm mt-1">Try adjusting your filters or date range</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="timestamp">Timestamp</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="severity">Severity</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="hostname">Hostname</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="source">Source</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="message">Message</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getSeverityBadge(log.severity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.hostname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.source}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs truncate" title={log.message}>
                  {log.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/logs/${log.id}`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LogTable



