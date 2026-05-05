"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyError = exports.legacyWarn = exports.legacyLog = void 0;
function prefix(step) {
    return `[get-legacy] ${step}`;
}
function legacyLog(step, detail) {
    if (detail === undefined) {
        console.log(prefix(step));
        return;
    }
    console.log(prefix(step), detail);
}
exports.legacyLog = legacyLog;
function legacyWarn(step, detail) {
    if (detail === undefined) {
        console.warn(prefix(step));
        return;
    }
    console.warn(prefix(step), detail);
}
exports.legacyWarn = legacyWarn;
function legacyError(step, detail) {
    if (detail === undefined) {
        console.error(prefix(step));
        return;
    }
    console.error(prefix(step), detail);
}
exports.legacyError = legacyError;
