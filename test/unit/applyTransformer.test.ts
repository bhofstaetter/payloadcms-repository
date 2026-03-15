import {expect, it} from 'vitest';

import {applyTransformer} from '@/transfomer';

it('returns data unchanged when no transformer is provided', async () => {
    // prepare
    const data = {foo: 'bar'};

    // test
    const result = await applyTransformer(undefined, data);

    // verify
    expect(result).toStrictEqual({foo: 'bar'});
});

it('returns undefined when no transformer is provided and data is undefined', async () => {
    // test
    const result = await applyTransformer(undefined, undefined);

    // verify
    expect(result).toBeUndefined();
});

it('applies transformer to data', async () => {
    // test
    const result = await applyTransformer(data => ({...data, extra: true}), {foo: 'bar'});

    // verify
    expect(result).toStrictEqual({foo: 'bar', extra: true});
});

it('overrides passed values when transformer sets the same keys', async () => {
    // test
    const result = await applyTransformer(data => ({...data, foo: 'overridden'}), {foo: 'original'});

    // verify
    expect(result).toStrictEqual({foo: 'overridden'});
});

it('supports async transformers', async () => {
    // test
    const result = await applyTransformer(
        async data => {
            await Promise.resolve();
            return {...data, foo: 'async'};
        },
        {foo: 'bar'},
    );

    // verify
    expect(result).toStrictEqual({foo: 'async'});
});

it('passes undefined data to transformer when data is undefined', async () => {
    // test
    const result = await applyTransformer(() => ({fallback: true}), undefined);

    // verify
    expect(result).toStrictEqual({fallback: true});
});
