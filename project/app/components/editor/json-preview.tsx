'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'

export default function JsonPreview() {
  const { watch } = useFormContext()
  const formValues = watch()
  const [formattedJson, setFormattedJson] = useState('')

  useEffect(() => {
    try {
      const formatted = JSON.stringify(formValues, null, 2)
      setFormattedJson(formatted)
    } catch (error) {
      console.error('Error formatting JSON:', error)
      setFormattedJson('Error formatting JSON')
    }
  }, [formValues])

  return (
    <div className="code-editor">
      <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px]">
        {formattedJson}
      </pre>
    </div>
  )
}