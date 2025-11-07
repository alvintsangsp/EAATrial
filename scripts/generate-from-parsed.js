// This file will be used to generate questions.ts from the parsed Excel data

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

console.log('Starting question generation from Excel file...');

try {
  // Read the Excel file
  const excelPath = path.join(__dirname, '../src/assets/EAA_Questions_Set_v2.xlsx');
  console.log(`Reading Excel file from: ${excelPath}`);
  
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`Found ${data.length} rows in Excel file`);
  
  // Helper function to escape strings for TypeScript
  const escapeString = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  };
  
  // Build the TypeScript content
  let tsContent = `export interface Question {
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

export const questions: Question[] = [\n`;
  
  let questionCount = 0;
  
  // Process each row (limit to first 100 questions)
  data.slice(0, 100).forEach((row, index) => {
    // Try different possible column names
    const id = row['題號'] || row['题号'] || row['ID'] || (index + 1);
    const question = row['問題'] || row['问题'] || row['Question'] || '';
    const optionA = row['選項A'] || row['选项A'] || row['Option A'] || '';
    const optionB = row['選項B'] || row['选项B'] || row['Option B'] || '';
    const optionC = row['選項C'] || row['选项C'] || row['Option C'] || '';
    const optionD = row['選項D'] || row['选项D'] || row['Option D'] || '';
    const optionE = row['選項E'] || row['选项E'] || row['Option E'] || '';
    const correctAnswer = row['正確答案'] || row['正确答案'] || row['Correct Answer'] || '';
    const explanation = row['解釋'] || row['解释'] || row['Explanation'] || '';
    
    // Skip empty rows
    if (!question || !correctAnswer) {
      return;
    }
    
    tsContent += `  {\n`;
    tsContent += `    id: ${id},\n`;
    tsContent += `    question: "${escapeString(question)}",\n`;
    tsContent += `    optionA: "${escapeString(optionA)}",\n`;
    tsContent += `    optionB: "${escapeString(optionB)}",\n`;
    tsContent += `    optionC: "${escapeString(optionC)}",\n`;
    tsContent += `    optionD: "${escapeString(optionD)}",\n`;
    
    if (optionE && optionE.toString().trim()) {
      tsContent += `    optionE: "${escapeString(optionE)}",\n`;
    }
    
    tsContent += `    correctAnswer: "${String(correctAnswer).trim()}",\n`;
    tsContent += `    explanation: "${escapeString(explanation)}"\n`;
    tsContent += `  },\n`;
    
    questionCount++;
  });
  
  // Close the array and add helper function
  tsContent += `];\n\n`;
  tsContent += `export const getRandomQuestions = (count: number = 20): Question[] => {\n`;
  tsContent += `  const shuffled = [...questions].sort(() => 0.5 - Math.random());\n`;
  tsContent += `  return shuffled.slice(0, Math.min(count, questions.length));\n`;
  tsContent += `};\n`;
  
  // Write the file
  const outputPath = path.join(__dirname, '../src/data/questions.ts');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  
  console.log(`\n✅ Success!`);
  console.log(`📊 Generated ${questionCount} questions`);
  console.log(`📝 Output file: ${outputPath}`);
  console.log(`\nThe questions.ts file has been updated with all ${questionCount} questions!`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}