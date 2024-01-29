import { Model, PopulatedDoc, Document, ObjectId } from 'mongoose';

interface IQuestion {
    soupId: number;
    timestamp: number;
    authorId: string;
    title: string;
    content: string;
    answer: string;
    publicAnswer: boolean;
}

interface IQuestionMethods {
    getShortContent(): string;
    createAnswer(content: string, by: string): Promise<Document<unknown, {}, IAnswer>>;
}

interface IQuestionModelWithStatics extends Model<IQuestion, {}, IQuestionMethods> {
    getNextId(): Promise<Number>;
}

interface IAnswer {
    original: PopulatedDoc<Document<ObjectId> & IQuestion>;
    content: string;
    answerId: number;
    by: string;
    timestamp: number;
    reply: {
        status: 'not replyed' | 'correct' | 'incorrect' | 'not correlated' | 'can\'t reply' | 'solution' | 'opposite solution';
        important: boolean;
        content: boolean;
    };
}

interface IAnswerMethods {
    getShortContent(): string;
    getReplyStatus(): string;
}

export declare const Questions: IQuestionModelWithStatics;
export declare const Answers: Model<IAnswer, {}, IAnswerMethods>;