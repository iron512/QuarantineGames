import { ContextFunc, ContextNextFunc } from './generic-types';
export default class CombinedMiddleware {
    private readonly _mainFunc;
    private readonly _hiddenFunc?;
    private readonly _only;
    private readonly _hide;
    private readonly _afterFunc;
    constructor(_mainFunc: ContextNextFunc, _hiddenFunc?: ContextNextFunc | undefined);
    addOnly(func: ContextFunc<boolean>): CombinedMiddleware;
    addHide(func: ContextFunc<boolean>): CombinedMiddleware;
    addAfterFunc(func: ContextFunc<void>, runEvenWhenHidden?: boolean): CombinedMiddleware;
    middleware(): (ctx: any, next: () => any) => Promise<void>;
}
