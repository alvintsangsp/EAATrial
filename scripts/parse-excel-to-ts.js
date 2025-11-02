const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Read the Excel file
const excelPath = path.join(__dirname, '../src/assets/EAA_Questions_Set_v2.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON with proper headers
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${data.length} questions in the Excel file`);

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
  }${index < data.length - 1 ? ',' : ''}
`;
});

fileContent += `];

export const getRandomQuestions = (count: number = 20): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};
`;

// Write to questions.ts
const outputPath = path.join(__dirname, '../src/data/questions.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`✅ Successfully generated ${data.length} questions!`);
console.log(`📝 File: ${outputPath}`);
