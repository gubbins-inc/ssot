'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RevisionDiffProps {
  oldRevisionId: string
  newRevisionId: string
  revisions: any[]
}

interface DiffValue {
  old: any;
  new: any;
}

export default function RevisionDiff({ oldRevisionId, newRevisionId, revisions }: RevisionDiffProps) {
  const [diff, setDiff] = useState<Record<string, DiffValue> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const oldRevision = revisions.find(rev => rev.id === oldRevisionId)
  const newRevision = revisions.find(rev => rev.id === newRevisionId)
  
  useEffect(() => {
    const fetchDiff = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/revisions/diff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldRevisionId,
            newRevisionId
          }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch diff')
        }
        
        const data = await response.json()
        setDiff(data.diff)
      } catch (error) {
        console.error('Error fetching diff:', error)
        setError('Failed to load diff comparison')
        toast.error('Failed to load diff comparison')
      } finally {
        setLoading(false)
      }
    }
    
    if (oldRevisionId && newRevisionId) {
      fetchDiff()
    }
  }, [oldRevisionId, newRevisionId])
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Diff</h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    )
  }
  
  if (!diff || Object.keys(diff).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">No Differences Found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          These revisions are identical or have no significant differences.
        </p>
      </div>
    )
  }

  const renderDiffItem = (path: string, diffValue: DiffValue) => {
    const { old, new: newValue } = diffValue;
    
    // Get the key name from the path (last part after the dot)
    const keyName = path.includes('.') ? path.split('.').pop() || path : path;
    
    return (
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0">
        <div className="font-medium text-gray-700 dark:text-gray-300">{keyName}:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
            <div className="text-xs text-red-500 mb-1">Old Value:</div>
            <div className="json-diff-removed">
              {old === undefined ? (
                <em className="text-gray-500 dark:text-gray-400">undefined</em>
              ) : typeof old === 'object' ? (
                <pre className="text-xs overflow-x-auto">{JSON.stringify(old, null, 2)}</pre>
              ) : (
                String(old)
              )}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
            <div className="text-xs text-green-500 mb-1">New Value:</div>
            <div className="json-diff-added">
              {newValue === undefined ? (
                <em className="text-gray-500 dark:text-gray-400">undefined</em>
              ) : typeof newValue === 'object' ? (
                <pre className="text-xs overflow-x-auto">{JSON.stringify(newValue, null, 2)}</pre>
              ) : (
                String(newValue)
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Group diff items by their top-level path
  const groupedDiff: Record<string, Record<string, DiffValue>> = {};
  
  Object.entries(diff).forEach(([path, value]) => {
    const topLevel = path.split('.')[0];
    if (!groupedDiff[topLevel]) {
      groupedDiff[topLevel] = {};
    }
    groupedDiff[topLevel][path] = value as DiffValue;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Revision Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div>
            <h3 className="font-medium mb-1">Old Revision:</h3>
            <div className="text-sm">
              <div>Rev. {oldRevision?.revision}</div>
              <div className="text-gray-500 dark:text-gray-400">{oldRevision?.date.toString().split('T')[0]}</div>
              <div className="text-gray-500 dark:text-gray-400">By: {oldRevision?.author}</div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-1">New Revision:</h3>
            <div className="text-sm">
              <div>Rev. {newRevision?.revision}</div>
              <div className="text-gray-500 dark:text-gray-400">{newRevision?.date.toString().split('T')[0]}</div>
              <div className="text-gray-500 dark:text-gray-400">By: {newRevision?.author}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Changes</h3>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-[600px] overflow-y-auto">
          {Object.entries(groupedDiff).map(([section, items]) => (
            <div key={section} className="mb-6 pb-6 border-b border-gray-300 dark:border-gray-600 last:border-0 last:mb-0 last:pb-0">
              <h4 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">{section}</h4>
              <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                {Object.entries(items).map(([path, value]) => (
                  <div key={path}>
                    {renderDiffItem(path, value as DiffValue)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}