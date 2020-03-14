import { ContextFunc, ContextKeyFunc, ContextKeyIndexArrFunc } from '../generic-types';
import { PrefixOptions } from '../prefix';
import { KeyboardPart } from './types';
declare type OptionsDict = Record<string | number, string>;
declare type OptionsArr = readonly (string | number)[];
export declare type SelectOptions = OptionsArr | OptionsDict;
interface SelectButtonOptions {
    columns?: number;
    maxRows?: number;
    currentPage?: number;
    textFunc: ContextKeyIndexArrFunc<string>;
    hide?: ContextKeyFunc<boolean>;
}
export declare function generateSelectButtons(actionBase: string, options: OptionsArr, selectOptions: SelectButtonOptions): KeyboardPart;
export interface SelectButtonCreatorOptions extends PrefixOptions {
    getCurrentPage?: ContextFunc<number | undefined>;
    textFunc?: ContextKeyIndexArrFunc<string>;
    prefixFunc?: ContextKeyIndexArrFunc<string>;
    isSetFunc?: ContextKeyFunc<boolean>;
    multiselect?: boolean;
    hide?: ContextKeyFunc<boolean>;
}
export declare function selectButtonCreator(action: string, optionsFunc: ContextFunc<SelectOptions>, additionalArgs: SelectButtonCreatorOptions): (ctx: any) => Promise<KeyboardPart>;
export declare function selectHideFunc(keyFromCtx: (ctx: any) => string, optionsFunc: ContextFunc<SelectOptions>, userHideFunc?: ContextKeyFunc<boolean>): ((ctx: any) => Promise<boolean>);
export {};
