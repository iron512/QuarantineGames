import { ContextMessageUpdate } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegram-typings';
import { ButtonRow, KeyboardPartCreator } from './types';
export declare function buildKeyboard(content: (ButtonRow | KeyboardPartCreator)[], actionCodePrefix: string, ctx: ContextMessageUpdate): Promise<InlineKeyboardMarkup>;
