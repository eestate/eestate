import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { agentApi } from "./services/AgentApi";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [agentApi.reducerPath]:agentApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(authApi.middleware,agentApi.middleware),
})