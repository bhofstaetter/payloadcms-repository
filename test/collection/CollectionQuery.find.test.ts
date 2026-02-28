import type {Config} from '@test/helpers/payload.test.types';
import {setupIntegrationTestPayloadInstanceFor} from '@test/helpers/setupIntegrationTestPayloadInstanceFor';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionQuery} from '@/collection/CollectionQuery';

const ctx = setupIntegrationTestPayloadInstanceFor(['dummies']);

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

    findAll() {
        return this.repository.find();
    }

    findById(id: number) {
        return this.repository.findById(id);
    }

    findByIds(ids: number[]) {
        return this.repository.findByIds(ids);
    }

    findDistinct() {
        return this.repository.findDistinct('foo');
    }

    findVersions() {
        return this.repository.findVersions();
    }

    findVersionById(id: string) {
        return this.repository.findVersionById(id);
    }
}

it('finds all documents', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    await dummyQuery.create('foo 2');
    await dummyQuery.create('foo 3');

    // test
    const result = await dummyQuery.findAll();

    // verify
    expect(result.totalDocs).toStrictEqual(3);
    expect(result.docs.map(d => d.foo)).toStrictEqual(['foo 3', 'foo 2', 'foo 1']);
});

it('finds one document by id', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    const desired = await dummyQuery.create('foo 2');
    await dummyQuery.create('foo 3');

    // test
    const result = await dummyQuery.findById(desired.id);

    // verify
    expect(result.id).toStrictEqual(desired.id);
});

it('finds multiple documents by their ids', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    const desired = await dummyQuery.create('foo 2');
    const desired2 = await dummyQuery.create('foo 3');

    // test
    const result = await dummyQuery.findByIds([desired.id, desired2.id, 999999]);

    // verify
    expect(result.totalDocs).toStrictEqual(2);
    expect(result.docs.map(d => d.foo)).toStrictEqual(['foo 3', 'foo 2']);
});

it('finds distinct values', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.create('foo 1');
    await dummyQuery.create('foo 1');
    await dummyQuery.create('foo 2');
    await dummyQuery.create('foo 3');
    await dummyQuery.create('foo 3');
    await dummyQuery.create('foo 4');

    // test
    const result = await dummyQuery.findDistinct();

    // verify
    expect(result.totalDocs).toStrictEqual(4);
    expect(result.values.map(d => d.foo)).toStrictEqual(['foo 1', 'foo 2', 'foo 3', 'foo 4']);
});

it('finds a version by its id', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    const created = await dummyQuery.create('foo 1');
    await dummyQuery.updateById(created.id, 'foo 2');
    await dummyQuery.updateById(created.id, 'foo 3');

    // test
    const secondVersion = await dummyQuery.findVersions().then(page => page.docs[1]);
    const result = await dummyQuery.findVersionById(secondVersion.id);

    // verify
    expect(result.version.foo).toStrictEqual('foo 2');
});
