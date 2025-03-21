import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  accessToken: string;
  phoneToken: string;
  money: number;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  name: '',
  email: '',
  accessToken: '',
  phoneToken: '',
  money: 0,
  isLoggedIn: false, // 추가됨
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload; // 토큰이 있으면 true
    },
    setUser(
      state,
      action: PayloadAction<{name: string; email: string; accessToken: string}>,
    ) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
    setPhoneToken(state, action: PayloadAction<string>) {
      state.phoneToken = action.payload;
    },
  },
});

export const {setUser, setAccessToken, setMoney, setPhoneToken, setIsLoggedIn} =
  userSlice.actions;
export default userSlice.reducer;
