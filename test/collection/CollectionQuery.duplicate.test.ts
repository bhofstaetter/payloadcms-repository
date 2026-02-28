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

    create() {
        return this.repository.create({foo: 'foo'});
    }

    duplicate(id: number) {
        return this.repository.duplicate(id);
    }

    duplicateWithOverrides(id: number) {
        return this.repository.duplicate(id, {draft: true, data: {bar: 2}});
    }
}

it('duplicates a document', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    const created = await dummyQuery.create();

    // test
    const duplicated = await dummyQuery.duplicate(created.id);

    // verify
    expect(created.id).toBeDefined();
    expect(duplicated.id).toBeDefined();

    expect(duplicated.id).not.toStrictEqual(created.id);

    expect(duplicated._status).toStrictEqual(created._status);
    expect(duplicated.foo).toStrictEqual(duplicated.foo);
});

it('duplicates a document with overrides', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    const created = await dummyQuery.create();

    // test
    const duplicated = await dummyQuery.duplicateWithOverrides(created.id);

    // verify
    expect(created.id).toBeDefined();
    expect(duplicated.id).toBeDefined();

    expect(duplicated.id).not.toStrictEqual(created.id);

    expect(created._status).toStrictEqual('published');
    expect(duplicated._status).toStrictEqual('draft');

    expect(created.bar).toStrictEqual(null);
    expect(duplicated.bar).toStrictEqual(2);
});
