import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3003/api/property",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (filters) => ({
        url: "",
        params: {
          propertyType: filters.propertyType || undefined,
          slug: filters.slug || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          bed: filters.bed || undefined,
          bathMin: filters.bathMin || undefined,
          maxSqft: filters.maxSqft || undefined,
          keyword: filters.keyword || undefined,
          page: filters.page || 1,
          limit: filters.limit || 9,
        },
      }),
      transformResponse: (response) => ({
        properties: Array.isArray(response.properties)
          ? response.properties
          : [],
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
      }),
      providesTags: ["Properties"],
    }),
    getProperty: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),
    getSimilarProperties: builder.query({
      query: ({ propertyType, excludeId }) => ({
        url: "",
        params: {
          propertyType,
          exclude: excludeId,
          limit: 4,
        },
      }),
      transformResponse: (response) => ({
        properties: Array.isArray(response.properties)
          ? response.properties
          : [],
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
      }),
      providesTags: ["Properties"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetSimilarPropertiesQuery,
} = propertyApi;
