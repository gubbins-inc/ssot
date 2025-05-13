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
    
    // In a real application, we would use a PDF generation library like puppeteer or wkhtmltopdf
    // For this demo, we'll just return the HTML with a note
    const pdfPlaceholder = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PDF Generation Placeholder</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .note { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 10px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="note">
          <h2>PDF Generation Note</h2>
          <p>In a production environment, this would generate a PDF using a library like puppeteer or wkhtmltopdf.</p>
          <p>For this demo, we're returning the HTML that would be converted to PDF.</p>
        </div>
        ${html}
      </body>
      </html>
    `;
    
    // Return the PDF placeholder
    return new NextResponse(pdfPlaceholder, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="instruction_${instructionId}_rev${revision.revision}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}