const fs = require('fs');
const path = require('path');

// Read the parsed document
const parsedDocPath = path.join(__dirname, '../tool-results/document--parse_document/20251102-155251-153096');
let content;
try {
  content = fs.readFileSync(parsedDocPath, 'utf-8');
} catch (e) {
  console.log('Reading from alternative path...');
  // Try reading the Excel file directly
  const XLSX = require('xlsx');
  const excelPath = path.join(__dirname, '../src/assets/EAA_Questions_Set_v2.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`Found ${data.length} questions in Excel file`);
  
  // Escape special characters for TypeScript
  const escapeString = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  };
  
  // Build the TypeScript file content
  let fileContent = `export interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correctAnswer: string;
  explanation: string;
}

export const questions: Question[] = [
`;
  
  // Process each question
  let validCount = 0;
  data.forEach((row, index) => {
    const id = row['題號'] || row['题号'] || (index + 1);
    const question = row['問題'] || row['问题'] || '';
    const optionA = row['選項A'] || row['选项A'] || '';
    const optionB = row['選項B'] || row['选项B'] || '';
    const optionC = row['選項C'] || row['选项C'] || '';
    const optionD = row['選項D'] || row['选项D'] || '';
    const optionE = row['選項E'] || row['选项E'] || '';
    const correctAnswer = row['正確答案'] || row['正确答案'] || '';
    const explanation = row['解釋'] || row['解释'] || '';

    // Skip empty rows
    if (!question) return;

    fileContent += `  {
    id: ${id},
    question: "${escapeString(question)}",
    optionA: "${escapeString(optionA)}",
    optionB: "${escapeString(optionB)}",
    optionC: "${escapeString(optionC)}",
    optionD: "${escapeString(optionD)}",`;

    if (optionE) {
      fileContent += `\n    optionE: "${escapeString(optionE)}",`;
    }

    fileContent += `
    correctAnswer: "${String(correctAnswer).trim()}",
    explanation: "${escapeString(explanation)}"
  },
`;
    validCount++;
  });

  // Remove trailing comma
  fileContent = fileContent.replace(/,\n$/, '\n');

  fileContent += `];

export const getRandomQuestions = (count: number = 20): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};
`;

  // Write to questions.ts
  const outputPath = path.join(__dirname, '../src/data/questions.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');

  console.log(`✅ Successfully generated ${validCount} questions!`);
  console.log(`📝 File: ${outputPath}`);
  process.exit(0);
}

// Parse markdown table format from parsed document
console.log('Parsing markdown table format...');
const lines = content.split('\n');
const questions = [];

let inTable = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Check if this is a table row (starts with |)
  if (line.startsWith('|') && !line.includes('|題號|問題|') && !line.includes('|-|-|')) {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    
    // Must have at least 8 parts (id, question, A, B, C, D, E, answer, explanation)
    if (parts.length >= 8 && /^\d+$/.test(parts[0])) {
      questions.push({
        id: parseInt(parts[0]),
        question: parts[1],
        optionA: parts[2],
        optionB: parts[3],
        optionC: parts[4],
        optionD: parts[5],
        optionE: parts[6],
        correctAnswer: parts[7],
        explanation: parts[8] || ''
      });
    }
  }
}

console.log(`Extracted ${questions.length} questions from parsed document`);

// Escape special characters for TypeScript
const escapeString = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

// Build the TypeScript file content
let fileContent = `export interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correctAnswer: string;
  explanation: string;
}

export const questions: Question[] = [
`;

// Process each question
questions.forEach((q, index) => {
  fileContent += `  {
    id: ${q.id},
    question: "${escapeString(q.question)}",
    optionA: "${escapeString(q.optionA)}",
    optionB: "${escapeString(q.optionB)}",
    optionC: "${escapeString(q.optionC)}",
    optionD: "${escapeString(q.optionD)}",`;

  if (q.optionE && q.optionE.trim()) {
    fileContent += `\n    optionE: "${escapeString(q.optionE)}",`;
  }

  fileContent += `
    correctAnswer: "${escapeString(q.correctAnswer)}",
    explanation: "${escapeString(q.explanation)}"
  },
`;
});

// Remove trailing comma
fileContent = fileContent.replace(/,\n$/, '\n');

fileContent += `];

export const getRandomQuestions = (count: number = 20): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};
`;

// Write to questions.ts
const outputPath = path.join(__dirname, '../src/data/questions.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`✅ Successfully generated ${questions.length} questions!`);
console.log(`📝 File: ${outputPath}`);
