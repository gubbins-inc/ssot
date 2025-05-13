'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, Plus } from 'lucide-react'

export default function HeaderForm() {
  const { register, formState: { errors }, watch, setValue } = useFormContext()
  const [newTag, setNewTag] = useState('')
  const tags = watch('header.tags') || []

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('header.tags', [...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('header.tags', tags.filter((tag: string) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Header Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title"
            type="text"
            className="input"
            placeholder="Instruction title"
            {...register('header.title')}
          />
          {errors.header && 'title' in errors.header && (
            <p className="form-error">{String(errors.header.title?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="documentNumber" className="label">Document Number</label>
          <input
            id="documentNumber"
            type="text"
            className="input"
            placeholder="INS-001"
            {...register('header.documentNumber')}
          />
          {errors.header && 'documentNumber' in errors.header && (
            <p className="form-error">{String(errors.header.documentNumber?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="revision" className="label">Revision</label>
          <input
            id="revision"
            type="text"
            className="input"
            placeholder="A"
            {...register('header.revision')}
          />
          {errors.header && 'revision' in errors.header && (
            <p className="form-error">{String(errors.header.revision?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="date" className="label">Date</label>
          <input
            id="date"
            type="date"
            className="input"
            {...register('header.date')}
          />
          {errors.header && 'date' in errors.header && (
            <p className="form-error">{String(errors.header.date?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="author" className="label">Author</label>
          <input
            id="author"
            type="text"
            className="input"
            placeholder="John Doe"
            {...register('header.author')}
          />
          {errors.header && 'author' in errors.header && (
            <p className="form-error">{String(errors.header.author?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="department" className="label">Department</label>
          <input
            id="department"
            type="text"
            className="input"
            placeholder="Engineering"
            {...register('header.department')}
          />
          {errors.header && 'department' in errors.header && (
            <p className="form-error">{String(errors.header.department?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="label">Category</label>
          <input
            id="category"
            type="text"
            className="input"
            placeholder="Assembly"
            {...register('header.category')}
          />
          {errors.header && 'category' in errors.header && (
            <p className="form-error">{String(errors.header.category?.message)}</p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="tags" className="label">Tags</label>
          <div className="flex">
            <input
              id="tags"
              type="text"
              className="input rounded-r-none"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full flex items-center"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          {errors.header && 'tags' in errors.header && (
            <p className="form-error">{String(errors.header.tags?.message)}</p>
          )}
        </div>
      </div>
    </div>
  )
}