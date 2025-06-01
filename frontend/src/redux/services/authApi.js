// features/auth/authApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3003/api/auth',
        credentials: 'include', // For cookies
        prepareHeaders: (headers, { getState }) => {
            // If you need to add headers, do it here
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials
            }),
            transformResponse: (response) => {
                // Store user data in localStorage if needed
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                return response;
            }
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST',
                credentials: 'include' // Important for cookies
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Clear all cached data
                    dispatch(api.util.resetApiState());
                    // Remove user data from localStorage
                    localStorage.removeItem('user');
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
            invalidatesTags: ['Auth'] // Invalidate all auth-related cache
        }),
        checkAuth: builder.query({
            query: () => 'check',
            providesTags: ['Auth']
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: 'profile',
                method: 'PUT',
                body: profileData
            }),
            invalidatesTags: ['Auth']
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useCheckAuthQuery,
    useUpdateProfileMutation
} = authApi;