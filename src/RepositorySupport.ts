export type Transformer<T> = (value: T) => T | Promise<T>;

export async function applyTransformer<T>(transformer: Transformer<T> | undefined, data: T): Promise<T>;
export async function applyTransformer<T>(
    transformer: Transformer<T> | undefined,
    data: T | undefined,
): Promise<T | undefined>;
export async function applyTransformer<T>(
    transformer: Transformer<T> | undefined,
    data: T | undefined,
): Promise<T | undefined> {
    if (transformer) {
        return transformer(data as T);
    }

    return data;
}
