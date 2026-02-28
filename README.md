# payload-repository

Opinionated repository and query object wrapper around Payload's local API.

## Installation

```sh
npm install @bhofstaetter/payloadcms-repository
```

## Usage

Pass your generated Payload `Config` type as the first type argument to get full type safety on fields, select, and return types.

### CollectionQuery

Extend `CollectionQuery` to encapsulate domain-specific query logic for a collection:

```ts
import type {BasePayload} from 'payload';
import type {Config} from '@/payload-types';
import {CollectionQuery} from '@bhofstaetter/payloadcms-repository';

class PostsQuery extends CollectionQuery<Config, 'posts'> {
    constructor(payload: BasePayload) {
        super(payload, 'posts');
    }

    create(title: string) {
        return this.repository.create({title});
    }

    findAll() {
        return this.repository.find();
    }

    findById(id: number) {
        return this.repository.findById(id);
    }

    findPublished() {
        return this.repository.find({where: {status: {equals: 'published'}}});
    }

    publish(id: number) {
        return this.repository.updateById(id, {status: 'published'});
    }

    deleteById(id: number) {
        return this.repository.deleteById(id);
    }
}

// Usage
const postsQuery = new PostsQuery(payload);

const post = await postsQuery.create('Hello World');
const published = await postsQuery.findPublished();
await postsQuery.publish(post.id);
```

### GlobalQuery

Extend `GlobalQuery` to encapsulate domain-specific query logic for a global:

```ts
import type {BasePayload} from 'payload';
import type {Config} from '@/payload-types';
import {GlobalQuery} from '@bhofstaetter/payloadcms-repository';

class SettingsQuery extends GlobalQuery<Config, 'settings'> {
    constructor(payload: BasePayload) {
        super(payload, 'settings');
    }

    get() {
        return this.repository.find();
    }

    setSiteTitle(title: string) {
        return this.repository.update({siteTitle: title});
    }
}

// Usage
const settingsQuery = new SettingsQuery(payload);

const settings = await settingsQuery.get();
await settingsQuery.setSiteTitle('My Site');
```

## License

MIT

## Todo

- [ ] Github Actions
- [ ] Publish to NPM
