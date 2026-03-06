import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {CollectionOperations} from '@/collection/CollectionOperations';

const ctx = getTestContext();

class CollectionDelete extends CollectionOperations<Config, 'dummies'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummies');
    }

    // methods just for the test setup, normally they do not belong here
    create(foo?: string) {
        return this.repository.create({foo: foo ?? 'foo'});
    }

    findById(id: number) {
        return this.repository.findById(id);
    }

    // delete methods
    deleteById(id: number) {
        return this.repository.deleteById(id);
    }

    deleteByIds(ids: number[]) {
        return this.repository.deleteByIds(ids);
    }

    delete(where: Parameters<CollectionDelete['repository']['delete']>[0]) {
        return this.repository.delete(where);
    }
}

it('deletes a document by its id', async () => {
    // prepare
    const collectionDelete = new CollectionDelete(ctx.payload);
    const created = await collectionDelete.create();

    // test
    await collectionDelete.deleteById(created.id);

    // verify
    expect(created.id).toBeDefined();
    await expect(collectionDelete.findById(created.id)).rejects.toThrow('Not Found');
});

it('deletes multiple documents by their ids', async () => {
    // prepare
    const collectionDelete = new CollectionDelete(ctx.payload);
    const created1 = await collectionDelete.create();
    const created2 = await collectionDelete.create();
    const created3 = await collectionDelete.create();

    // test
    await collectionDelete.deleteByIds([created1.id, created2.id, created3.id]);

    // verify
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
    expect(created3.id).toBeDefined();

    await expect(collectionDelete.findById(created1.id)).rejects.toThrow('Not Found');
    await expect(collectionDelete.findById(created2.id)).rejects.toThrow('Not Found');
    await expect(collectionDelete.findById(created3.id)).rejects.toThrow('Not Found');
});

it('deletes documents by where query', async () => {
    // prepare
    const collectionDelete = new CollectionDelete(ctx.payload);

    const created1 = await collectionDelete.create('foo 1');
    const created2 = await collectionDelete.create('foo 2');
    const created3 = await collectionDelete.create('foo 3');
    const created4 = await collectionDelete.create('foo 3');

    // test
    await collectionDelete.delete({foo: {equals: 'foo 3'}});

    // verify
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
    expect(created3.id).toBeDefined();
    expect(created4.id).toBeDefined();

    await expect(collectionDelete.findById(created1.id)).resolves.not.toThrow();
    await expect(collectionDelete.findById(created2.id)).resolves.not.toThrow();

    await expect(collectionDelete.findById(created3.id)).rejects.toThrow('Not Found');
    await expect(collectionDelete.findById(created4.id)).rejects.toThrow('Not Found');
});
