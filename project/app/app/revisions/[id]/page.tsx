'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Clock, Download, Edit, GitCompare, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import RevisionDiff from '@/components/revisions/revision-diff'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'

interface Revision {
  id: string
  revision: string
  date: string
  author: string
  description: string
  approvedBy: string | null
  sections: string[]
  jsonContent: string
  createdAt: string
}

interface Instruction {
  id: string
  title: string
  documentNumber: string
  revision: string
  date: string
  author: string
  department: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  revisions: Revision[]
}

export default function RevisionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [instruction, setInstruction] = useState<Instruction | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRevisions, setSelectedRevisions] = useState<string[]>([])
  const [showDiff, setShowDiff] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchInstruction = async () => {
      try {
        const response = await fetch(`/api/instructions/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch instruction')
        }
        const data = await response.json()
        setInstruction(data)
        
        // Select the latest revision by default
        if (data.revisions && data.revisions.length > 0) {
          setSelectedRevisions([data.revisions[0].id])
        }
      } catch (error) {
        console.error('Error fetching instruction:', error)
        toast.error('Failed to load instruction')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInstruction()
    }
  }, [id])

  const handleRevisionSelect = (revisionId: string) => {
    if (selectedRevisions.includes(revisionId)) {
      // If already selected and we have more than one, remove it
      if (selectedRevisions.length > 1) {
        setSelectedRevisions(selectedRevisions.filter(id => id !== revisionId))
      }
    } else {
      // If we already have two selected, replace the oldest one
      if (selectedRevisions.length >= 2) {
        setSelectedRevisions([selectedRevisions[1], revisionId])
      } else {
        setSelectedRevisions([...selectedRevisions, revisionId])
      }
    }
  }

  const handleGenerateOutput = async (format: 'html' | 'pdf') => {
    if (!instruction || selectedRevisions.length === 0) return
    
    try {
      const selectedRevision = instruction.revisions.find(rev => rev.id === selectedRevisions[0])
      if (!selectedRevision) return
      
      const response = await fetch(`/api/generate/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructionId: instruction.id,
          revisionId: selectedRevision.id
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to generate ${format.toUpperCase()}`)
      }
      
      // For HTML, we can open in a new tab
      if (format === 'html') {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      } else {
        // For PDF, we need to download the file
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${instruction.documentNumber}_Rev${instruction.revision}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      
      toast.success(`${format.toUpperCase()} generated successfully`)
    } catch (error) {
      console.error(`Error generating ${format}:`, error)
      toast.error(`Failed to generate ${format.toUpperCase()}`)
    }
  }

  const handleDeleteInstruction = async () => {
    if (!instruction) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/instructions/${instruction.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete instruction')
      }
      
      toast.success('Instruction deleted successfully')
      router.push('/revisions')
    } catch (error) {
      console.error('Error deleting instruction:', error)
      toast.error('Failed to delete instruction')
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!instruction) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Instruction Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The instruction you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/revisions" className="btn btn-primary">
            Back to Revisions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/revisions" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Revisions
            </Link>
            <h1 className="text-3xl font-bold">{instruction.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                {instruction.documentNumber}
              </span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                Rev. {instruction.revision}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Updated {formatDate(instruction.updatedAt)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenerateOutput('html')}
              className="btn btn-secondary flex items-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate HTML
            </button>
            <button
              onClick={() => handleGenerateOutput('pdf')}
              className="btn btn-secondary flex items-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Generate PDF
            </button>
            <Link href={`/editor/${instruction.id}`} className="btn btn-primary flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit
            </Link>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogTrigger asChild>
                <button className="btn bg-red-500 text-white hover:bg-red-600 flex items-center">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Instruction</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to delete this instruction? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <button className="btn btn-secondary">Cancel</button>
                    </DialogClose>
                    <button
                      onClick={handleDeleteInstruction}
                      disabled={isDeleting}
                      className="btn bg-red-500 text-white hover:bg-red-600"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Revisions</h2>
                {selectedRevisions.length === 2 && (
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm"
                  >
                    <GitCompare className="h-4 w-4 mr-1" />
                    {showDiff ? 'Hide Diff' : 'Show Diff'}
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedRevisions.length === 0
                  ? 'Select a revision to view'
                  : selectedRevisions.length === 1
                  ? 'Select another revision to compare'
                  : 'Comparing 2 revisions'}
              </p>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {instruction.revisions.map((revision, index) => (
                  <motion.div
                    key={revision.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRevisions.includes(revision.id)
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleRevisionSelect(revision.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Rev. {revision.revision}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(revision.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {revision.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      By: {revision.author}
                      {revision.approvedBy && ` • Approved: ${revision.approvedBy}`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {selectedRevisions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Revision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a revision from the sidebar to view its details
                </p>
              </div>
            ) : selectedRevisions.length === 2 && showDiff ? (
              <RevisionDiff
                oldRevisionId={selectedRevisions[0]}
                newRevisionId={selectedRevisions[1]}
                revisions={instruction.revisions}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {selectedRevisions.map(revId => {
                  const revision = instruction.revisions.find(r => r.id === revId)
                  if (!revision) return null
                  
                  // Parse the JSON content
                  let content
                  try {
                    content = JSON.parse(revision.jsonContent)
                  } catch (e) {
                    content = { error: 'Invalid JSON content' }
                  }
                  
                  return (
                    <div key={revision.id} className="mb-8">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">
                          Revision {revision.revision}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(revision.date)}
                          </span>
                          <span>Author: {revision.author}</span>
                          {revision.approvedBy && (
                            <span>Approved by: {revision.approvedBy}</span>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
                          <h4 className="font-medium mb-1">Description:</h4>
                          <p>{revision.description}</p>
                        </div>
                        {revision.sections && revision.sections.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Sections Changed:</h4>
                            <div className="flex flex-wrap gap-1">
                              {revision.sections.map(section => (
                                <span
                                  key={section}
                                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 text-xs rounded"
                                >
                                  {section}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Display the content */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-4">Content</h3>
                        
                        {/* Header */}
                        {content.header && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2">Header</h4>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                                  <p className="font-medium">{content.header.title}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Document Number</p>
                                  <p className="font-medium">{content.header.documentNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Revision</p>
                                  <p className="font-medium">{content.header.revision}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                  <p className="font-medium">{content.header.date}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                                  <p className="font-medium">{content.header.author}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                                  <p className="font-medium">{content.header.department}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                                  <p className="font-medium">{content.header.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Tags</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {content.header.tags && content.header.tags.map((tag: string) => (
                                      <span
                                        key={tag}
                                        className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 text-xs rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Parts */}
                        {content.parts && content.parts.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2">Parts ({content.parts.length})</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Part Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Unit
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Reference
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                  {content.parts.map((part: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {part.partNumber}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {part.description}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {part.quantity}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {part.unit}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {part.reference || '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        {/* Steps */}
                        {content.steps && content.steps.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2">Steps ({content.steps.length})</h4>
                            <div className="space-y-4">
                              {content.steps.map((step: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                  <h5 className="font-medium mb-2">
                                    Step {step.stepNumber}: {step.title}
                                  </h5>
                                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    {step.description}
                                  </p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    {step.duration && (
                                      <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                        <p>{step.duration} minutes</p>
                                      </div>
                                    )}
                                    
                                    {step.warnings && step.warnings.length > 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Warnings</p>
                                        <ul className="list-disc list-inside">
                                          {step.warnings.map((warning: string, i: number) => (
                                            <li key={i} className="text-red-600 dark:text-red-400">{warning}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {step.tools && step.tools.length > 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tools</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {step.tools.map((tool: string, i: number) => (
                                            <span
                                              key={i}
                                              className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 text-xs rounded"
                                            >
                                              {tool}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {step.partsUsed && step.partsUsed.length > 0 && (
                                      <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Parts Used</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {step.partsUsed.map((partId: string, i: number) => (
                                            <span
                                              key={i}
                                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-xs rounded"
                                            >
                                              {partId}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Footer */}
                        {content.footer && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2">Footer</h4>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                              {content.footer.approvals && content.footer.approvals.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="font-medium mb-2">Approvals</h5>
                                  <div className="space-y-2">
                                    {content.footer.approvals.map((approval: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="font-medium">{approval.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400">({approval.role})</span>
                                        <span className="text-gray-500 dark:text-gray-400">{approval.date}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {content.footer.notes && (
                                <div className="mb-4">
                                  <h5 className="font-medium mb-1">Notes</h5>
                                  <p className="text-gray-700 dark:text-gray-300">{content.footer.notes}</p>
                                </div>
                              )}
                              
                              {content.footer.references && (
                                <div className="mb-4">
                                  <h5 className="font-medium mb-1">References</h5>
                                  <p className="text-gray-700 dark:text-gray-300">{content.footer.references}</p>
                                </div>
                              )}
                              
                              {content.footer.contactInformation && (
                                <div>
                                  <h5 className="font-medium mb-1">Contact Information</h5>
                                  <p className="text-gray-700 dark:text-gray-300">{content.footer.contactInformation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Change Log */}
                        {content.changeLog && content.changeLog.length > 0 && (
                          <div>
                            <h4 className="text-lg font-medium mb-2">Change Log</h4>
                            <div className="space-y-3">
                              {content.changeLog.map((change: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    <span className="font-medium">Rev. {change.revision}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{change.date}</span>
                                    <span className="text-gray-500 dark:text-gray-400">By: {change.author}</span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 mb-2">{change.description}</p>
                                  {change.approvedBy && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Approved by: {change.approvedBy}
                                    </p>
                                  )}
                                  {change.sections && change.sections.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sections:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {change.sections.map((section: string, i: number) => (
                                          <span
                                            key={i}
                                            className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 text-xs rounded"
                                          >
                                            {section}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}