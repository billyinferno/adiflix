import { getApi } from '../api/getApi';
import type { BaseItemDto, ItemFilter, ItemSortBy, SortOrder } from '@jellyfin/sdk/lib/generated-client/models';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import { useQuery } from '@tanstack/react-query';

interface StudioItemsOptions {
    sortBy?: ItemSortBy[];
    sortOrder?: SortOrder[];
    limit?: number;
    startIndex?: number;
    filters?: string;
}

interface StudioItemsResponse {
    items: BaseItemDto[];
    totalCount: number;
}

export function useStudioItems(studioId: string, options?: StudioItemsOptions) {
    return useQuery<StudioItemsResponse>({
        queryKey: ['studio-items', studioId, options],
        queryFn: async () => {
            const api = getApi();
            const itemsApi = getLibraryApi(api);

            const itemsResponse = await itemsApi.getItems({
                studioIds: [studioId],
                includeItemTypes: ['Movie', 'Series'],
                recursive: true,
                excludeItemTypes: ['CollectionFolder'],
                sortBy: options?.sortBy ?? ['Random'],
                sortOrder: options?.sortOrder ?? ['Descending'],
                limit: options?.limit ?? 50,
                startIndex: options?.startIndex ?? 0,
                filters: options?.filters ? [options.filters as ItemFilter] : undefined,
            });

            return {
                items: (itemsResponse.data?.Items ?? []) as BaseItemDto[],
                totalCount: itemsResponse.data?.TotalRecordCount ?? 0,
            };
        },
        enabled: !!studioId,
    });
}
