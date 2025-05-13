import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { instructionSchema } from '@/lib/schema'

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const instructions = await prisma.instruction.findMany({
      select: {
        id: true,
        title: true,
        documentNumber: true,
        revision: true,
        date: true,
        author: true,
        department: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            revisions: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform the data to include revisionCount
    const formattedInstructions = instructions.map(instruction => ({
      id: instruction.id,
      title: instruction.title,
      documentNumber: instruction.documentNumber,
      revision: instruction.revision,
      date: instruction.date,
      author: instruction.author,
      department: instruction.department,
      category: instruction.category,
      tags: instruction.tags,
      createdAt: instruction.createdAt,
      updatedAt: instruction.updatedAt,
      revisionCount: instruction._count.revisions
    }))

    return NextResponse.json(formattedInstructions)
  } catch (error) {
    console.error('Error fetching instructions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body against the schema
    let validatedData;
    try {
      validatedData = instructionSchema.parse(body);
    } catch (validationError: any) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationError.errors || validationError.message
        },
        { status: 400 }
      );
    }
    
    // Extract header data
    const { header, parts, steps, footer, changeLog } = validatedData
    
    // Create the instruction
    const instruction = await prisma.instruction.create({
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
        contactInformation: footer.contactInformation,
        
        // Create parts
        parts: {
          create: parts.map(part => ({
            partNumber: part.partNumber,
            description: part.description,
            quantity: part.quantity,
            unit: part.unit,
            reference: part.reference,
            notes: part.notes,
            imageUri: part.imageUri
          }))
        },
        
        // Create steps
        steps: {
          create: steps.map(step => ({
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            duration: step.duration,
            warnings: step.warnings,
            tools: step.tools,
            imageUri: step.imageUri
          }))
        },
        
        // Create approvals
        approvals: {
          create: footer.approvals.map(approval => ({
            name: approval.name,
            role: approval.role,
            date: new Date(approval.date)
          }))
        },
        
        // Create the initial revision
        revisions: {
          create: {
            revision: header.revision,
            date: new Date(header.date),
            author: header.author,
            description: changeLog[0].description,
            approvedBy: changeLog[0].approvedBy,
            sections: changeLog[0].sections,
            jsonContent: JSON.stringify(validatedData)
          }
        }
      }
    })
    
    // Create step-part relationships
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const createdStep = await prisma.step.findFirst({
        where: {
          instructionId: instruction.id,
          stepNumber: step.stepNumber
        }
      })
      
      if (createdStep && step.partsUsed.length > 0) {
        for (const partNumber of step.partsUsed) {
          const part = await prisma.part.findFirst({
            where: {
              instructionId: instruction.id,
              partNumber: partNumber
            }
          })
          
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
    
    return NextResponse.json(instruction)
  } catch (error) {
    console.error('Error creating instruction:', error)
    return NextResponse.json(
      { error: 'Failed to create instruction' },
      { status: 500 }
    )
  }
}