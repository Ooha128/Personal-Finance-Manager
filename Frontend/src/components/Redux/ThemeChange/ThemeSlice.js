import { createSlice } from "@reduxjs/toolkit";

const theme = localStorage.getItem('theme');

const initialState={
    colorScheme:theme? theme: 'dark'
}

const colourSchemeSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        changeColourScheme:(state,action)=>{
            state.colorScheme=action.payload;
            localStorage.setItem('theme','light');
        }
    }
})

export const colourSchemeReducer=colourSchemeSlice.reducer;
export const { changeColourScheme} = colourSchemeSlice.actions