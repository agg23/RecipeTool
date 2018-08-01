export const error = (message: string, reason: string) => {
    return {
        error: message,
        reason: reason
    }
}