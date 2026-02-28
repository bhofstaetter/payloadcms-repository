import type {Config} from '@test/helpers/payload.test.types';
import {setupIntegrationTestPayloadInstanceFor} from '@test/helpers/setupIntegrationTestPayloadInstanceFor';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionQuery} from '@/collection/CollectionQuery';

const ctx = setupIntegrationTestPayloadInstanceFor(['dummies']);

type CountParams = Parameters<DummyQuery['repository']['count']>;

class DummyQuery extends CollectionQuery<Config, 'dummies'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummies');
    }

    create(foo: string) {
        return this.repository.create({foo});
    }

    updateById(id: number, foo: string) {
        return this.repository.updateById(id, {foo});
    }

    count(options?: CountParams[0]) {
        return this.repository.count(options);
    }

    countVersions() {
        return this.repository.countVersions();
    }
}

it('counts all documents', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    await dummyQuery.create('foo 2');
    await dummyQuery.create('foo 3');

    // test
    const result = await dummyQuery.count();

    // verify
    expect(result.totalDocs).toStrictEqual(3);
});

it('counts all documents matching a query', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    await dummyQuery.create('foo 2');
    await dummyQuery.create('foo 3');

    // test
    const result = await dummyQuery.count({where: {foo: {equals: 'foo 1'}}});

    // verify
    expect(result.totalDocs).toStrictEqual(1);
});

it('counts all versions', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    const created = await dummyQuery.create('foo 1');
    await dummyQuery.updateById(created.id, 'foo');
    await dummyQuery.updateById(created.id, 'foooo');

    await dummyQuery.create('foo 2');

    // test
    const result = await dummyQuery.countVersions();

    // verify
    expect(result.totalDocs).toStrictEqual(4);
});
