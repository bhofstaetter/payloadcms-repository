import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionOperations} from '@/collection/CollectionOperations';

const ctx = getTestContext();

class CollectionQuery extends CollectionOperations<Config, 'dummies'> {
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

    // query methods
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
    const collectionQuery = new CollectionQuery(ctx.payload);

    await collectionQuery.create('foo 1');
    await collectionQuery.create('foo 2');
    await collectionQuery.create('foo 3');

    // test
    const result = await collectionQuery.findAll();

    // verify
    expect(result.totalDocs).toStrictEqual(3);
    expect(result.docs.map(d => d.foo)).toStrictEqual(['foo 3', 'foo 2', 'foo 1']);
});

it('finds one document by id', async () => {
    // prepare
    const collectionQuery = new CollectionQuery(ctx.payload);

    await collectionQuery.create('foo 1');
    const desired = await collectionQuery.create('foo 2');
    await collectionQuery.create('foo 3');

    // test
    const result = await collectionQuery.findById(desired.id);

    // verify
    expect(result.id).toStrictEqual(desired.id);
});

it('finds multiple documents by their ids', async () => {
    // prepare
    const collectionQuery = new CollectionQuery(ctx.payload);

    await collectionQuery.create('foo 1');
    const desired = await collectionQuery.create('foo 2');
    const desired2 = await collectionQuery.create('foo 3');

    // test
    const result = await collectionQuery.findByIds([desired.id, desired2.id, 999999]);

    // verify
    expect(result.totalDocs).toStrictEqual(2);
    expect(result.docs.map(d => d.foo)).toStrictEqual(['foo 3', 'foo 2']);
});

it('finds distinct values', async () => {
    // prepare
    const collectionQuery = new CollectionQuery(ctx.payload);

    await collectionQuery.create('foo 1');
    await collectionQuery.create('foo 1');
    await collectionQuery.create('foo 2');
    await collectionQuery.create('foo 3');
    await collectionQuery.create('foo 3');
    await collectionQuery.create('foo 4');

    // test
    const result = await collectionQuery.findDistinct();

    // verify
    expect(result.totalDocs).toStrictEqual(4);
    expect(result.values.map(d => d.foo)).toStrictEqual(['foo 1', 'foo 2', 'foo 3', 'foo 4']);
});

it('finds a version by its id', async () => {
    // prepare
    const collectionQuery = new CollectionQuery(ctx.payload);

    const created = await collectionQuery.create('foo 1');
    await collectionQuery.updateById(created.id, 'foo 2');
    await collectionQuery.updateById(created.id, 'foo 3');

    // test
    const secondVersion = await collectionQuery.findVersions().then(page => page.docs[1]);
    const result = await collectionQuery.findVersionById(secondVersion.id);

    // verify
    expect(result.version.foo).toStrictEqual('foo 2');
});
