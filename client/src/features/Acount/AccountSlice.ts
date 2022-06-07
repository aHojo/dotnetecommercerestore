import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { FieldValues } from "react-hook-form"
import { toast } from "react-toastify";
import agent from "../../app/api/agent"
import { User } from "../../app/models/User"
import { history } from "../../index";
import { setBasket } from "../BasketPage/basketslice";

interface AccountState {
  user: User | null
}

const initialState: AccountState = {
  user: null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
  'account/signInUser',
  async (data, thunkApi) => {

    try {

      const userDto = await agent.Account.login(data);
      const { basket, ...user } = userDto

      if (basket) thunkApi.dispatch(setBasket(basket))
      localStorage.setItem('user', JSON.stringify(user)); // username and token
      return user

    } catch (e: any) {
      return thunkApi.rejectWithValue({ error: e.data })
    }
  })

export const fetchCurrentUser = createAsyncThunk<User>(
  'account/fetchCurrentUser',
  async (_, thunkApi) => {
    // Only get here if the condition passes
    // will always have user because of the condition
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)))
    try {
      const userDto = await agent.Account.currentUser();
      const { basket, ...user } = userDto

      console.log(basket);

      if (basket) thunkApi.dispatch(setBasket(basket))
      localStorage.setItem('user', JSON.stringify(user)); // username and token
      return user

    } catch (e: any) {
      return thunkApi.rejectWithValue({ error: e.data })
    }
  },
  {
    condition: () => {
      // Don't make the network request if its not in localstorage
      if (!localStorage.getItem("user")) return false;
    }
  }
)
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      history.push("/");
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  // we use this way because both thunks do the same thing. and we don't need a pending
  extraReducers: (builder => {
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.error("Session expired, please login again")
      history.push("/");
    })
    builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
      state.user = action.payload
    })
    builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
      throw action.payload;
    })
  })
})

export const { signOut, setUser } = accountSlice.actions