import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {postgresAdapter} from '@payloadcms/db-postgres';
import {type BasePayload, buildConfig, getPayload} from 'payload';
import {generateTypes} from 'payload/node';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

let cachedPayload: BasePayload | null = null;

export const getPayloadTestInstance = async () => {
    if (cachedPayload) {
        return cachedPayload;
    }

    const config = buildConfig({
        collections: [
            {
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
            },
        ],
        globals: [
            {
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
            },
        ],
        secret: process.env.PAYLOAD_SECRET || '',
        db: postgresAdapter({
            pool: {
                connectionString: process.env.DATABASE_URL || '',
            },
        }),
        typescript: {
            outputFile: path.resolve(dirname, 'payload.test.types.ts'),
        },
    });

    cachedPayload = await getPayload({config});
    await generateTypes(cachedPayload.config);

    return cachedPayload;
};
