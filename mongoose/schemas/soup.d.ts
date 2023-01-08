import { Model } from 'mongoose';

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
}

interface IQuestionModelWithStatics extends Model<IQuestion, {}, IQuestionMethods> {
    async getNextId(): Promise<Number>;
}

export declare const Questions: IQuestionModelWithStatics;