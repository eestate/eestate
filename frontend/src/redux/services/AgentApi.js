import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/agent',
    credentials: 'include',
    prepareHeaders: (headers) => {
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
        Object.entries(propertyData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'coordinates' || key === 'features') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });
        images.forEach((image) => {
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
        Object.entries(propertyData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'coordinates' || key === 'features') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });
        images.forEach((image) => {
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
        query: (id) => {
          console.log(`Sending DELETE request for property ID: ${id}`);
          return {
            url: `/${id}`,
            method: 'DELETE',
          };
        },
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(agentApi.util.invalidateTags(['Properties']));
          } catch (error) {
            console.error('Delete failed:', error);
          }
        },
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