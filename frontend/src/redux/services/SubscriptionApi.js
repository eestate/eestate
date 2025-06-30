

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api',
    credentials: 'include',
   prepareHeaders: (headers) => {
  const token = Cookies.get('token'); 

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
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
    checkSubscription: builder.query({
      query: () => '/subscriptions/status',
    }),
    getActiveSubscriptions: builder.query({
      query: () => '/subscriptions/active',
      providesTags: ['Subscription'],
  }),
  }),
});

export const {
  useGetStripeProductsQuery,
  useCreateCheckoutSessionMutation,
  useVerifySubscriptionMutation,
  useCancelSubscriptionMutation,
  useCheckSubscriptionQuery ,
  useGetActiveSubscriptionsQuery,
} = subscriptionApi;