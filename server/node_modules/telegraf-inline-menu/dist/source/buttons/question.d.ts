import { ContextMessageUpdate } from 'telegraf';
export declare function isReplyToQuestion(ctx: ContextMessageUpdate, identifier: string): boolean;
export declare function signQuestionText(questionText: string, identifier: string): string;
