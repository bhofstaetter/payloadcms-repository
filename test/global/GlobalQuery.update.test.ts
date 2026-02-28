import type {Config} from '@test/helpers/payload.test.types';
import {setupIntegrationTestPayloadInstanceFor} from '@test/helpers/setupIntegrationTestPayloadInstanceFor';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {GlobalQuery} from '@/global/GlobalQuery';

const ctx = setupIntegrationTestPayloadInstanceFor(['dummies']);

class DummyQuery extends GlobalQuery<Config, 'dummy'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummy');
    }

    find() {
        return this.repository.find();
    }

    update(foo: string, bar: number) {
        return this.repository.update({foo, bar});
    }
}

it('updates the global', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    const original = await dummyQuery.find();

    // test
    const result = await dummyQuery.update('new-foo', 99);

    // verify
    expect(original.foo).toStrictEqual('foo');
    expect(original.bar).not.toBeDefined();
    expect(result.foo).toStrictEqual('new-foo');
    expect(result.bar).toStrictEqual(99);
});
