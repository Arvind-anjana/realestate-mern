import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};  
const userThunk = (state)=>{
    
}


const userSlice = createSlice({
    name: "user",
    initialState,   
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; // 
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; // Update current user with new details

        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure, signOut ,updateUserFailure, updateUserStart, updateUserSuccess } = userSlice.actions;

export default userSlice.reducer;

