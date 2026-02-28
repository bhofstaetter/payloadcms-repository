import {PostgreSqlContainer, type StartedPostgreSqlContainer} from '@testcontainers/postgresql';

let container: StartedPostgreSqlContainer;

export const setup = async () => {
    container = await new PostgreSqlContainer('postgres:18.2-alpine').start();

    process.env.DATABASE_URL = container.getConnectionUri();
    process.env.PAYLOAD_SECRET = 'test-secret-for-integration-tests';
};

export const teardown = async () => {
    await container?.stop();
};
