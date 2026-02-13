import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {quizAPI} from "../api";
import {AttemptDetailData, AttemptRequestData, QuizRequestData} from "../validation";

export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const {data, error} = await quizAPI.getQuizzes();

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuizRequestData) => {
      const {error, data: responseData} = await quizAPI.createQuiz(data);

      if (error) {
        throw error;
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["quizzes"]});
    },
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const {data, error} = await quizAPI.getQuizById(id);

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: AttemptRequestData) => {
      const {data, error} = await quizAPI.submitQuiz(requestData);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["submissions"]});
    },
  });
};

export const useSubmissions = () => {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const {data, error} = await quizAPI.getAttempts();

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useSubmissionDetails = (id: string) => {
  return useQuery<AttemptDetailData>({
    queryKey: ["submission", id],
    queryFn: async () => {
      const {data, error} = await quizAPI.getAttemptDetails(id);

      if (error) {
        throw error;
      }

      return data as AttemptDetailData;
    },
    enabled: !!id,
  });
};
