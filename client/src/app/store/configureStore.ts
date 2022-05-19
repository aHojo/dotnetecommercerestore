import { configureStore } from "@reduxjs/toolkit";
import { configure } from "@testing-library/react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import counterReducer from "../../features/Contact/counterReducer";
import { counterSlice } from "../../features/Contact/counterSlice";
import {basketSlice} from "../../features/BasketPage/basketslice";
import {catalogSlice} from "../../features/catalog/catalogSlice";


// export function configureStore() {

//   return createStore(counterReducer);
// }

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;