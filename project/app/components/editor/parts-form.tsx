'use client'

import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'

export default function PartsForm() {
  const { control, register, formState: { errors }, getValues, setValue } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'parts'
  })
  
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValues, setEditValues] = useState({
    partNumber: '',
    description: '',
    quantity: 1,
    unit: '',
    reference: '',
    notes: '',
    imageUri: ''
  })
  
  const handleAddPart = () => {
    append({
      partNumber: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      reference: '',
      notes: '',
      imageUri: ''
    })
    setEditIndex(fields.length)
    setEditValues({
      partNumber: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      reference: '',
      notes: '',
      imageUri: ''
    })
  }
  
  const handleEditPart = (index: number) => {
    setEditValues(getValues(`parts.${index}`))
    setEditIndex(index)
  }
  
  const handleSavePart = () => {
    if (editIndex !== null) {
      // Ensure quantity is a number before updating
      const updatedValues = {
        ...editValues,
        quantity: Number(editValues.quantity)
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
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Parts List</h2>
        <button
          type="button"
          onClick={handleAddPart}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Part
        </button>
      </div>
      
      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No parts added yet. Click "Add Part" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {fields.map((field, index) => (
                <tr key={field.id} className={editIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                  {editIndex === index ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="partNumber"
                          value={editValues.partNumber}
                          onChange={handleChange}
                          className="input"
                          placeholder="P-001"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="description"
                          value={editValues.description}
                          onChange={handleChange}
                          className="input"
                          placeholder="Part description"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="quantity"
                          value={editValues.quantity}
                          onChange={handleChange}
                          className="input"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="unit"
                          value={editValues.unit}
                          onChange={handleChange}
                          className="input"
                          placeholder="pcs"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            type="button"
                            onClick={handleSavePart}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {getValues(`parts.${index}.partNumber`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {getValues(`parts.${index}.description`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {getValues(`parts.${index}.quantity`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {getValues(`parts.${index}.unit`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleEditPart(index)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                      
                      <input type="hidden" {...register(`parts.${index}.partNumber`)} />
                      <input type="hidden" {...register(`parts.${index}.description`)} />
                      <input type="hidden" {...register(`parts.${index}.quantity`)} />
                      <input type="hidden" {...register(`parts.${index}.unit`)} />
                      <input type="hidden" {...register(`parts.${index}.reference`)} />
                      <input type="hidden" {...register(`parts.${index}.notes`)} />
                      <input type="hidden" {...register(`parts.${index}.imageUri`)} />
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {editIndex !== null && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Reference</label>
              <input
                type="text"
                name="reference"
                value={editValues.reference}
                onChange={handleChange}
                className="input"
                placeholder="DWG-001-Rev1"
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
                placeholder="https://example.com/images/part.jpg"
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="label">Notes</label>
              <textarea
                name="notes"
                value={editValues.notes}
                onChange={handleChange}
                className="input"
                rows={2}
                placeholder="Additional notes about the part"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}