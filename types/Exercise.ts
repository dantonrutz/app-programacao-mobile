export interface ExerciseInterface {
    id: string;
    question: string;
    options: string[];
    answer: string;
    theme: string;
    authorId: string;
    difficulty: number;
    status: 'liberado' | 'bloqueado' | 'correto' | 'errado';
    classroomId?: string;
}
