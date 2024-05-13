import {configureStore} from "@reduxjs/toolkit"
import { userAPI } from "./api/userAPI"

export const server = import.meta.env.VITE_SERVER


// a reducer is a function responsible for
// specifying how the application's state 
// changes in response to dispatched actions
export const store = configureStore({
    reducer: {
        [userAPI.reducerPath] : userAPI.reducer,
    },
    middleware: (defaultMw) => [...defaultMw(), userAPI.middleware],
})