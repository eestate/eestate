import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/chat',
    credentials: 'include',
  }),
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/conversations',
      providesTags: ['Chats'],
    }),
    startConversation: builder.mutation({
      query: ({ participantId, propertyId }) => ({
        url: '/conversations',
        method: 'POST',
        body: { participantId, propertyId },
      }),
      invalidatesTags: ['Chats', 'Messages'],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
        { type: 'Messages', id: 'LIST' },
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Messages', 'Chats'],
    }),
    sendTextMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: `/conversations/${conversationId}/messages/text`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Messages', 'Chats'],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendTextMessageMutation,
} = chatApi;