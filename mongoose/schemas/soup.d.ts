import { Model, PopulatedDoc, Document, ObjectId } from 'mongoose';

interface IQuestion {
    soupId: number;
    timestamp: number;
    authorId: string;
    title: string;
    content: string;
    answer: string;
    publicAnswer: boolean;
    answers: PopulatedDoc<Document<ObjectId> & IAnswer>[],
}

interface IQuestionMethods {
    getShortContent(): string;
}

interface IQuestionModelWithStatics extends Model<IQuestion, {}, IQuestionMethods> {
    getNextId(): Promise<Number>;
}

interface IAnswer {
    original: PopulatedDoc<Document<ObjectId> & IQuestion>;
    content: string;
    reply: {
        replied: boolean;
        public: boolean;
        status: 'not replyed' | 'correct' | 'incorrect' | 'not correlated' | 'can\'t reply' | 'solution' | 'opposite solution';
        important: boolean;
        content: boolean;
    };
}

export declare const Questions: IQuestionModelWithStatics;
export declare const Answers: Model<IAnswer>;