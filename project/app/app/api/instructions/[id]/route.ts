import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { instructionSchema } from '@/lib/schema'

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const instruction = await prisma.instruction.findUnique({
      where: { id },
      include: {
        revisions: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })
    
    if (!instruction) {
      return NextResponse.json(
        { error: 'Instruction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(instruction)
  } catch (error) {
    console.error('Error fetching instruction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instruction' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Validate the request body against the schema
    const validatedData = instructionSchema.parse(body)
    
    // Extract data
    const { header, parts, steps, footer, changeLog } = validatedData
    
    // Get the current instruction
    const currentInstruction = await prisma.instruction.findUnique({
      where: { id },
      include: {
        parts: true,
        steps: {
          include: {
            partsUsed: true
          }
        },
        approvals: true
      }
    })
    
    if (!currentInstruction) {
      return NextResponse.json(
        { error: 'Instruction not found' },
        { status: 404 }
      )
    }
    
    // Update the instruction
    const updatedInstruction = await prisma.instruction.update({
      where: { id },
      data: {
        title: header.title,
        documentNumber: header.documentNumber,
        revision: header.revision,
        date: new Date(header.date),
        author: header.author,
        department: header.department,
        category: header.category,
        tags: header.tags,
        notes: footer.notes,
        references: footer.references,
        contactInformation: footer.contactInformation
      }
    })
    
    // Delete existing parts, steps, and approvals
    await prisma.part.deleteMany({
      where: { instructionId: id }
    })
    
    await prisma.step.deleteMany({
      where: { instructionId: id }
    })
    
    await prisma.approval.deleteMany({
      where: { instructionId: id }
    })
    
    // Create new parts
    const createdParts = await Promise.all(
      parts.map(part => 
        prisma.part.create({
          data: {
            instructionId: id,
            partNumber: part.partNumber,
            description: part.description,
            quantity: part.quantity,
            unit: part.unit,
            reference: part.reference,
            notes: part.notes,
            imageUri: part.imageUri
          }
        })
      )
    )
    
    // Create new steps
    const createdSteps = await Promise.all(
      steps.map(step => 
        prisma.step.create({
          data: {
            instructionId: id,
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            duration: step.duration,
            warnings: step.warnings,
            tools: step.tools,
            imageUri: step.imageUri
          }
        })
      )
    )
    
    // Create new approvals
    await Promise.all(
      footer.approvals.map(approval => 
        prisma.approval.create({
          data: {
            instructionId: id,
            name: approval.name,
            role: approval.role,
            date: new Date(approval.date)
          }
        })
      )
    )
    
    // Create step-part relationships
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const createdStep = createdSteps[i]
      
      if (step.partsUsed.length > 0) {
        for (const partNumber of step.partsUsed) {
          const part = createdParts.find(p => p.partNumber === partNumber)
          
          if (part) {
            await prisma.stepPart.create({
              data: {
                stepId: createdStep.id,
                partId: part.id
              }
            })
          }
        }
      }
    }
    
    // Create a new revision
    const latestChangeLog = changeLog[0]
    const newRevision = await prisma.revision.create({
      data: {
        instructionId: id,
        revision: header.revision,
        date: new Date(header.date),
        author: header.author,
        description: latestChangeLog.description,
        approvedBy: latestChangeLog.approvedBy,
        sections: latestChangeLog.sections,
        jsonContent: JSON.stringify(validatedData)
      }
    })
    
    return NextResponse.json({
      ...updatedInstruction,
      revision: newRevision
    })
  } catch (error) {
    console.error('Error updating instruction:', error)
    return NextResponse.json(
      { error: 'Failed to update instruction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Check if the instruction exists
    const instruction = await prisma.instruction.findUnique({
      where: { id }
    })
    
    if (!instruction) {
      return NextResponse.json(
        { error: 'Instruction not found' },
        { status: 404 }
      )
    }
    
    // Delete the instruction (cascade will delete related records)
    await prisma.instruction.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting instruction:', error)
    return NextResponse.json(
      { error: 'Failed to delete instruction' },
      { status: 500 }
    )
  }
}