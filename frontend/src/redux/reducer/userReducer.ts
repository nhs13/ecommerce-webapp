import {PayloadAction, createSlice} from '@reduxjs/toolkit'
import { UserReducerInitialState } from '../../types/reducer-types'
import { User } from '../../types/types'

const initialState: UserReducerInitialState = {
    user: null,
    loading: true
}
// Reducers in Redux Toolkit are responsible for specifying how
// the application's state changes in response to dispatched actions
export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false,
            state.user = action.payload
        },
        userNotExist: (state) => {
            state.loading = false,
            state.user = null
        },
    }
})


export const {userExist, userNotExist} = userReducer.actions