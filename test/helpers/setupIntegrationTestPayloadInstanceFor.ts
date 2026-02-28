import {getPayloadTestInstance} from '@test/helpers/getPayloadTestInstance';
import type {BasePayload, CollectionSlug} from 'payload';
import {afterAll, beforeAll, beforeEach} from 'vitest';

export const setupIntegrationTestPayloadInstanceFor = (collections: CollectionSlug[]) => {
    let payload: BasePayload;

    beforeAll(async () => {
        payload = await getPayloadTestInstance();
    });

    beforeEach(async () => {
        for (const collection of collections) {
            await payload.delete({collection, where: {}});
        }
    });

    afterAll(async () => {
        for (const collection of collections) {
            await payload.delete({collection, where: {}});
        }
    });

    return {
        get payload() {
            return payload;
        },
    };
};
