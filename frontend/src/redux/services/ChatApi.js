import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getCurrentUserId = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  return userData?._id;
};

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/chat',
    credentials: 'include',
  }),
  tagTypes: ['Chats', 'Messages', 'AgentChats'],
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/conversations',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Chats', id: _id })),
              { type: 'Chats', id: 'LIST' },
            ]
          : [{ type: 'Chats', id: 'LIST' }],
transformResponse: (response) => {
        console.log('getChats raw response:', response); // Debug log
        return response.map((chat) => {
          const otherParticipant = chat.otherParticipant || {};
          return {
            ...chat,
            // Use otherParticipant fields
            name: otherParticipant.name || 'Unknown User',
            profilePic: otherParticipant.profilePic || null,
            // Use properties[0] as displayProperty
            displayProperty: chat.isAgentConversation
              ? chat.properties?.[0]
              : chat.properties?.[0] || null,
            // Update title
            title: chat.isAgentConversation
              ? `Chat with ${otherParticipant.name || 'Agent'}`
              : `Chat about ${chat.properties?.[0]?.title || 'Property'}`,
          };
        });
      },
    }),

    // Get agent-specific chats (for agent dashboard)
    getAgentChats: builder.query({
      query: () => '/conversations?agent=true',
      providesTags: ['AgentChats'],
    }),

    startConversation: builder.mutation({
      query: ({ participantId, propertyId, isAgent }) => ({
        url: '/conversations',
        method: 'POST',
        body: { participantId, propertyId, isAgent },
      }),
      invalidatesTags: ['Chats', 'AgentChats'],
    }),

    getMessages: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
        { type: 'Messages', id: 'LIST' },
      ],
      transformResponse: (response) => {
        // Add any message transformations if needed
        return response.map(message => ({
          ...message,
          isImage: !!message.image,
        }));
      },
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, formData }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted({ conversationId }, { dispatch, queryFulfilled }) {
        // Optimistic update logic
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages', conversationId, (draft) => {
            draft.push({
              _id: Date.now().toString(), // Temporary ID
              text: 'Sending...',
              isSending: true,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Messages', 'Chats', 'AgentChats'],
    }),

    sendTextMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: `/conversations/${conversationId}/messages/text`,
        method: 'POST',
        body: { text },
      }),
      async onQueryStarted({ conversationId, text }, { dispatch, queryFulfilled }) {
        // Optimistic update for text messages
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages', conversationId, (draft) => {
            draft.push({
              _id: Date.now().toString(),
              text,
              isSending: true,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Messages', 'Chats', 'AgentChats'],
    }),

    // Mark messages as read
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Chats', 'AgentChats'],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetAgentChatsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendTextMessageMutation,
  useMarkAsReadMutation,
} = chatApi;