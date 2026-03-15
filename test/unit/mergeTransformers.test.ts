import type {Config} from '@test/helpers/payload.test.types';
import {expect, it} from 'vitest';
import type {CollectionTransformers} from '@/collection/CollectionRepository';
import type {GlobalTransformers} from '@/global/GlobalRepository';
import {mergeTransformers} from '@/transfomer';

type TestCollectionTransformers = CollectionTransformers<Config, 'dummies'>;
type TestGlobalTransformers = GlobalTransformers<Config, 'dummy'>;

it('returns single object directly (same reference)', () => {
    // prepare
    const transformers: TestCollectionTransformers = {
        find: {
            where: w => w,
        },
    };

    // test
    const result = mergeTransformers(transformers);

    // verify
    expect(result).toStrictEqual(transformers);
});

it('merges non-overlapping operations', async () => {
    // prepare
    const a: TestCollectionTransformers = {
        find: {
            where: w => ({...w, foo: {equals: 'filtered'}}),
        },
    };

    const b: TestCollectionTransformers = {
        create: {
            data: d => ({...d, bar: 42}),
        },
    };

    // test
    const merged = mergeTransformers(a, b);

    // verify
    const where = await merged.find?.where?.({});
    expect(where).toStrictEqual({foo: {equals: 'filtered'}});

    const data = await merged.create?.data?.({foo: 'test'});
    expect(data).toStrictEqual({foo: 'test', bar: 42});
});

it('merges non-overlapping parameters within same operation', async () => {
    // prepare
    const a: TestCollectionTransformers = {
        find: {
            where: w => ({...w, foo: {equals: 'filtered'}}),
        },
    };

    const b: TestCollectionTransformers = {
        find: {
            options: o => ({...o, limit: 1}),
        },
    };

    // test
    const merged = mergeTransformers(a, b);

    // verify
    const where = await merged.find?.where?.({});
    expect(where).toStrictEqual({foo: {equals: 'filtered'}});

    const options = await merged.find?.options?.({});
    expect(options).toStrictEqual({limit: 1});
});

it('chains overlapping leaf transformers in order', async () => {
    // prepare
    const a: TestCollectionTransformers = {
        find: {
            options: o => ({...o, limit: 10}),
        },
    };

    const b: TestCollectionTransformers = {
        find: {
            options: o => ({...o, depth: 2}),
        },
    };

    // test
    const merged = mergeTransformers(a, b);
    const result = await merged.find?.options?.({});

    // verify
    expect(result).toStrictEqual({limit: 10, depth: 2});
});

it('chains overlapping leaves across 3 inputs', async () => {
    // prepare
    const log: string[] = [];

    const a: TestCollectionTransformers = {
        find: {
            where: w => {
                log.push('a');
                return {...w, foo: {equals: 'a'}};
            },
        },
    };

    const b: TestCollectionTransformers = {
        find: {
            where: w => {
                log.push('b');
                return {...w, bar: {equals: 1}};
            },
        },
    };

    const c: TestCollectionTransformers = {
        find: {
            where: w => {
                log.push('c');
                return {...w, id: {equals: 99}};
            },
        },
    };

    // test
    const merged = mergeTransformers(a, b, c);
    const result = await merged.find?.where?.({});

    // verify
    expect(result).toStrictEqual({foo: {equals: 'a'}, bar: {equals: 1}, id: {equals: 99}});
    expect(log).toStrictEqual(['a', 'b', 'c']);
});

it('chains async transformers', async () => {
    // prepare
    const a: TestCollectionTransformers = {
        find: {
            options: async o => {
                await Promise.resolve();
                return {...o, limit: 10};
            },
        },
    };

    const b: TestCollectionTransformers = {
        find: {
            options: async o => {
                await Promise.resolve();
                return {...o, depth: 2};
            },
        },
    };

    // test
    const merged = mergeTransformers(a, b);
    const result = await merged.find?.options?.({});

    // verify
    expect(result).toStrictEqual({limit: 10, depth: 2});
});

it('works with GlobalTransformers', async () => {
    // prepare
    const a: TestGlobalTransformers = {
        find: {
            options: o => ({...o, depth: 0}),
        },
    };

    const b: TestGlobalTransformers = {
        update: {
            data: d => ({...d, bar: 42}),
        },
    };

    // test
    const merged = mergeTransformers(a, b);

    // verify
    const options = await merged.find?.options?.({});
    expect(options).toStrictEqual({depth: 0});

    const data = await merged.update?.data?.({foo: 'test'});
    expect(data).toStrictEqual({foo: 'test', bar: 42});
});
