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

    update(foo: string) {
        return this.repository.update({foo});
    }

    countVersions() {
        return this.repository.countVersions();
    }
}

it('counts all versions', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.update('foo 2');
    await dummyQuery.update('foo 3');

    // test
    const result = await dummyQuery.countVersions();

    // verify
    expect(result.totalDocs).toStrictEqual(2);
});
