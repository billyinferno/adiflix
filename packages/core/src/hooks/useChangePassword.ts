import { getApi } from '../api/getApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';

export interface ChangePasswordParams {
    userId: string;
    currentPassword?: string;
    newPassword: string;
}

export function useChangePassword() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (input: ChangePasswordParams) => {
            const api = getApi();
            const userApi = getUserApi(api);
            
            const userId = input.userId;
            if (!userId) {
                throw new Error('User ID is missing');
            }
            
            await userApi.updateUserPassword({
                userId,
                updateUserPassword: {
                    CurrentPw: input.currentPassword || '',
                    NewPw: input.newPassword,
                },
            });
        },
        onSuccess: () => {
            // Invalidate current user query cache so the app syncs updated user data
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}