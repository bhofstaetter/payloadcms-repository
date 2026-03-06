import {getTestContext} from '@test/helpers/getTestContext';
import type {Config} from '@test/helpers/payload.test.types';
import type {BasePayload} from 'payload';
import {expect, it} from 'vitest';
import {GlobalOperations} from '@/global/GlobalOperations';

const ctx = getTestContext();

class GlobalQuery extends GlobalOperations<Config, 'dummy'> {
    constructor(payload: BasePayload) {
        super(payload, 'dummy');
    }

    // methods just for the test setup, normally they do not belong here

    update(foo: string) {
        return this.repository.update({foo});
    }

    // count methods

    countVersions() {
        return this.repository.countVersions();
    }
}

it('counts all versions', async () => {
    // prepare
    const globalQuery = new GlobalQuery(ctx.payload);
    const initVersionCount = await globalQuery.countVersions().then(page => page.totalDocs);

    await globalQuery.update('foo 2');
    await globalQuery.update('foo 3');

    // test
    const result = await globalQuery.countVersions();

    // verify
    expect(result.totalDocs).toStrictEqual(initVersionCount + 2);
});
