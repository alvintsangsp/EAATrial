const fs = require('fs');
const path = require('path');

// Test if the data file can be read and parsed
const dataPath = path.join(__dirname, '../src/data/eaa-questions.json');

try {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log('✅ Data file loaded successfully');
  console.log('📊 Total questions:', data.totalQuestions);
  console.log('📝 Questions array length:', data.questions.length);
  
  // Check first question
  if (data.questions.length > 0) {
    console.log('🔍 First question ID:', data.questions[0].id);
    console.log('❓ First question preview:', data.questions[0].question.substring(0, 50) + '...');
  }
} catch (error) {
  console.error('❌ Error loading data file:', error.message);
}