

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import Cookies from 'js-cookie';

// export const userApi = createApi({
//   reducerPath: 'userApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3003/api/user',
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//       const token = Cookies.get('token');
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getProfile: builder.query({
//       query: () => '/profile',
//       providesTags: ['Profile'],
//     }),
//     updateProfile: builder.mutation({
//       query: (formData) => ({
//         url: '/profile',
//         method: 'PUT',
//         body: formData,
//       }),
//       invalidatesTags: ['Profile'],
//     }),
//     getWishlist: builder.query({
//       query: () => '/wishlist',
//       transformResponse: (response) => Array.isArray(response) ? response : [],
//       providesTags: ['Wishlist'],
//     }),
//     addToWishlist: builder.mutation({
//       query: (propertyId) => ({
//         url: `/wishlist/${propertyId}`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Wishlist'],
//     }),
//     removeFromWishlist: builder.mutation({
//       query: (propertyId) => ({
//         url: `/wishlist/${propertyId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Wishlist'],
//     }),
//   }),
// });

// export const {
//   useGetProfileQuery,
//   useUpdateProfileMutation,
//   useGetWishlistQuery,
//   useAddToWishlistMutation,
//   useRemoveFromWishlistMutation,
// } = userApi;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/user',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // USER PROFILE
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // WISHLIST
    getWishlist: builder.query({
      query: () => '/wishlist',
      transformResponse: (response) => Array.isArray(response) ? response : [],
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (propertyId) => ({
        url: `/wishlist/${propertyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (propertyId) => ({
        url: `/wishlist/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // AGENTS LISTING
    getAgents: builder.query({
      query: ({ search, page, limit }) => ({
        url: '/agents',
        params: { search, page, limit },
      }),
    }),
    getAgentDetails: builder.query({
      query: (id) => `/agents/${id}`,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetAgentsQuery,
  useGetAgentDetailsQuery,
} = userApi;
