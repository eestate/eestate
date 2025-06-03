import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3003/api/auth',
        credentials: 'include', // Ensure cookies are sent
        prepareHeaders: (headers, { getState }) => {
            // Debug: Log if cookie is included
            console.log('Sending request with cookies:', document.cookie);
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
                credentials: 'include'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(api.util.resetApiState());
                    localStorage.removeItem('user');
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
            invalidatesTags: ['Auth']
        }),
        checkAuth: builder.query({
            query: () => 'check',
            providesTags: ['Auth']
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: 'profile',
                method: 'PUT',
                body: profileData,
                credentials: 'include'
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