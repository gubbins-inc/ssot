'use client'

import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'

export default function FooterForm() {
  const { control, register, formState: { errors }, getValues, setValue } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'footer.approvals'
  })
  
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValues, setEditValues] = useState({
    name: '',
    role: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  const handleAddApproval = () => {
    append({
      name: '',
      role: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditIndex(fields.length)
    setEditValues({
      name: '',
      role: '',
      date: new Date().toISOString().split('T')[0]
    })
  }
  
  const handleEditApproval = (index: number) => {
    setEditValues(getValues(`footer.approvals.${index}`))
    setEditIndex(index)
  }
  
  const handleSaveApproval = () => {
    if (editIndex !== null) {
      update(editIndex, editValues)
      setEditIndex(null)
    }
  }
  
  const handleCancelEdit = () => {
    setEditIndex(null)
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Footer Information</h2>
      
      <div className="space-y-6">
        <div className="form-group">
          <label htmlFor="notes" className="label">Notes</label>
          <textarea
            id="notes"
            className="input"
            rows={3}
            placeholder="Additional notes about the instruction"
            {...register('footer.notes')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="references" className="label">References</label>
          <textarea
            id="references"
            className="input"
            rows={2}
            placeholder="Reference documents, standards, etc."
            {...register('footer.references')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactInformation" className="label">Contact Information</label>
          <textarea
            id="contactInformation"
            className="input"
            rows={2}
            placeholder="Contact information for questions or feedback"
            {...register('footer.contactInformation')}
          />
        </div>
        
        <div className="form-group">
          <div className="flex justify-between items-center mb-4">
            <label className="label mb-0">Approvals</label>
            <button
              type="button"
              onClick={handleAddApproval}
              className="btn btn-primary flex items-center text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Approval
            </button>
          </div>
          
          {fields.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No approvals added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 ${
                    editIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {editIndex === index ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="label text-xs">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editValues.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="label text-xs">Role</label>
                          <input
                            type="text"
                            name="role"
                            value={editValues.role}
                            onChange={handleChange}
                            className="input"
                            placeholder="Engineer"
                          />
                        </div>
                        <div>
                          <label className="label text-xs">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={editValues.date}
                            onChange={handleChange}
                            className="input"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="btn btn-secondary text-sm py-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveApproval}
                          className="btn btn-primary text-sm py-1"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{getValues(`footer.approvals.${index}.name`)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getValues(`footer.approvals.${index}.role`)} • {getValues(`footer.approvals.${index}.date`)}
                        </div>
                        <input type="hidden" {...register(`footer.approvals.${index}.name`)} />
                        <input type="hidden" {...register(`footer.approvals.${index}.role`)} />
                        <input type="hidden" {...register(`footer.approvals.${index}.date`)} />
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditApproval(index)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}