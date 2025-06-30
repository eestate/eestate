import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/content',
     credentials: "include",
    prepareHeaders: (headers) => {
         const token = Cookies.get('token');
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
    },
  }),
  tagTypes: ['ContactSubmission', 'TermsAndConditions', 'HelpFAQ', 'PrivacyPolicy'],
  endpoints: (builder) => ({
    // Contact Submission Endpoints
    createContactSubmission: builder.mutation({
      query: (submission) => ({
        url: '/contact',
        method: 'POST',
        body: submission,
      }),
      invalidatesTags: ['ContactSubmission'],
    }),
    getContactSubmissions: builder.query({
      query: () => '/contact',
      providesTags: ['ContactSubmission'],
    }),
    updateContactSubmission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/contact/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContactSubmission'],
    }),
    deleteContactSubmission: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContactSubmission'],
    }),

    // Terms and Conditions Endpoints
    createTermsAndConditions: builder.mutation({
      query: (terms) => ({
        url: '/terms',
        method: 'POST',
        body: terms,
      }),
      invalidatesTags: ['TermsAndConditions'],
    }),
    getTermsAndConditions: builder.query({
      query: () => '/terms',
      providesTags: ['TermsAndConditions'],
    }),
    updateTermsAndConditions: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/terms/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['TermsAndConditions'],
    }),
    deleteTermsAndConditions: builder.mutation({
      query: (id) => ({
        url: `/terms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TermsAndConditions'],
    }),

    // Help FAQ Endpoints
    createHelpFAQ: builder.mutation({
      query: (faq) => ({
        url: '/faq',
        method: 'POST',
        body: faq,
      }),
      invalidatesTags: ['HelpFAQ'],
    }),
    getHelpFAQs: builder.query({
      query: () => '/faq',
      providesTags: ['HelpFAQ'],
    }),
    updateHelpFAQ: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faq/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['HelpFAQ'],
    }),
    deleteHelpFAQ: builder.mutation({
      query: (id) => ({
        url: `/faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HelpFAQ'],
    }),

    // Privacy Policy Endpoints
    createPrivacyPolicy: builder.mutation({
      query: (policy) => ({
        url: '/privacy',
        method: 'POST',
        body: policy,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
    getPrivacyPolicy: builder.query({
      query: () => '/privacy',
      providesTags: ['PrivacyPolicy'],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/privacy/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
    deletePrivacyPolicy: builder.mutation({
      query: (id) => ({
        url: `/privacy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
  }),
});

export const {
  useCreateContactSubmissionMutation,
  useGetContactSubmissionsQuery,
  useUpdateContactSubmissionMutation,
  useDeleteContactSubmissionMutation,
  useCreateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useDeleteTermsAndConditionsMutation,
  useCreateHelpFAQMutation,
  useGetHelpFAQsQuery,
  useUpdateHelpFAQMutation,
  useDeleteHelpFAQMutation,
  useCreatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useDeletePrivacyPolicyMutation,
} = contentApi;