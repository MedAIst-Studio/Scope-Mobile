import {apiClient} from "@/lib/api";

import {
  attemptDetailResponseSchema,
  AttemptRequestData,
  attemptRequestSchema,
  attemptsResponseSchema,
  QuizRequestData,
  quizResponseSchema,
  quizzesResponseSchema,
  submitResponseSchema,
} from "../validation";

export const quizAPI = {
  createQuiz: async (data: QuizRequestData) => {
    const {data: responseData, error} = await apiClient.request({
      url: "/quizzes",
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10 * 60 * 1000,
    });

    return {error, data: responseData};
  },

  getQuizzes: async () => {
    const {error, data} = await apiClient.get("/quizzes", {
      response: quizzesResponseSchema,
    });

    return {error, data};
  },

  getQuizById: async (id: string) => {
    const {error, data} = await apiClient.get("/quizzes/" + id, {
      response: quizResponseSchema,
    });

    return {error, data};
  },

  submitQuiz: async (requestData: AttemptRequestData) => {
    const {error, data} = await apiClient.post(`/quizzes/${requestData.id}/solve`, requestData, {
      request: attemptRequestSchema,
      response: submitResponseSchema,
    });

    return {error, data};
  },

  getAttemptDetails: async (id: string) => {
    const {error, data} = await apiClient.get("/quizzes/attempts/" + id, {
      response: attemptDetailResponseSchema,
    });

    return {error, data};
  },

  getAttempts: async () => {
    const {error, data} = await apiClient.get("/quizzes/attempts", {
      response: attemptsResponseSchema,
    });

    return {error, data};
  },
};
