import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

const StatCard = ({ title, value, change, changeType, icon: Icon }) => {
  return (
    <div className="card">
      <div className="flex items-center">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-success-600' : 'text-error-600'
          }`}>
            {changeType === 'positive' ? (
              <ArrowUpIcon className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="ml-1 font-medium">{change}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatCard



