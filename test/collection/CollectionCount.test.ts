import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionOperations} from '@/collection/CollectionOperations';

const ctx = getTestContext();

type CountParams = Parameters<CollectionCount['repository']['count']>;

class CollectionCount extends CollectionOperations<Config, 'dummies'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummies');
    }

    // methods just for the test setup, normally they do not belong here
    create(foo: string) {
        return this.repository.create({foo});
    }

    updateById(id: number, foo: string) {
        return this.repository.updateById(id, {foo});
    }

    // count methods
    count(options?: CountParams[0]) {
        return this.repository.count(options);
    }

    countVersions() {
        return this.repository.countVersions();
    }
}

it('counts all documents', async () => {
    // prepare
    const collectionCount = new CollectionCount(ctx.payload);

    await collectionCount.create('foo 1');
    await collectionCount.create('foo 2');
    await collectionCount.create('foo 3');

    // test
    const result = await collectionCount.count();

    // verify
    expect(result.totalDocs).toStrictEqual(3);
});

it('counts all documents matching a query', async () => {
    // prepare
    const collectionCount = new CollectionCount(ctx.payload);

    await collectionCount.create('foo 1');
    await collectionCount.create('foo 2');
    await collectionCount.create('foo 3');

    // test
    const result = await collectionCount.count({where: {foo: {equals: 'foo 1'}}});

    // verify
    expect(result.totalDocs).toStrictEqual(1);
});

it('counts all versions', async () => {
    // prepare
    const collectionCount = new CollectionCount(ctx.payload);

    const created = await collectionCount.create('foo 1');
    await collectionCount.updateById(created.id, 'foo');
    await collectionCount.updateById(created.id, 'foooo');

    await collectionCount.create('foo 2');

    // test
    const result = await collectionCount.countVersions();

    // verify
    expect(result.totalDocs).toStrictEqual(4);
});
