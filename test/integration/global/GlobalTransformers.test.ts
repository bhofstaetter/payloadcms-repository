import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {GlobalOperations} from '@/global/GlobalOperations';
import type {GlobalTransformers} from '@/global/GlobalRepository';

const ctx = getTestContext();

class TransformedGlobal extends GlobalOperations<Config, 'dummy'> {
    constructor(payload: BasePayload, transformers: GlobalTransformers<Config, 'dummy'>) {
        super(payload, 'dummy', transformers);
    }

    find() {
        return this.repository.find();
    }

    findVersions() {
        return this.repository.findVersions();
    }

    findVersionById(id: string) {
        return this.repository.findVersionById(id);
    }

    countVersions() {
        return this.repository.countVersions();
    }

    update(foo: string, bar?: number) {
        return this.repository.update({foo, bar});
    }
}

it('transforms update data', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        update: {
            data: data => ({...data, bar: 42}),
        },
    });

    // test
    const result = await global.update('hello');

    // verify
    expect(result.foo).toStrictEqual('hello');
    expect(result.bar).toStrictEqual(42);
});

it('transforms update options', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        update: {
            options: options => ({...options, select: {foo: true}}),
        },
    });

    // test
    const result = await global.update('hello', 42);

    // verify
    expect(result.foo).toStrictEqual('hello');
    expect(result.bar).toBeUndefined();
});

it('transforms find options', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        find: {
            options: () => ({select: {foo: true}}),
        },
    });

    await global.update('hello', 99);

    // test
    const result = await global.find();

    // verify
    expect(result.foo).toStrictEqual('hello');
    expect(result.bar).toBeUndefined();
});

it('transforms findVersions options', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        findVersions: {
            options: () => ({limit: 1}),
        },
    });

    await global.update('v1');
    await global.update('v2');
    await global.update('v3');

    // test
    const result = await global.findVersions();

    // verify
    expect(result.docs).toHaveLength(1);
});

it('transforms findVersionById options', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        findVersionById: {
            options: options => ({...options, depth: 0}),
        },
    });

    await global.update('hello');
    const versions = await global.findVersions();

    // test
    const version = await global.findVersionById(versions.docs[0].id);

    // verify
    expect(version.version.foo).toStrictEqual('hello');
});

it('transforms countVersions options', async () => {
    // prepare
    const global = new TransformedGlobal(ctx.payload, {
        countVersions: {
            options: () => ({where: {version__foo: {equals: 'count-target'}}}),
        },
    });

    await global.update('count-target');
    await global.update('other');
    await global.update('count-target');

    // test
    const result = await global.countVersions();

    // verify
    expect(result.totalDocs).toStrictEqual(2);
});
