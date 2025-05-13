import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateHtml(instruction: any): string {
  // This is a simplified HTML generation function
  // In a real application, you would use a more sophisticated template engine
  
  const header = instruction.header || {};
  const parts = instruction.parts || [];
  const steps = instruction.steps || [];
  const footer = instruction.footer || {};
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${header.title || 'Instruction'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { margin-bottom: 20px; }
        .parts-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .parts-table th, .parts-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .step { margin-bottom: 15px; padding: 10px; border: 1px solid #eee; }
        .footer { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${header.title || ''}</h1>
        <p>Document: ${header.documentNumber || ''} | Revision: ${header.revision || ''}</p>
        <p>Date: ${header.date || ''} | Author: ${header.author || ''}</p>
        <p>Department: ${header.department || ''} | Category: ${header.category || ''}</p>
        <p>Tags: ${(header.tags || []).join(', ')}</p>
      </div>
      
      <h2>Parts List</h2>
      <table class="parts-table">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Reference</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${parts.map((part: any) => `
            <tr>
              <td>${part.partNumber || ''}</td>
              <td>${part.description || ''}</td>
              <td>${part.quantity || ''}</td>
              <td>${part.unit || ''}</td>
              <td>${part.reference || ''}</td>
              <td>${part.notes || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h2>Assembly Steps</h2>
      ${steps.map((step: any) => `
        <div class="step">
          <h3>Step ${step.stepNumber}: ${step.title || ''}</h3>
          <p>${step.description || ''}</p>
          ${step.duration ? `<p>Estimated time: ${step.duration} minutes</p>` : ''}
          
          ${step.warnings && step.warnings.length > 0 ? `
            <div class="warnings">
              <h4>Warnings:</h4>
              <ul>
                ${step.warnings.map((warning: string) => `<li>${warning}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${step.tools && step.tools.length > 0 ? `
            <div class="tools">
              <h4>Tools:</h4>
              <ul>
                ${step.tools.map((tool: string) => `<li>${tool}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${step.partsUsed && step.partsUsed.length > 0 ? `
            <div class="parts-used">
              <h4>Parts Used:</h4>
              <ul>
                ${step.partsUsed.map((partId: string) => `<li>${partId}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${step.imageUri ? `<img src="${step.imageUri}" alt="Step ${step.stepNumber}" style="max-width: 100%;">` : ''}
        </div>
      `).join('')}
      
      <div class="footer">
        ${footer.approvals && footer.approvals.length > 0 ? `
          <h3>Approvals</h3>
          <ul>
            ${footer.approvals.map((approval: any) => `
              <li>${approval.name} (${approval.role}) - ${approval.date}</li>
            `).join('')}
          </ul>
        ` : ''}
        
        ${footer.notes ? `<h3>Notes</h3><p>${footer.notes}</p>` : ''}
        ${footer.references ? `<h3>References</h3><p>${footer.references}</p>` : ''}
        ${footer.contactInformation ? `<h3>Contact Information</h3><p>${footer.contactInformation}</p>` : ''}
      </div>
    </body>
    </html>
  `;
  
  return html;
}

// Replace deep-object-diff with a simple implementation
export function calculateDiff(oldJson: any, newJson: any) {
  const diff: Record<string, any> = {};
  
  // Helper function to compare objects
  const compareObjects = (oldObj: any, newObj: any, path: string = '') => {
    // Handle arrays
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      if (oldObj.length !== newObj.length) {
        diff[path] = { old: oldObj, new: newObj };
        return;
      }
      
      for (let i = 0; i < newObj.length; i++) {
        compareObjects(oldObj[i], newObj[i], path ? `${path}[${i}]` : `[${i}]`);
      }
      return;
    }
    
    // Handle objects
    if (typeof oldObj === 'object' && oldObj !== null && 
        typeof newObj === 'object' && newObj !== null) {
      
      // Get all keys from both objects
      const oldKeys = Object.keys(oldObj);
      const newKeys = Object.keys(newObj);
      const allKeys = Array.from(new Set([...oldKeys, ...newKeys]));
      
      for (const key of allKeys) {
        const oldValue = oldObj[key];
        const newValue = newObj[key];
        
        // If key exists in both objects
        if (key in oldObj && key in newObj) {
          const newPath = path ? `${path}.${key}` : key;
          
          // If values are different types
          if (typeof oldValue !== typeof newValue) {
            diff[newPath] = { old: oldValue, new: newValue };
            continue;
          }
          
          // If values are objects, recurse
          if (typeof oldValue === 'object' && oldValue !== null &&
              typeof newValue === 'object' && newValue !== null) {
            compareObjects(oldValue, newValue, newPath);
            continue;
          }
          
          // If primitive values are different
          if (oldValue !== newValue) {
            diff[newPath] = { old: oldValue, new: newValue };
          }
        } 
        // If key only exists in old object
        else if (key in oldObj) {
          const newPath = path ? `${path}.${key}` : key;
          diff[newPath] = { old: oldValue, new: undefined };
        } 
        // If key only exists in new object
        else {
          const newPath = path ? `${path}.${key}` : key;
          diff[newPath] = { old: undefined, new: newValue };
        }
      }
      return;
    }
    
    // Handle primitive values
    if (oldObj !== newObj) {
      diff[path] = { old: oldObj, new: newObj };
    }
  };
  
  compareObjects(oldJson, newJson);
  return diff;
}