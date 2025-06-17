import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3003/api/admin",
    credentials: "include",
    prepareHeaders: (headers) => {
      console.log("get all users details");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/allUsers",
      providesTags: ["Users"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/userDetails/${id}`,
      providesTags: ["Users"],
    }),

    AgentDetails: builder.query({
      query: (id) => `/agentDetails/${id}`,
      providesTags: ["Users"],
    }),

    blockAndUnblock: builder.mutation({
      query: ({ id, action }) => ({
        url: "/BlockAndUnblock",
        method: "PUT",
        body: { id, action },
      }),
    }),

    
    editSubscription :builder.mutation({
      query: (id,planData) => {
        const { planName, amount, period, features, color } = planData;

        console.log("RTK plan data received:", planData);
        return {
          url: `/editSubscription/${id}`,
          method: "PUT",
          body: { planName, amount, period, features, color },
        };
      },
      invalidatesTags: ["EditSubscriptions"],
    }),

    addSubscription: builder.mutation({
      query: (planData) => {
        const { planName, amount, period, features, color } = planData;

        console.log("RTK plan data received:", planData);
        return {
          url: "/addSubscription",
          method: "POST",
          body: { planName, amount, period, features, color },
        };
      },
      invalidatesTags: ["Subscriptions"], // Add tag to invalidate related queries
    }),

    

    getAllSubscriptions: builder.query({
      query: () => "/getSubscriptions",
      providesTags: ["Subscriptions"],
    }),

  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useBlockAndUnblockMutation,
  useAgentDetailsQuery,
  useAddSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useEditSubscriptionMutation          
} = adminApi;
