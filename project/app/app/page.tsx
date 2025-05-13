'use client'

import { motion } from 'framer-motion'
import { ArrowRight, FileText, Layers, GitCompare, FileOutput } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

export default function Home() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950"
          style={{ zIndex: -1 }}
        />
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
              Instruction Editor
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Create, edit, and manage technical instructions with ease. Generate HTML and PDF outputs from a single source of truth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor" className="btn btn-primary px-8 py-3 text-lg">
                Start Editing <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link href="/revisions" className="btn btn-secondary px-8 py-3 text-lg">
                View Revisions <Layers className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <motion.div
            ref={ref1}
            initial={{ opacity: 0, y: 20 }}
            animate={inView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to create and manage technical instructions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              ref={ref2}
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Editing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Edit headers, parts, steps, and more with a user-friendly interface
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
                <FileOutput className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Output Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate HTML and PDF outputs from a single source of truth
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-4">
                <Layers className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Revision Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of all changes with automatic revision history
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mb-4">
                <GitCompare className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diff Comparison</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily compare different revisions to see what changed
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <motion.div
            ref={ref3}
            initial={{ opacity: 0, y: 20 }}
            animate={inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A simple workflow for creating and managing instructions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the instruction form with headers, parts, steps, and more
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Validate & Save</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The system validates your input against a JSON schema and saves a new revision
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Output</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate HTML and PDF outputs with a single click
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-blue-600 dark:bg-blue-900 text-white">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl text-center">
          <motion.div
            ref={ref4}
            initial={{ opacity: 0, y: 20 }}
            animate={inView4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">
              Create your first instruction document now
            </p>
            <Link href="/editor" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Editing <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}