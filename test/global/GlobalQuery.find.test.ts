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

    update(foo: string) {
        return this.repository.update({foo});
    }

    findVersions() {
        return this.repository.findVersions();
    }

    findVersionById(id: string) {
        return this.repository.findVersionById(id);
    }
}

it('finds the global', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);
    // test
    const result = await dummyQuery.find();

    // verify
    expect(result.id).toBeDefined;
    expect(result.foo).toStrictEqual('foo');
});

it('finds a version by its id', async () => {
    // prepare
    const dummyQuery = new DummyQuery(ctx.payload);

    await dummyQuery.update('foo 2');
    await dummyQuery.update('foo 3');

    // test
    const secondVersion = await dummyQuery.findVersions().then(page => page.docs[1]);
    const result = await dummyQuery.findVersionById(secondVersion.id);

    // verify
    expect(result.version.foo).toStrictEqual('foo 2');
});
