// This file provides access to the sample data from the data folder

// Sample instruction data
export const sampleInstruction = {
  "header": {
    "title": "Sample Instruction",
    "documentNumber": "INS-001",
    "revision": "A",
    "date": "2023-06-15",
    "author": "John Doe",
    "department": "Engineering",
    "category": "Assembly",
    "tags": ["assembly", "manufacturing", "quality"]
  },
  "parts": [
    {
      "partNumber": "P-10045",
      "description": "Main Frame Assembly",
      "quantity": 1,
      "unit": "pcs",
      "reference": "DWG-10045-Rev2",
      "notes": "Handle with care, painted surface",
      "imageUri": "https://example.com/images/parts/P-10045.jpg"
    },
    {
      "partNumber": "P-10046",
      "description": "Control Panel",
      "quantity": 1,
      "unit": "pcs",
      "reference": "DWG-10046-Rev1",
      "notes": "ESD sensitive component",
      "imageUri": "https://example.com/images/parts/P-10046.jpg"
    },
    {
      "partNumber": "P-10047",
      "description": "Mounting Bracket",
      "quantity": 4,
      "unit": "pcs",
      "reference": "DWG-10047-Rev1",
      "notes": "",
      "imageUri": "https://example.com/images/parts/P-10047.jpg"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Prepare the Main Frame",
      "description": "Remove the Main Frame Assembly from packaging and place on a clean, flat surface. Ensure all protective coverings are removed.",
      "duration": 5,
      "warnings": ["Wear gloves to avoid fingerprints on painted surfaces", "Inspect for shipping damage before proceeding"],
      "tools": ["Scissors", "Gloves"],
      "partsUsed": ["P-10045"],
      "imageUri": "https://example.com/images/steps/step1.jpg"
    },
    {
      "stepNumber": 2,
      "title": "Attach Mounting Brackets",
      "description": "Attach the four mounting brackets to the designated positions on the main frame. Use the provided M6 bolts and torque to 8-10 Nm.",
      "duration": 10,
      "warnings": ["Ensure brackets are oriented correctly according to the diagram"],
      "tools": ["10mm Socket Wrench", "Torque Wrench"],
      "partsUsed": ["P-10047"],
      "imageUri": "https://example.com/images/steps/step2.jpg"
    },
    {
      "stepNumber": 3,
      "title": "Install Control Panel",
      "description": "Carefully position the control panel on the main frame. Align the mounting holes and secure with the provided M4 screws.",
      "duration": 15,
      "warnings": ["ESD protection required", "Do not overtighten screws"],
      "tools": ["Phillips Screwdriver", "ESD Wrist Strap"],
      "partsUsed": ["P-10046"],
      "imageUri": "https://example.com/images/steps/step3.jpg"
    }
  ],
  "footer": {
    "approvals": [
      {
        "name": "Jane Smith",
        "role": "Engineering Manager",
        "date": "2023-06-10"
      },
      {
        "name": "Robert Johnson",
        "role": "Quality Assurance",
        "date": "2023-06-12"
      }
    ],
    "notes": "This instruction is for trained personnel only. Follow all safety protocols.",
    "references": "Assembly Drawing: DWG-20001-Rev1, Quality Standard: QS-001",
    "contactInformation": "For questions, contact engineering@example.com or call ext. 5555"
  },
  "changeLog": [
    {
      "revision": "A",
      "date": "2023-06-15",
      "author": "John Doe",
      "description": "Initial release",
      "approvedBy": "Robert Johnson",
      "sections": ["All"]
    }
  ]
};

// Schema information
export const schemaInfo = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Instruction Document",
  "description": "Schema for manufacturing instruction documents",
  "type": "object",
  "required": ["header", "parts", "steps", "footer", "changeLog"],
  "properties": {
    "header": {
      "type": "object",
      "required": ["title", "documentNumber", "revision", "date", "author", "department", "category", "tags"],
      "properties": {
        "title": { "type": "string" },
        "documentNumber": { "type": "string" },
        "revision": { "type": "string" },
        "date": { "type": "string", "format": "date" },
        "author": { "type": "string" },
        "department": { "type": "string" },
        "category": { "type": "string" },
        "tags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "parts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["partNumber", "description", "quantity", "unit"],
        "properties": {
          "partNumber": { "type": "string" },
          "description": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 },
          "unit": { "type": "string" },
          "reference": { "type": "string" },
          "notes": { "type": "string" },
          "imageUri": { "type": "string", "format": "uri" }
        }
      }
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["stepNumber", "title", "description", "warnings", "tools", "partsUsed"],
        "properties": {
          "stepNumber": { "type": "integer", "minimum": 1 },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "duration": { "type": "integer", "minimum": 0 },
          "warnings": { "type": "array", "items": { "type": "string" } },
          "tools": { "type": "array", "items": { "type": "string" } },
          "partsUsed": { "type": "array", "items": { "type": "string" } },
          "imageUri": { "type": "string", "format": "uri" }
        }
      }
    },
    "footer": {
      "type": "object",
      "required": ["approvals"],
      "properties": {
        "approvals": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "role", "date"],
            "properties": {
              "name": { "type": "string" },
              "role": { "type": "string" },
              "date": { "type": "string", "format": "date" }
            }
          }
        },
        "notes": { "type": "string" },
        "references": { "type": "string" },
        "contactInformation": { "type": "string" }
      }
    },
    "changeLog": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["revision", "date", "author", "description", "sections"],
        "properties": {
          "revision": { "type": "string" },
          "date": { "type": "string", "format": "date" },
          "author": { "type": "string" },
          "description": { "type": "string" },
          "approvedBy": { "type": "string" },
          "sections": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  }
};