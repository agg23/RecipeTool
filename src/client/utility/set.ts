export const difference = <T extends {}>(a: Set<T>, b: Set<T>) => {
    return [...a].filter(x => !b.has(x));
}

export const union = <T extends {}>(a: Set<T>, b: Set<T>) => {
    return new Set([...a, ...b]);
}

export const intersection = <T extends {}>(a: Set<T>, b: Set<T>) => {
    return [...a].filter(x => b.has(x));
}