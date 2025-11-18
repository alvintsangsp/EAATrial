import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh-TW' | 'zh-CN';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  'zh-TW': {
    // ExamWelcome.tsx translations
    'disclaimer': '免責聲明',
    'appTitle': '香港地產代理人員資格考試（EAQE）/ 營業員資格 (SQE) 模擬考試',
    'trialVersion': '（試用版）',
    'appSubtitle': '地產代理資格考試練習平台',
    'examNotice': '考試須知：',
    'officialVersionNotice': '正式版本包含超過1000題題目。',
    'questionCount': '題目數量',
    'questionCountDetail': '30條隨機選擇的題目',
    'examTime': '考試時間',
    'examTimeDetail': '60分鐘倒數計時',
    'questionFormat': '題目格式',
    'questionFormatDetail': '多項選擇題（4-5個選項）',
    'examFeatures': '考試功能',
    'examFeaturesDetail': '可在提交前檢閱及修改答案',
    'mockExam': '模擬考試',
    'practiceMode': '練習模式',
    'passingCriteria': '合格標準：',
    'passingCriteriaDetail': '答對60%或以上（18題或以上）',
    'shareApp': '分享此應用',
    'shareDescription': '一起來練習香港地產代理人員資格考試！',
    'shareLinkCopied': '連結已複製，快分享給朋友吧！',
    'sharePrompt': '無法自動分享，請複製以下連結：',
    'feedback': '意見回饋：',
    'producedBy': 'Produced by Merlin Advisory Solution',
    'copyright': '© 2025 版權所有',
    'simplifiedChinese': '简体中文',
    'traditionalChinese': '繁體中文',
    
    // Index.tsx translations
    'loadingQuestions': '載入問題中...',
    'fiveMinutesLeft': '只剩下5分鐘！',
    'checkAnswers': '請檢查你的答案',
    'examStarted': '考試已開始',
    'goodLuck': '祝你好運！',
    'noQuestionsInTopic': '此主題暫無題目',
    'startPractice': '開始練習：主題',
    'questionsCount': '共有',
    'questions': '題',
    'timeUp': '時間到！',
    'examAutoSubmitted': '考試已自動提交',
    'retakeSameTopic': '重做此主題',
    'retakeExam': '重新考試',
    'backToHome': '返回主頁',
    
    // ExamQuestion.tsx translations
    'questionProgress': '題目進度',
    'questionNumber': '題目編號：',
    'reviewAnswers': '檢閱答案',
    'previousQuestion': '上一題',
    'submitExam': '提交考試',
    'nextQuestion': '下一題',
    'continueExam': '繼續答題',
    
    // ExamResults.tsx translations
    'passed': '✓ 合格',
    'failed': '✗ 不合格',
    'yourScore': '你的得分：',
    'totalQuestions': '總題數',
    'correct': '答對',
    'wrong': '答錯',
    'timeTaken': '用時',
    'questionReview': '逐題檢閱',
    'yourAnswer': '你的答案：',
    'correctAnswer': '正確答案：',
    'explanation': '解釋：',
    'errorReporting': '發現題目有錯誤或想提供意見？',
    'reportProblem': '回報問題',
    'questionFeedback': '題目編號：\n問題描述：\n',
    'notAnswered': '未作答',
    
    // TopicSelection.tsx translations
    'selectTopic': '選擇練習主題',
    'topic8': '香港地產代理業簡介',
    'topic9': '適用於地產代理業務的法律',
    'topic10': '倫理守則',
    'topic11': '客戶資金處理規則',
    'topic12': '利益衝突及相關交易',
    'topic13': '廣告限制',
    'topic14': '文件及記錄保存',
    'topic15': '其他規例及要求',
    
    // ExamReview.tsx translations
    'question': '題目',
    'selectedAnswer': '已選擇：',
    'answeredQuestions': '已回答：',
    'unansweredQuestions': '未回答：',
    
    // Common translations
    'minutes': '分鐘',
    'seconds': '秒',
    'questionUnit': '題',
  },
  'zh-CN': {
    // ExamWelcome.tsx translations
    'disclaimer': '免责声明',
    'appTitle': '香港地產代理人員資格考試（EAQE）/ 營業員資格 (SQE) 模拟考试',
    'trialVersion': '（试用版）',
    'appSubtitle': '地产代理资格考试练习平台',
    'examNotice': '考试须知：',
    'officialVersionNotice': '正式版本包含超过1000题题目。',
    'questionCount': '题目数量',
    'questionCountDetail': '30条随机选择的题目',
    'examTime': '考试时间',
    'examTimeDetail': '60分钟倒数计时',
    'questionFormat': '题目格式',
    'questionFormatDetail': '多项选择题（4-5个选项）',
    'examFeatures': '考试功能',
    'examFeaturesDetail': '可在提交前检阅及修改答案',
    'mockExam': '模拟考试',
    'practiceMode': '练习模式',
    'passingCriteria': '合格标准：',
    'passingCriteriaDetail': '答对60%或以上（18题或以上）',
    'shareApp': '分享此应用',
    'shareDescription': '一起来练习香港地产代理人员资格考试！',
    'shareLinkCopied': '链接已复制，快分享给朋友吧！',
    'sharePrompt': '无法自动分享，请复制以下链接：',
    'feedback': '意见反馈：',
    'producedBy': 'Produced by Merlin Advisory Solution',
    'copyright': '© 2025 版权所有',
    'simplifiedChinese': '简体中文',
    'traditionalChinese': '繁體中文',
    
    // Index.tsx translations
    'loadingQuestions': '载入问题中...',
    'fiveMinutesLeft': '只剩下5分钟！',
    'checkAnswers': '请检查你的答案',
    'examStarted': '考试已开始',
    'goodLuck': '祝你好运！',
    'noQuestionsInTopic': '此主题暂无题目',
    'startPractice': '开始练习：主题',
    'questionsCount': '共有',
    'questions': '题',
    'timeUp': '时间到！',
    'examAutoSubmitted': '考试已自动提交',
    'retakeSameTopic': '重做此主题',
    'retakeExam': '重新考试',
    'backToHome': '返回主页',
    
    // ExamQuestion.tsx translations
    'questionProgress': '题目进度',
    'questionNumber': '题目编号：',
    'reviewAnswers': '检阅答案',
    'previousQuestion': '上一题',
    'submitExam': '提交考试',
    'nextQuestion': '下一题',
    'continueExam': '继续答题',
    
    // ExamResults.tsx translations
    'passed': '✓ 合格',
    'failed': '✗ 不合格',
    'yourScore': '你的得分：',
    'totalQuestions': '总题数',
    'correct': '答对',
    'wrong': '答错',
    'timeTaken': '用时',
    'questionReview': '逐题检阅',
    'yourAnswer': '你的答案：',
    'correctAnswer': '正确答案：',
    'explanation': '解释：',
    'errorReporting': '发现题目有错误或想提供意见？',
    'reportProblem': '回报问题',
    'questionFeedback': '题目编号：\n问题描述：\n',
    
    // TopicSelection.tsx translations
    'selectTopic': '选择练习主题',
    'topic8': '香港地产代理业简介',
    'topic9': '适用于地产代理业务的法律',
    'topic10': '伦理守则',
    'topic11': '客户资金处理规则',
    'topic12': '利益冲突及相关交易',
    'topic13': '广告限制',
    'topic14': '文件及记录保存',
    'topic15': '其他规例及要求',
    
    // ExamReview.tsx translations
    'question': '题目',
    'selectedAnswer': '已选择：',
    'answeredQuestions': '已回答：',
    'unansweredQuestions': '未回答：',
    
    // Common translations
    'minutes': '分钟',
    'seconds': '秒',
    'questionUnit': '题',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};