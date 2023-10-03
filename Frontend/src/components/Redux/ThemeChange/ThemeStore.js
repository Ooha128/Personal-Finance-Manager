import { configureStore } from "@reduxjs/toolkit";
import { colourSchemeReducer } from "./ThemeSlice";


const store=configureStore({
    reducer:{
        colourSchemeReducer:colourSchemeReducer
    }
});

export default store;