# Payload Repository and Operations

Opinionated repository and operations object wrapper around Payload's Local API.

## Installation

```sh
npm install payload-repository
```

## Usage

Pass your generated Payload `Config` type as the first type argument to get full type safety on fields, select, and return types.

### CollectionOperations

Extend `CollectionOperations` to encapsulate domain-specific operations logic for a collection:

```ts
import type {BasePayload} from 'payload';
import type {Config} from '@/payload-types';
import {CollectionOperations} from 'payload-repository';

class PostsOperations extends CollectionOperations<Config, 'posts'> {
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
const postsOperations = new PostsOperations(payload);

const post = await postsOperations.create('Hello World');
const published = await postsOperations.findPublished();
await postsOperations.publish(post.id);
```

### GlobalOperations

Extend `GlobalOperations` to encapsulate domain-specific operations logic for a global:

```ts
import type {BasePayload} from 'payload';
import type {Config} from '@/payload-types';
import {GlobalOperations} from 'payload-repository';

class SettingsOperations extends GlobalOperations<Config, 'settings'> {
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
const settingsOperations = new SettingsOperations(payload);

const settings = await settingsOperations.get();
await settingsOperations.setSiteTitle('My Site');
```

### Transformers

Transformers are optional middleware functions that intercept and modify arguments before they reach the Payload API. They can transform `data`, `where` clauses, and `options` on a per-operation basis.

Pass transformers as the third argument to `CollectionOperations` or `GlobalOperations`:

```ts
import type {BasePayload} from 'payload';
import type {Config} from '@/payload-types';
import {CollectionOperations, type CollectionTransformers} from 'payload-repository';

const tenantTransformers = (tenantId: number): CollectionTransformers<Config, 'posts'> => ({
    create: {
        data: data => ({...data, tenant: tenantId}),
    },
    find: {
        where: where => ({...where, tenant: {equals: tenantId}}),
    },
    update: {
        data: data => ({...data, tenant: tenantId}),
        where: where => ({...where, tenant: {equals: tenantId}}),
    },
    delete: {
        where: where => ({...where, tenant: {equals: tenantId}}),
    },
});

class PostsOperations extends CollectionOperations<Config, 'posts'> {
    constructor(payload: BasePayload, tenantId: number) {
        super(payload, 'posts', tenantTransformers(tenantId));
    }

    create(title: string) {
        return this.repository.create({title});
    }

    findAll() {
        return this.repository.find();
    }
}

// Usage
const tenantPosts = new PostsOperations(payload, 42);

// tenant is automatically injected into the data
await tenantPosts.create('Hello World');

// tenant where clause is automatically applied
const posts = await tenantPosts.findAll();
```

Transformers support async functions and are available for all repository operations.

## License

MIT

## Todo

- [ ] Github Actions
