import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateDiff } from '@/lib/utils'

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { oldRevisionId, newRevisionId } = body
    
    if (!oldRevisionId || !newRevisionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    // Get the revisions
    const oldRevision = await prisma.revision.findUnique({
      where: { id: oldRevisionId }
    })
    
    const newRevision = await prisma.revision.findUnique({
      where: { id: newRevisionId }
    })
    
    if (!oldRevision || !newRevision) {
      return NextResponse.json(
        { error: 'One or both revisions not found' },
        { status: 404 }
      )
    }
    
    // Parse the JSON content
    let oldContent;
    let newContent;
    
    try {
      oldContent = JSON.parse(oldRevision.jsonContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON content in old revision' },
        { status: 400 }
      );
    }
    
    try {
      newContent = JSON.parse(newRevision.jsonContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON content in new revision' },
        { status: 400 }
      );
    }
    
    // Calculate the diff
    const diff = calculateDiff(oldContent, newContent)
    
    return NextResponse.json({
      oldRevision: {
        id: oldRevision.id,
        revision: oldRevision.revision,
        date: oldRevision.date,
        author: oldRevision.author
      },
      newRevision: {
        id: newRevision.id,
        revision: newRevision.revision,
        date: newRevision.date,
        author: newRevision.author
      },
      diff
    })
  } catch (error) {
    console.error('Error calculating diff:', error)
    return NextResponse.json(
      { error: 'Failed to calculate diff' },
      { status: 500 }
    )
  }
}