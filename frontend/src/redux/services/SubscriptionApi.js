

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api',
    prepareHeaders: (headers) => {

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStripeProducts: builder.query({
      query: () => '/subscriptions/products',
      providesTags: ['Subscription'],
    }),

    createCheckoutSession: builder.mutation({
      query: ({ planName, userId }) => ({
        url: '/subscriptions/create-checkout-session',
        method: 'POST',
        body: { planName, userId },
      }),
      invalidatesTags: ['Subscription'],
    }),

    verifySubscription: builder.mutation({
      query: (body) => ({
        url: '/subscriptions/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    cancelSubscription: builder.mutation({
      query: (body) => ({
        url: '/subscriptions/cancel',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetStripeProductsQuery,
  useCreateCheckoutSessionMutation,
  useVerifySubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;