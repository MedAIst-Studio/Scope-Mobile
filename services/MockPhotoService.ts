export interface AnalyzedQuestion {
  id: string;
  originalImage: string;
  extractedText: string;
  predictedSubject: string;
  confidence: number;
}

export const MockPhotoService = {
  analyzePhoto: async (uri: string): Promise<AnalyzedQuestion> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response
    return {
      id: Math.random().toString(36).substring(7),
      originalImage: uri,
      extractedText: 'Aşağıdakilerden hangisi akut apandisit tanısında en güvenilir bulgudur?',
      predictedSubject: 'Genel Cerrahi',
      confidence: 0.95,
    };
  },
};
