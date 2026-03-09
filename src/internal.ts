export type {
    CollectionCountVersionsOptions,
    CountOptions,
    CountResult,
    CountVersionsResult as CollectionCountVersionsResult,
    CreateOptions,
    DeleteOptions,
    DraftDataFromCollectionSlug,
    DuplicateOptions,
    FindByIdOptions,
    FindDistinctOptions,
    FindOptions,
    FindVersionByIdOptions,
    FindVersionsOptions,
    PaginatedSelectResult,
    SelectResult,
    TypedSelect,
    UpdateByIdOptions,
    UpdateData,
    UpdateOptions,
} from '@/collection/CollectionRepository.js';

export type {
    CountVersionsResult as GlobalCountVersionsResult,
    FindGlobalOptions,
    FindGlobalVersionByIdOptions,
    FindGlobalVersionsOptions,
    GlobalCountVersionsOptions,
    GlobalSelectResult,
    TypedGlobalSelect,
    UpdateGlobalData,
    UpdateGlobalOptions,
} from '@/global/GlobalRepository.js';

export type {AnyCollectionConfig, AnyGlobalConfig} from '@/types.js';
