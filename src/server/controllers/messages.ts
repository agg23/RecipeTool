export const error = (action: string, reason: string) => {
    return {
        error: action,
        reason: reason
    }
}

export const success = (action: string, id?: number) => {
    let response = {
        success: action
    };

    if(id) {
        return {id: id, ...response};
    }

    return response;
}