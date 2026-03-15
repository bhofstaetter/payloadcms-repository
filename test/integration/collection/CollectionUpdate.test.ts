import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionOperations} from '@/collection/CollectionOperations';

const ctx = getTestContext();

type UpdateParams = Parameters<CollectionUpdate['repository']['update']>;

class CollectionUpdate extends CollectionOperations<Config, 'dummies'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummies');
    }

    // methods just for the test setup, normally they do not belong here

    create(foo?: string) {
        return this.repository.create({foo: foo ?? 'foo'});
    }

    // update methods

    updateById(id: number, foo: string) {
        return this.repository.updateById(id, {foo});
    }

    updateByIds(ids: number[], foo: string) {
        return this.repository.updateByIds(ids, {foo});
    }

    update(where: UpdateParams[0], data: UpdateParams[1]) {
        return this.repository.update(where, data);
    }
}

it('updates a document by its id', async () => {
    // prepare
    const collectionUpdate = new CollectionUpdate(ctx.payload);
    const created = await collectionUpdate.create();

    // test
    const result = await collectionUpdate.updateById(created.id, 'new-foo');

    // verify
    expect(created.foo).toStrictEqual('foo');
    expect(result.foo).toStrictEqual('new-foo');
});

it('updates multiple documents by their ids', async () => {
    // prepare
    const collectionUpdate = new CollectionUpdate(ctx.payload);

    const created1 = await collectionUpdate.create();
    const created2 = await collectionUpdate.create();
    const created3 = await collectionUpdate.create();

    // test
    const result = await collectionUpdate.updateByIds([created1.id, created2.id, created3.id], 'new-foo');

    // verify
    expect(created1.foo).toStrictEqual('foo');
    expect(created2.foo).toStrictEqual('foo');
    expect(created3.foo).toStrictEqual('foo');

    expect(result.docs.map(d => d.foo)).toStrictEqual(['new-foo', 'new-foo', 'new-foo']);
});

it('updates documents by where query', async () => {
    // prepare
    const collectionUpdate = new CollectionUpdate(ctx.payload);

    const created1 = await collectionUpdate.create('foo 1');
    const created2 = await collectionUpdate.create('foo 2');
    const created3 = await collectionUpdate.create('foo 3');
    const created4 = await collectionUpdate.create('foo 3');

    // test
    const result = await collectionUpdate.update({foo: {equals: 'foo 3'}}, {bar: 99});

    // verify
    expect(created1.bar).toStrictEqual(null);
    expect(created2.bar).toStrictEqual(null);
    expect(created3.bar).toStrictEqual(null);
    expect(created4.bar).toStrictEqual(null);

    expect(result.docs.map(d => d.bar)).toStrictEqual([99, 99]);
});
