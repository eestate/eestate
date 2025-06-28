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
      query: ({ search = "", role = "all" }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (role.toLowerCase() !== "all roles")
          params.append("role", role.toLowerCase());

        return `/allUsers?${params.toString()}`;
      },
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

    editSubscription: builder.mutation({
      query: (planData) => {
        const { _id, planName, amount, period, features, color } = planData;

        console.log("RTK plan data and id received:", planData);
        return {
          url: `/editSubscription/${_id}`,
          method: "PUT",
          body: { planName, amount, period, features, color },
        };
      },
      invalidatesTags: ["EditSubscriptions"],
    }),

    deleteSubscription: builder.mutation({
      query: (planId) => {
        console.log("delete plan id received", planId);
        return {
          url: `deletePlan/${planId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Subscriptions"],
    }),

    getAllSubscriptions: builder.query({
      query: () => "/getSubscriptions",
      providesTags: ["Subscriptions"],
    }),

    getAllActiveUsers: builder.query({
      query: () => "/getAllActiveUsers",
      providesTags: ["Activeusers"],
    }),
    getAllviews: builder.query({
      query: () => "/getAllViews",
      providesTags: ["totalviwersCount"],
    }),

    getTotalProperties: builder.query({
      query: () => "/getTotalProperties",
      providesTags: ["TotalProperty"],
    }),

    getTotalRevenue: builder.query({
      query: () => "/revenue",
      providesTags:["Totalrevenue"]
      }),

    getAllProperties: builder.query({
      query: () => "/allProperties",
      providesTags: ["allProperties"],
    }),

    getAllBookings: builder.query({
      query: () => "/allBookings",
      providesTags: ["allEnquiri-Bookings"],
    }),
    searchAndFilterBookings: builder.query({
      query: ({ search = "", status = "all" }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status.toLowerCase() !== "all")
          params.append("status", status.toLowerCase());
        console.log("Booking search params:", params.toString()); // Debug log
        return `/searchBookings?${params.toString()}`;
      },
      providesTags: ["allEnquiri-Bookings"],
      transformErrorResponse: (response) => {
        console.error("Booking search error:", response);
        return response;
      },
    }),
    getMonthlyDashboardStats: builder.query({
      query: () => "/monthly-stats",
      providesTags: ["dashboard-chart"],
    }),
    getTopPerfomingAgents: builder.query({
      query: () => "/top-agents",
      providesTags: ["topagents"],
    }),

    searchAndFilterProperties: builder.query({
      query: ({ search = "", status = "all" }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status.toLowerCase() !== "all")
          params.append("status", status.toLowerCase());
        return `/searchProperties?${params.toString()}`;
      },
      providesTags: ["allProperties"],
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
  useEditSubscriptionMutation,
  useGetAllActiveUsersQuery,
  useGetTotalPropertiesQuery,
  useDeleteSubscriptionMutation,
  useGetAllPropertiesQuery,
  useGetAllBookingsQuery,
  useGetMonthlyDashboardStatsQuery,
  useGetAllviewsQuery,
  useGetTopPerfomingAgentsQuery,
  useSearchAndFilterPropertiesQuery,
  useSearchAndFilterBookingsQuery,
  useGetTotalRevenueQuery
} = adminApi;
