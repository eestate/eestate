
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3003/api/property' }),
  endpoints: (builder) => ({
    getPropertyImagesByCategory: builder.query({
      query: (category) => `category/${category}/images?limit=4`,
    }),
    getFeaturedProperties: builder.query({
      query: () => 'featured',
    }),
  }),
});

export const {
  useGetPropertyImagesByCategoryQuery ,
  useGetFeaturedPropertiesQuery,
} = propertyApi;