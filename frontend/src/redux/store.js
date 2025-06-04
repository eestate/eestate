import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { agentApi } from "./services/AgentApi";
import { propertyApi } from "./services/propertyApi";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [agentApi.reducerPath]:agentApi.reducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(authApi.middleware,agentApi.middleware,propertyApi.middleware),
})