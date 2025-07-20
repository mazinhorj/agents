import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateQuestionRequest } from './types/create-question-request';
import type { CreateQuestionResponse } from './types/create-question-response';


export function useCreateQuestion(roomId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dataM: CreateQuestionRequest) => {
            const response = await fetch(
                `http://localhost:3333/rooms/${roomId}/questions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataM),
                }
            );
            const result: CreateQuestionResponse = await response.json();

            return result;
        },

        onMutate({ question }) {

            const questions = queryClient.getQueryData<CreateQuestionResponse>([
                'get-questions',
                roomId
            ]) || [];

            const previousQuestions = questions ?? [];

            const newQuestion = {
                questionId: crypto.randomUUID(),
                question,
                answer: null,
                createdAt: new Date().toISOString(),
                isGeneratingAnswer: true, // Assuming this is the intended default state
            }


            queryClient.setQueryData<CreateQuestionResponse>(
                ['get-questions', roomId],
                [
                    newQuestion,
                    ...previousQuestions,
                ]
            )
            return { newQuestion, questions };
        },
        onSuccess(data, _variables, context) {

            queryClient.setQueryData<CreateQuestionResponse>(
                ['get-questions', roomId],
                questions => {
                    if (!questions) {
                        return questions
                    }

                    if (!context.newQuestion) {
                        return questions;
                    }

                    return questions.map((question) => {
                        if (question.questionId === context.newQuestion.questionId) {
                            return {
                                ...context.newQuestion, questionId: data.questionId,
                                answer: data.answer,
                                isGeneratingAnswer: false, // Update the isGeneratingAnswer state
                            };
                        }
                        return question;
                    });
                }
            );

        },
        onError(_error, _variables, context) {
            if (context?.questions) {
                queryClient.setQueryData<CreateQuestionResponse>(
                    ['get-questions', roomId],
                    context.questions

                )
            }
        }

        // onSuccess: () => {
        //     // Invalidate the 'get-createRoom' query to refetch the rooms
        //     queryClient.invalidateQueries({ queryKey: ['get-questions', roomId] });
        // },
    });
}
