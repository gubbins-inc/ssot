'use client'

import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function StepsForm() {
  const { control, register, formState: { errors }, getValues, setValue, watch } = useFormContext()
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: 'steps'
  })
  
  const parts = watch('parts') || []
  
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{
    stepNumber: number;
    title: string;
    description: string;
    duration: number;
    warnings: string[];
    tools: string[];
    partsUsed: string[];
    imageUri: string;
  }>({
    stepNumber: 1,
    title: '',
    description: '',
    duration: 0,
    warnings: [],
    tools: [],
    partsUsed: [],
    imageUri: ''
  })
  
  const [newWarning, setNewWarning] = useState('')
  const [newTool, setNewTool] = useState('')
  
  const handleAddStep = () => {
    const nextStepNumber = fields.length > 0 
      ? Math.max(...fields.map(f => getValues(`steps.${fields.indexOf(f)}.stepNumber`))) + 1 
      : 1
    
    append({
      stepNumber: nextStepNumber,
      title: '',
      description: '',
      duration: 0,
      warnings: [],
      tools: [],
      partsUsed: [],
      imageUri: ''
    })
    setEditIndex(fields.length)
    setEditValues({
      stepNumber: nextStepNumber,
      title: '',
      description: '',
      duration: 0,
      warnings: [],
      tools: [],
      partsUsed: [],
      imageUri: ''
    })
  }
  
  const handleEditStep = (index: number) => {
    setEditValues(getValues(`steps.${index}`))
    setEditIndex(index)
  }
  
  const handleSaveStep = () => {
    if (editIndex !== null) {
      // Ensure numeric fields are properly converted to numbers
      const updatedValues = {
        ...editValues,
        stepNumber: Number(editValues.stepNumber),
        duration: editValues.duration ? Number(editValues.duration) : 0
      }
      update(editIndex, updatedValues)
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
      [name]: name === 'duration' || name === 'stepNumber' ? parseInt(value) || 0 : value
    }))
  }
  
  const handleAddWarning = () => {
    if (newWarning.trim()) {
      setEditValues(prev => ({
        ...prev,
        warnings: [...prev.warnings, newWarning.trim()]
      }))
      setNewWarning('')
    }
  }
  
  const handleRemoveWarning = (index: number) => {
    setEditValues(prev => ({
      ...prev,
      warnings: prev.warnings.filter((_, i) => i !== index)
    }))
  }
  
  const handleAddTool = () => {
    if (newTool.trim()) {
      setEditValues(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }))
      setNewTool('')
    }
  }
  
  const handleRemoveTool = (index: number) => {
    setEditValues(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }))
  }
  
  const handleTogglePart = (partNumber: string) => {
    setEditValues(prev => {
      if (prev.partsUsed.includes(partNumber)) {
        return {
          ...prev,
          partsUsed: prev.partsUsed.filter(p => p !== partNumber)
        }
      } else {
        return {
          ...prev,
          partsUsed: [...prev.partsUsed, partNumber]
        }
      }
    })
  }
  
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      move(index, index - 1)
      
      // Update step numbers
      const currentStepNumber = getValues(`steps.${index - 1}.stepNumber`)
      const prevStepNumber = getValues(`steps.${index}.stepNumber`)
      
      setValue(`steps.${index - 1}.stepNumber`, prevStepNumber)
      setValue(`steps.${index}.stepNumber`, currentStepNumber)
    } else if (direction === 'down' && index < fields.length - 1) {
      move(index, index + 1)
      
      // Update step numbers
      const currentStepNumber = getValues(`steps.${index + 1}.stepNumber`)
      const nextStepNumber = getValues(`steps.${index}.stepNumber`)
      
      setValue(`steps.${index + 1}.stepNumber`, nextStepNumber)
      setValue(`steps.${index}.stepNumber`, currentStepNumber)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assembly Steps</h2>
        <button
          type="button"
          onClick={handleAddStep}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Step
        </button>
      </div>
      
      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No steps added yet. Click "Add Step" to get started.</p>
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
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {getValues(`steps.${index}.stepNumber`)}
                  </span>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getValues(`steps.${index}.title`) || 'Untitled Step'}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded-full ${
                      index === 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'down')}
                    disabled={index === fields.length - 1}
                    className={`p-1 rounded-full ${
                      index === fields.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditStep(index)}
                    className="p-1 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {editIndex === index ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="label">Step Number</label>
                      <input
                        type="number"
                        name="stepNumber"
                        value={editValues.stepNumber}
                        onChange={handleChange}
                        className="input"
                        min="1"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editValues.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="Step title"
                      />
                    </div>
                    
                    <div className="form-group md:col-span-2">
                      <label className="label">Description</label>
                      <textarea
                        name="description"
                        value={editValues.description}
                        onChange={handleChange}
                        className="input"
                        rows={3}
                        placeholder="Detailed step description"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        value={editValues.duration}
                        onChange={handleChange}
                        className="input"
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Image URI</label>
                      <input
                        type="text"
                        name="imageUri"
                        value={editValues.imageUri}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://example.com/images/step.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="label">Warnings</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newWarning}
                          onChange={(e) => setNewWarning(e.target.value)}
                          className="input rounded-r-none"
                          placeholder="Add a warning"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddWarning()
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddWarning}
                          className="px-4 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editValues.warnings.map((warning, i) => (
                          <div key={i} className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded">
                            <span className="text-yellow-800 dark:text-yellow-300">{warning}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveWarning(i)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Tools</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newTool}
                          onChange={(e) => setNewTool(e.target.value)}
                          className="input rounded-r-none"
                          placeholder="Add a tool"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddTool()
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddTool}
                          className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editValues.tools.map((tool, i) => (
                          <div key={i} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                            <span className="text-blue-800 dark:text-blue-300">{tool}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTool(i)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group mt-4">
                    <label className="label">Parts Used</label>
                    {parts.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No parts available. Add parts in the Parts tab first.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {parts.map((part: any, i: number) => (
                          <div
                            key={i}
                            className={`flex items-center p-2 rounded cursor-pointer ${
                              editValues.partsUsed.includes(part.partNumber)
                                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800'
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleTogglePart(part.partNumber)}
                          >
                            <input
                              type="checkbox"
                              checked={editValues.partsUsed.includes(part.partNumber)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium text-sm">{part.partNumber}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{part.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      onClick={handleSaveStep}
                      className="btn btn-primary"
                    >
                      Save Step
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {getValues(`steps.${index}.description`)}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    {getValues(`steps.${index}.duration`) > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>{' '}
                        <span>{getValues(`steps.${index}.duration`)} minutes</span>
                      </div>
                    )}
                    
                    {getValues(`steps.${index}.warnings`)?.length > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Warnings:</span>{' '}
                        <span>{getValues(`steps.${index}.warnings`).length}</span>
                      </div>
                    )}
                    
                    {getValues(`steps.${index}.tools`)?.length > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Tools:</span>{' '}
                        <span>{getValues(`steps.${index}.tools`).length}</span>
                      </div>
                    )}
                    
                    {getValues(`steps.${index}.partsUsed`)?.length > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Parts:</span>{' '}
                        <span>{getValues(`steps.${index}.partsUsed`).length}</span>
                      </div>
                    )}
                  </div>
                  
                  <input type="hidden" {...register(`steps.${index}.stepNumber`)} />
                  <input type="hidden" {...register(`steps.${index}.title`)} />
                  <input type="hidden" {...register(`steps.${index}.description`)} />
                  <input type="hidden" {...register(`steps.${index}.duration`)} />
                  <input type="hidden" {...register(`steps.${index}.imageUri`)} />
                  {/* Register array fields properly */}
                  {getValues(`steps.${index}.warnings`)?.map((_, i) => (
                    <input key={`warning-${i}`} type="hidden" {...register(`steps.${index}.warnings.${i}`)} />
                  ))}
                  {getValues(`steps.${index}.tools`)?.map((_, i) => (
                    <input key={`tool-${i}`} type="hidden" {...register(`steps.${index}.tools.${i}`)} />
                  ))}
                  {getValues(`steps.${index}.partsUsed`)?.map((_, i) => (
                    <input key={`part-${i}`} type="hidden" {...register(`steps.${index}.partsUsed.${i}`)} />
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