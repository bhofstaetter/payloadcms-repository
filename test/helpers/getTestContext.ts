import {getTestContextFor} from '@bhofstaetter/payloadcms-integration-test-utils';
import type {CollectionConfig, GlobalConfig} from 'payload';

const DummyCollection: CollectionConfig = {
    slug: 'dummies',
    versions: {drafts: true},
    fields: [
        {
            type: 'text',
            name: 'foo',
            required: true,
        },
        {
            type: 'number',
            name: 'bar',
        },
    ],
};

const DummyGlobal: GlobalConfig = {
    slug: 'dummy',
    typescript: {
        interface: 'DummyGlobal',
    },
    versions: {drafts: true},
    fields: [
        {
            type: 'text',
            name: 'foo',
            defaultValue: 'foo',
            required: true,
        },
        {
            type: 'number',
            name: 'bar',
        },
    ],
};

export const getTestContext = () =>
    getTestContextFor({
        collections: [DummyCollection],
        globals: [DummyGlobal],
        tsOutputFile: './test/helpers/payload.test.types.ts',
    });
