


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api',
    credentials: 'include', 
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['Bookings', 'Property'],
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getAgentBookings: builder.query({
      query: (agentId) => `/bookings/agent/${agentId}`,
      providesTags: ['Bookings'],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`, // Corrected URL
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetAgentBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingApi;