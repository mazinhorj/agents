export type Question = {
    questionId: string;
    question?: string;
    answer: string | null;
    createdAt: string;
};

export type CreateQuestionResponse = Question[]