"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CombinedMiddleware {
    constructor(_mainFunc, _hiddenFunc) {
        this._mainFunc = _mainFunc;
        this._hiddenFunc = _hiddenFunc;
        this._only = [];
        this._hide = [];
        this._afterFunc = [];
    }
    addOnly(func) {
        this._only.push(func);
        return this;
    }
    addHide(func) {
        this._hide.push(func);
        return this;
    }
    addAfterFunc(func, runEvenWhenHidden = false) {
        this._afterFunc.push({
            func,
            runEvenWhenHidden
        });
        return this;
    }
    middleware() {
        return async (ctx, next) => {
            const onlyResults = await Promise.all(this._only.map(async (o) => o(ctx)));
            if (onlyResults.some(o => o !== true)) {
                return next();
            }
            const hiddenResults = await Promise.all(this._hide.map(async (o) => o(ctx)));
            const isHidden = hiddenResults.some(o => o === true);
            if (isHidden) {
                if (this._hiddenFunc) {
                    await this._hiddenFunc(ctx, next);
                }
                else {
                    await next();
                }
            }
            else {
                await this._mainFunc(ctx, next);
            }
            await Promise.all(this._afterFunc
                .filter(o => o.runEvenWhenHidden || !isHidden)
                .map(async (o) => o.func(ctx)));
        };
    }
}
exports.default = CombinedMiddleware;
//# sourceMappingURL=combined-middleware.js.map