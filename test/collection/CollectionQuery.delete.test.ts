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

    create(foo?: string) {
        return this.repository.create({foo: foo ?? 'foo'});
    }

    findById(id: number) {
        return this.repository.findById(id);
    }

    deleteById(id: number) {
        return this.repository.deleteById(id);
    }

    deleteByIds(ids: number[]) {
        return this.repository.deleteByIds(ids);
    }

    delete(where: Parameters<DummyQuery['repository']['delete']>[0]) {
        return this.repository.delete(where);
    }
}

it('deletes a document by its id', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    const created = await dummyQuery.create();

    // test
    await dummyQuery.deleteById(created.id);

    // verify
    expect(created.id).toBeDefined();
    await expect(dummyQuery.findById(created.id)).rejects.toThrow('Not Found');
});

it('deletes multiple documents by their ids', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    const created1 = await dummyQuery.create();
    const created2 = await dummyQuery.create();
    const created3 = await dummyQuery.create();

    // test
    await dummyQuery.deleteByIds([created1.id, created2.id, created3.id]);

    // verify
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
    expect(created3.id).toBeDefined();

    await expect(dummyQuery.findById(created1.id)).rejects.toThrow('Not Found');
    await expect(dummyQuery.findById(created2.id)).rejects.toThrow('Not Found');
    await expect(dummyQuery.findById(created3.id)).rejects.toThrow('Not Found');
});

it('deletes documents by where query', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    const created1 = await dummyQuery.create('foo 1');
    const created2 = await dummyQuery.create('foo 2');
    const created3 = await dummyQuery.create('foo 3');
    const created4 = await dummyQuery.create('foo 3');

    // test
    await dummyQuery.delete({foo: {equals: 'foo 3'}});

    // verify
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
    expect(created3.id).toBeDefined();
    expect(created4.id).toBeDefined();

    await expect(dummyQuery.findById(created1.id)).resolves.not.toThrow();
    await expect(dummyQuery.findById(created2.id)).resolves.not.toThrow();

    await expect(dummyQuery.findById(created3.id)).rejects.toThrow('Not Found');
    await expect(dummyQuery.findById(created4.id)).rejects.toThrow('Not Found');
});
