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
  query: (filters) => {
    // Debug the incoming filters
    console.log('API Request Filters:', JSON.stringify(filters, null, 2));
    
    // Prepare the params object
    const params = {
      state_district: filters.state_district || undefined,
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
    };

    // Debug the final params being sent
    console.log('Final Request Params:', JSON.stringify(params, null, 2));

    return {
      url: "",
      params: params
    };
  },
  transformResponse: (response) => {
    console.log('API Response:', response); // Debug the raw response
    return {
      properties: Array.isArray(response.properties) ? response.properties : [],
      page: response.page || 1,
      pages: response.pages || 1,
      total: response.total || 0,
    };
  },
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
        getDistrictSuggestions: builder.query({
      query: ({ state_district, propertyType }) => ({
        url: "/suggestions",
        params: {
          state_district: state_district || undefined,
          propertyType: propertyType || undefined,
        },
      }),
      transformResponse: (response) => response,
      providesTags: ["Suggestions"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetSimilarPropertiesQuery,
  useGetDistrictSuggestionsQuery
} = propertyApi;
