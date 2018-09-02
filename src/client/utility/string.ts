export function nullIfEmpty(value: string): string {
    return !value || value === "" ? null : value;
}

export function nullIfEmptyFloat(value: string): number {
    const nullValue = nullIfEmpty(value);
    return nullValue ? parseFloat(nullValue) : null;
}