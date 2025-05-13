'use client'

import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'

export default function ChangeLogForm() {
  const { control, register, formState: { errors }, getValues, setValue } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'changeLog'
  })
  
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{
    revision: string;
    date: string;
    author: string;
    description: string;
    approvedBy: string;
    sections: string[];
  }>({
    revision: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    description: '',
    approvedBy: '',
    sections: []
  })
  
  const [newSection, setNewSection] = useState('')
  
  const handleAddChangeLog = () => {
    append({
      revision: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      description: '',
      approvedBy: '',
      sections: []
    })
    setEditIndex(fields.length)
    setEditValues({
      revision: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      description: '',
      approvedBy: '',
      sections: []
    })
  }
  
  const handleEditChangeLog = (index: number) => {
    setEditValues(getValues(`changeLog.${index}`))
    setEditIndex(index)
  }
  
  const handleSaveChangeLog = () => {
    if (editIndex !== null) {
      update(editIndex, editValues)
      setEditIndex(null)
    }
  }
  
  const handleCancelEdit = () => {
    setEditIndex(null)
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAddSection = () => {
    if (newSection.trim()) {
      setEditValues(prev => ({
        ...prev,
        sections: [...prev.sections, newSection.trim()]
      }))
      setNewSection('')
    }
  }
  
  const handleRemoveSection = (index: number) => {
    setEditValues(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Change Log</h2>
        <button
          type="button"
          onClick={handleAddChangeLog}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Change Log Entry
        </button>
      </div>
      
      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No change log entries added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
                editIndex === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center">
                  <span className="bg-purple-500 text-white rounded-full px-2 py-1 text-xs font-medium mr-3">
                    Rev. {getValues(`changeLog.${index}.revision`)}
                  </span>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getValues(`changeLog.${index}.description`) || 'No description'}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditChangeLog(index)}
                    className="p-1 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                    disabled={index === 0}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {editIndex === index ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="form-group">
                      <label className="label">Revision</label>
                      <input
                        type="text"
                        name="revision"
                        value={editValues.revision}
                        onChange={handleChange}
                        className="input"
                        placeholder="A"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editValues.date}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Author</label>
                      <input
                        type="text"
                        name="author"
                        value={editValues.author}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="label">Description</label>
                      <textarea
                        name="description"
                        value={editValues.description}
                        onChange={handleChange}
                        className="input"
                        rows={2}
                        placeholder="Description of changes"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Approved By</label>
                      <input
                        type="text"
                        name="approvedBy"
                        value={editValues.approvedBy}
                        onChange={handleChange}
                        className="input"
                        placeholder="Jane Smith"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Sections Changed</label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        className="input rounded-r-none"
                        placeholder="Add a section (e.g., Header, Parts, Steps)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSection()
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="px-4 bg-purple-500 text-white rounded-r-md hover:bg-purple-600 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editValues.sections.map((section, i) => (
                        <div key={i} className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 rounded-full flex items-center">
                          <span>{section}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(i)}
                            className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChangeLog}
                      className="btn btn-primary"
                    >
                      Save Change Log
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>{' '}
                      <span>{getValues(`changeLog.${index}.date`)}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Author:</span>{' '}
                      <span>{getValues(`changeLog.${index}.author`)}</span>
                    </div>
                    
                    {getValues(`changeLog.${index}.approvedBy`) && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Approved By:</span>{' '}
                        <span>{getValues(`changeLog.${index}.approvedBy`)}</span>
                      </div>
                    )}
                    
                    {getValues(`changeLog.${index}.sections`)?.length > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Sections:</span>{' '}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getValues(`changeLog.${index}.sections`).map((section: string, i: number) => (
                            <span
                              key={i}
                              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 text-xs rounded"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input type="hidden" {...register(`changeLog.${index}.revision`)} />
                  <input type="hidden" {...register(`changeLog.${index}.date`)} />
                  <input type="hidden" {...register(`changeLog.${index}.author`)} />
                  <input type="hidden" {...register(`changeLog.${index}.description`)} />
                  <input type="hidden" {...register(`changeLog.${index}.approvedBy`)} />
                  {/* Register sections array properly */}
                  {getValues(`changeLog.${index}.sections`)?.map((_, i) => (
                    <input key={`section-${i}`} type="hidden" {...register(`changeLog.${index}.sections.${i}`)} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}