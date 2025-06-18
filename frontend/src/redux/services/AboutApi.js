


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aboutApi = createApi({
  reducerPath: 'aboutApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3003/api/' }),
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => 'about',
    }),
    updateAbout: builder.mutation({
      query: (formData) => ({
        url: 'about',
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;