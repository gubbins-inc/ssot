'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, FileText, Eye, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { instructionSchema } from '@/lib/schema'
import HeaderForm from '@/components/editor/header-form'
import PartsForm from '@/components/editor/parts-form'
import StepsForm from '@/components/editor/steps-form'
import FooterForm from '@/components/editor/footer-form'
import ChangeLogForm from '@/components/editor/changelog-form'
import JsonPreview from '@/components/editor/json-preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

type FormValues = z.infer<typeof instructionSchema>

export default function EditInstructionPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [activeTab, setActiveTab] = useState('header')
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [instruction, setInstruction] = useState<any>(null)

  const methods = useForm<FormValues>({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      header: {
        title: '',
        documentNumber: '',
        revision: 'A',
        date: new Date().toISOString().split('T')[0],
        author: '',
        department: '',
        category: '',
        tags: []
      },
      parts: [],
      steps: [],
      footer: {
        approvals: [],
        notes: '',
        references: '',
        contactInformation: ''
      },
      changeLog: [{
        revision: 'A',
        date: new Date().toISOString().split('T')[0],
        author: '',
        description: 'Initial release',
        approvedBy: '',
        sections: ['All']
      }]
    }
  })

  const { handleSubmit, formState: { errors, isSubmitting }, reset } = methods

  useEffect(() => {
    const fetchInstruction = async () => {
      try {
        const response = await fetch(`/api/instructions/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch instruction')
        }
        const data = await response.json()
        setInstruction(data)
        
        // Get the latest revision
        if (data.revisions && data.revisions.length > 0) {
          const latestRevision = data.revisions[0]
          const content = JSON.parse(latestRevision.jsonContent)
          
          // Reset the form with the fetched data
          reset(content)
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
  }, [id, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`/api/instructions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update instruction')
      }

      const result = await response.json()
      toast.success('Instruction updated successfully!')
      router.push(`/revisions/${result.id}`)
    } catch (error) {
      console.error('Error updating instruction:', error)
      toast.error('Failed to update instruction')
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <Link href={`/revisions/${id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Instruction
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Instruction</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update the instruction document with the form below
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="header" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Header
                    </TabsTrigger>
                    <TabsTrigger value="parts">Parts</TabsTrigger>
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger value="changelog">Change Log</TabsTrigger>
                  </TabsList>

                  <TabsContent value="header">
                    <HeaderForm />
                  </TabsContent>

                  <TabsContent value="parts">
                    <PartsForm />
                  </TabsContent>

                  <TabsContent value="steps">
                    <StepsForm />
                  </TabsContent>

                  <TabsContent value="footer">
                    <FooterForm />
                  </TabsContent>

                  <TabsContent value="changelog">
                    <ChangeLogForm />
                  </TabsContent>
                </Tabs>
              </div>

              {hasErrors && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-800 dark:text-red-300"
                >
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <h3 className="font-semibold">Validation Errors</h3>
                  </div>
                  <p>Please fix the errors before submitting the form.</p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-secondary flex items-center justify-center"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center justify-center"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'Saving...' : 'Validate & Save'}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                JSON Preview
              </h2>
              <JsonPreview />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}