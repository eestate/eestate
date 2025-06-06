
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/chat',
    credentials: 'include', // Include cookies in requests
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      console.log('Sending chat request with cookies:', document.cookie);
      return headers;
    },
  }),
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/chats',
      providesTags: ['Chats'],
    }),
    getMessages: builder.query({
      query: (chatId) => `/messages/${chatId}`,
      providesTags: (result, error, chatId) => [{ type: 'Messages', id: chatId }],
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, text, image }) => {
        const formData = new FormData();
        if (text && text.trim()) {
          formData.append('text', text);
        }
        if (image) {
          formData.append('image', image);
        }
        return {
          url: `/messages/${chatId}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { chatId }) => [
        'Chats',
        { type: 'Messages', id: chatId },
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;