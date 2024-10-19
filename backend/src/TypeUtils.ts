export function valueIfPresentOrError<T> (value: T | undefined | null): T {
    if (value === null || value === undefined) {
        throw Error('Expected value to be present.')
    }
    return value
}
