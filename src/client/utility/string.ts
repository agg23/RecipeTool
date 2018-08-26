export function nullIfEmpty(value: string): string {
    return !value || value === "" ? null : value;
}