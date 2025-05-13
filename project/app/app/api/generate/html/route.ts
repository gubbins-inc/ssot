import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateHtml } from '@/lib/utils'

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instructionId, revisionId } = body
    
    if (!instructionId || !revisionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    // Get the revision
    const revision = await prisma.revision.findUnique({
      where: { id: revisionId }
    })
    
    if (!revision) {
      return NextResponse.json(
        { error: 'Revision not found' },
        { status: 404 }
      )
    }
    
    // Parse the JSON content
    let content;
    try {
      content = JSON.parse(revision.jsonContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON content' },
        { status: 400 }
      );
    }
    
    // Generate HTML
    const html = generateHtml(content)
    
    // Return the HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="instruction_${instructionId}_rev${revision.revision}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating HTML:', error)
    return NextResponse.json(
      { error: 'Failed to generate HTML' },
      { status: 500 }
    )
  }
}