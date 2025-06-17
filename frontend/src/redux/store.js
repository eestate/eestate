import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { agentApi } from "./services/AgentApi";
import { propertyApi } from "./services/propertyApi";
import { chatApi } from "./services/ChatApi";
import { userApi } from "./services/userApi";
import { adminApi } from "./services/AdminApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [agentApi.reducerPath]:agentApi.reducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
        [adminApi.reducerPath]:adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(authApi.middleware,agentApi.middleware,propertyApi.middleware,chatApi.middleware,userApi.middleware,adminApi.middleware),
})