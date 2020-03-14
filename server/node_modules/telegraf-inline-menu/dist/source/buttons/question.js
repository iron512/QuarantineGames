"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'http://t.me/#';
function isReplyToQuestion(ctx, identifier) {
    if (!ctx.message || !ctx.message.reply_to_message) {
        return false;
    }
    const repliedTo = ctx.message.reply_to_message;
    if (!repliedTo.entities) {
        return false;
    }
    const relevantEntity = repliedTo.entities
        .filter(o => o.type === 'text_link')
        .slice(-1)[0];
    if (!relevantEntity || !relevantEntity.url || !relevantEntity.url.startsWith(BASE_URL)) {
        return false;
    }
    const repliedToIdentifier = relevantEntity.url.slice(BASE_URL.length);
    return repliedToIdentifier === identifier;
}
exports.isReplyToQuestion = isReplyToQuestion;
function signQuestionText(questionText, identifier) {
    const suffix = `[\u200C](${BASE_URL}${identifier})`;
    return questionText + suffix;
}
exports.signQuestionText = signQuestionText;
//# sourceMappingURL=question.js.map