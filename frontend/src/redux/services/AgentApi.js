/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3003/api/agent",
    credentials: "include",
    prepareHeaders: (headers) => {
      console.log("Sending agent request with cookies:", document.cookie);
      return headers;
    },
  }),
  tagTypes: ["AgentStats", "Properties"],
  endpoints: (builder) => ({
    getAgentStats: builder.query({
      query: () => "stats",
      providesTags: ["AgentStats"],
    }),
    getMyProperties: builder.query({
      query: () => "my",
      providesTags: ["Properties"],
    }),
    createProperty: builder.mutation({
      query: ({ propertyData, images }) => {
        const formData = new FormData();
        Object.entries(propertyData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "latitude" || key === "longitude") {
              formData.append(key, value.toString());
            } else if (key === "features") {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "boolean") {
              formData.append(key, value.toString());
            } else {
              formData.append(key, value);
            }
          }
        });
        images.forEach((image, index) => {
          formData.append("images", image);
        });

        // Log FormData for debugging
        for (let [key, value] of formData.entries()) {
          console.log(`FormData: ${key} = ${value}`);
        }

        return {
          url: "/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Properties", "AgentStats"],
    }),
    editProperty: builder.mutation({
      query: ({ id, propertyData, images }) => {
        const formData = new FormData();
        Object.entries(propertyData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "features" || key === "existingImages") {
              formData.append(key, JSON.stringify(value));
            } else if (
              key === "latitude" ||
              key === "longitude" ||
              typeof value === "boolean"
            ) {
              formData.append(key, value.toString());
            } else {
              formData.append(key, value);
            }
          }
        });
        images.forEach((image) => {
          formData.append("images", image);
        });

        for (let [key, value] of formData.entries()) {
          console.log(`FormData: ${key} = ${value}`);
        }

        return {
          url: `/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Properties", "AgentStats"],
    }),
    deleteProperty: builder.mutation({
      query: (id) => {
        console.log(`Sending DELETE request for property ID: ${id}`);
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(agentApi.util.invalidateTags(["Properties", "AgentStats"]));
        } catch (error) {
          console.error("Delete failed:", {
            status: error.status,
            data: error.data,
            message: error.message,
          });
        }
      },
      invalidatesTags: ["Properties", "AgentStats"],
    }),
 changePropertyStatus: builder.mutation({
  query: ({ id, status }) => ({
    url: `/${id}/status`,
    method: "PATCH",
  }),
  invalidatesTags: ["Properties", "AgentStats"],
}),   
    sendMail: builder.mutation({
      query: ({ enquiryId, status }) => {
        console.log("enquiry id and status recived", enquiryId, status);
        return {
          url: `/sendMail`,
          method: "POST",
          body: {
            enquiryId,
            status,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAgentStatsQuery,
  useGetMyPropertiesQuery,
  useCreatePropertyMutation,
  useEditPropertyMutation,
  useDeletePropertyMutation,
  useChangePropertyStatusMutation,
  useSendMailMutation
} = agentApi;
