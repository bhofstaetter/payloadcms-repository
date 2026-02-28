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

    createDraft() {
        return this.repository.create({bar: 1}, {draft: true});
    }
}

it('creates a published document', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    // test
    const created = await dummyQuery.create();

    // verify
    expect(created.id).toBeDefined();
    expect(created.foo).toStrictEqual('foo');
    expect(created.bar).toStrictEqual(null);
    expect(created._status).toStrictEqual('published');
});

it('creates a draft document', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    // test
    const created = await dummyQuery.createDraft();

    // verify
    expect(created.id).toBeDefined();
    expect(created.foo).toStrictEqual(null);
    expect(created.bar).toStrictEqual(1);
    expect(created._status).toStrictEqual('draft');
});
