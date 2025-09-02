import React from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'

const DateRangePicker = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">Date Range:</span>
      </div>
      <input
        type="date"
        value={value.startDate}
        onChange={(e) => onChange({ ...value, startDate: e.target.value })}
        className="input w-40"
      />
      <span className="text-gray-400">to</span>
      <input
        type="date"
        value={value.endDate}
        onChange={(e) => onChange({ ...value, endDate: e.target.value })}
        className="input w-40"
      />
    </div>
  )
}

export default DateRangePicker



