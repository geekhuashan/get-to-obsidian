function prefix(step: string): string {
    return `[get-legacy] ${step}`;
}

export function legacyLog(step: string, detail?: unknown): void {
    if (detail === undefined) {
        console.log(prefix(step));
        return;
    }
    console.log(prefix(step), detail);
}

export function legacyWarn(step: string, detail?: unknown): void {
    if (detail === undefined) {
        console.warn(prefix(step));
        return;
    }
    console.warn(prefix(step), detail);
}

export function legacyError(step: string, detail?: unknown): void {
    if (detail === undefined) {
        console.error(prefix(step));
        return;
    }
    console.error(prefix(step), detail);
}
