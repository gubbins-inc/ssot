'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Clock, FileText, Search, Layers } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Instruction {
  id: string
  title: string
  documentNumber: string
  revision: string
  date: string
  author: string
  department: string
  category: string
  updatedAt: string
  revisionCount: number
}

export default function RevisionsPage() {
  const router = useRouter()
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch('/api/instructions')
        if (!response.ok) {
          throw new Error('Failed to fetch instructions')
        }
        const data = await response.json()
        setInstructions(data)
      } catch (error) {
        console.error('Error fetching instructions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructions()
  }, [])

  const filteredInstructions = instructions.filter(instruction => 
    instruction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instruction.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instruction.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instruction.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instruction.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Instruction Revisions</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage all instruction documents and their revisions
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search instructions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/editor" className="btn btn-primary whitespace-nowrap">
            Create New Instruction
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredInstructions.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Instructions Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'No instructions match your search criteria.' : 'You haven\'t created any instructions yet.'}
            </p>
            <Link href="/editor" className="btn btn-primary">
              Create Your First Instruction
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Revisions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredInstructions.map((instruction, index) => (
                  <motion.tr
                    key={instruction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/revisions/${instruction.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {instruction.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {instruction.documentNumber} (Rev. {instruction.revision})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{instruction.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{instruction.department}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{instruction.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(instruction.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {instruction.revisionCount} {instruction.revisionCount === 1 ? 'revision' : 'revisions'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}