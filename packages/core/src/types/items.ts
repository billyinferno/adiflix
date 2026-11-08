import type { BaseItemDto, ItemFilter, ItemSortBy, SortOrder } from '@jellyfin/sdk/lib/generated-client/models';

export interface ItemsQueryParams {
    sortBy: ItemSortBy[];
    sortOrder: SortOrder[];
    filters?: ItemFilter[];
    limit: number;
    startIndex: number;
}

export interface ItemsQueryResult {
    data:
        | {
              items?: BaseItemDto[] | null;
              totalCount?: number | null;
          }
        | undefined;
    isLoading: boolean;
    error: unknown;
}
