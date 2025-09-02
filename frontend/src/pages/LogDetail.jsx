import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { logsAPI } from '../services/api'

const LogDetail = () => {
  const { id } = useParams()

  const { data: logData, isLoading, error } = useQuery(
    ['log', id],
    () => logsAPI.getLogById(id),
    {
      enabled: !!id,
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link to="/logs" className="btn-secondary mr-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Logs
          </Link>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link to="/logs" className="btn-secondary mr-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Logs
          </Link>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Error loading log</div>
            <div className="text-gray-600">{error.message}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!logData?.data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link to="/logs" className="btn-secondary mr-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Logs
          </Link>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-gray-500 text-lg">Log not found</div>
          </div>
        </div>
      </div>
    )
  }

  const log = logData.data

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

  const formatField = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Not specified</span>
    }
    return value
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/logs" className="btn-secondary mr-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Logs
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Log Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Log ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{log.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(log.timestamp), 'PPP p')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Severity</dt>
              <dd className="mt-1">{getSeverityBadge(log.severity)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Hostname</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.hostname)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Source</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.source)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.category)}</dd>
            </div>
          </dl>
        </div>

        {/* Additional Details */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Event ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.eventId)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">User</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.user)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Process</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.process)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Thread</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatField(log.thread)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Message */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Message</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{log.message}</p>
        </div>
      </div>

      {/* Raw Data */}
      {log.rawData && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Raw Data</h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
              {log.rawData}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogDetail



