"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isCallbackQueryActionFunc(actionCode) {
    return async (ctx) => {
        if (ctx.updateType !== 'callback_query' || !ctx.callbackQuery) {
            return false;
        }
        ctx.match = actionCode.exec(ctx.callbackQuery.data || '') || undefined;
        if (!ctx.match) {
            return false;
        }
        return true;
    };
}
exports.isCallbackQueryActionFunc = isCallbackQueryActionFunc;
//# sourceMappingURL=middleware-helper.js.map