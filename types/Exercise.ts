export interface ExerciseInterface {
    id: string;
    question: string;
    options: string[];
    answer: string;
    theme: string;
    authorId: string;
    classroomId?: number;
}
