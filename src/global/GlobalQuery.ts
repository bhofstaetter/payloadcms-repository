import type {BasePayload, GlobalSlug} from 'payload';
import type {AnyGlobalConfig} from '@/types';
import {GlobalRepository} from './GlobalRepository';

export abstract class GlobalQuery<TConfig extends AnyGlobalConfig, TSlug extends GlobalSlug> {
    protected readonly repository: GlobalRepository<TConfig, TSlug>;

    protected constructor(payload: BasePayload, globalSlug: TSlug) {
        this.repository = new GlobalRepository(payload, globalSlug);
    }
}
