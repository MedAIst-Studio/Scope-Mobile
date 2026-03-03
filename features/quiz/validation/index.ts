import z from 'zod';

export const quizRequestSchema = z.object({
  fileId: z.string().min(1, 'Dosya seçimi gereklidir'),
  quizName: z.string().min(1, 'Quiz adı gereklidir'),
  endPage: z.coerce.number().optional(),
  startPage: z.coerce.number().optional(),
});

export const quizCreateResponseSchema = z.object({
  quizId: z.string(),
});

export const generatePracticeQuizRequestSchema = z.object({
  examType: z.enum(['TYT', 'AYT']),
  subject: z.string().min(1, 'Ders seçimi gereklidir'),
  topic: z.string().min(1, 'Konu seçimi gereklidir'),
  questionCount: z.coerce.number().min(1, 'Soru sayısı seçimi gereklidir'),
});

export const quizResponseSchema = z.object({
  id: z.string(),
  questions: z.array(
    z.object({
      correct_option: z.string(),
      no: z.number(),
      options: z.array(
        z.object({
          label: z.string(),
          text: z.string(),
        })
      ),
      text: z.string(),
    })
  ),
  title: z.string(),
});

export const subjectsResponseSchema = z.array(
  z.object({
    id: z.string(),
    examType: z.string(),
    name: z.string(),
  })
)

export const subjectTopicsResponseSchema = z.array(
  z.object({
    id: z.string(),
    subjectId: z.string(),
    name: z.string(),
  })
)

export const attemptRequestSchema = z.object({
  id: z.string().min(1, 'Quiz ID is required'),
  answers: z.array(
    z.object({
      question_no: z.number().min(1, 'Question ID is required'),
      selected_option: z.string().min(1, 'Selected option is required'),
    })
  ),
});

export const attemptDetailResponseSchema = z.object({
  answers: z.array(
    z.object({
      correct_option: z.string(),
      explanation: z.string(),
      is_correct: z.boolean(),
      question_no: z.number(),
      question_text: z.string(),
      selected_option: z.string(),
    })
  ),
  completed_at: z.string(),
  id: z.string(),
  percentage: z.number(),
  quiz_id: z.string(),
  quiz_title: z.string(),
  score: z.number(),
  total_questions: z.number(),
});

export const attemptsResponseSchema = z.object({
  attempts: z.array(
    z.object({
      id: z.string(),
      percentage: z.number(),
      quiz_id: z.string(),
      quiz_title: z.string(),
      score: z.number(),
      time_spent_seconds: z.number(),
      total_questions: z.number(),
    })
  ),
  total_count: z.number(),
});

export const submitResponseSchema = z.object({
  answers: z.array(
    z.object({
      correct_option: z.string(),
      explanation: z.string(),
      is_correct: z.boolean(),
      question_no: z.number(),
      selected_option: z.string(),
    })
  ),
  attempt_id: z.string(),
  percentage: z.number(),
  score: z.number(),
  total_questions: z.number(),
});

export const quizzesResponseSchema = z.array(
  z.object({
    quizId: z.string(),
    title: z.string(),
    createdAt: z.string(),
  })
);

export type AttemptRequestData = z.infer<typeof attemptRequestSchema>;
export type QuizRequestData = z.infer<typeof quizRequestSchema>;
export type QuizResponseData = z.infer<typeof quizResponseSchema>;
export type AttemptDetailData = z.infer<typeof attemptDetailResponseSchema>;
export type AttemptsResponseData = z.infer<typeof attemptsResponseSchema>;
export type SubmitResponseData = z.infer<typeof submitResponseSchema>;
export type QuizzesResponseData = z.infer<typeof quizzesResponseSchema>;
export type GeneratePracticeQuizRequestData = z.infer<typeof generatePracticeQuizRequestSchema>;
