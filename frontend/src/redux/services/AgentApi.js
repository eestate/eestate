import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/agent',
    credentials: 'include', // Ensure cookies are sent
    prepareHeaders: (headers, { getState }) => {
      console.log('Sending agent request with cookies:', document.cookie);
      return headers;
    },
  }),
  tagTypes: ['AgentStats', 'Properties'],
  endpoints: (builder) => ({
    getAgentStats: builder.query({
      query: () => 'stats',
      providesTags: ['AgentStats'],
    }),
    getMyProperties: builder.query({
      query: () => 'my',
      providesTags: ['Properties'],
    }),
    createProperty: builder.mutation({
      query: ({ propertyData, images }) => {
        const formData = new FormData();
        // Append property data
        Object.entries(propertyData).forEach(([key, value]) => {
          if (key === 'coordinates') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        // Append images
        images.forEach((image, index) => {
          formData.append('images', image);
        });
        return {
          url: '/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Properties', 'AgentStats'],
    }),
    editProperty: builder.mutation({
      query: ({ id, propertyData, images }) => {
        const formData = new FormData();
        // Append property data
        Object.entries(propertyData).forEach(([key, value]) => {
          if (key === 'coordinates' && value) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, value);
          }
        });
        // Append images
        images.forEach((image, index) => {
          formData.append('images', image);
        });
        return {
          url: `/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Properties', 'AgentStats'],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Properties', 'AgentStats'],
    }),
  }),
});

export const {
  useGetAgentStatsQuery,
  useGetMyPropertiesQuery,
  useCreatePropertyMutation,
  useEditPropertyMutation,
  useDeletePropertyMutation,
} = agentApi;