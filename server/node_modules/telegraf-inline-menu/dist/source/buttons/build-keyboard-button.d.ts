import { ContextMessageUpdate } from 'telegraf';
import { InlineKeyboardButton } from 'telegram-typings';
import { ButtonInfo } from './types';
export declare function buildKeyboardButton(buttonInfo: ButtonInfo, actionCodePrefix: string, ctx: ContextMessageUpdate): Promise<InlineKeyboardButton | undefined>;
