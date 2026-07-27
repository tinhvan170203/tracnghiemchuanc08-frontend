import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userApi from '../api/userApi';

const initialState = {
  user: localStorage.getItem('user_thitracnghiem') || null,
  id_user: localStorage.getItem('id_user_thitracnghiem') || null,

  // KHÔNG LƯU LOCALSTORAGE NỮA
  roles_x01: null,
};



// ==========================
// LOGIN
// ==========================

export const loginAccount = createAsyncThunk(
  'user/login',

  async (payload, thunkAPI) => {

    try {

      let { data } = await userApi.login(payload);

      // KHÔNG LƯU TOKEN NỮA

      localStorage.setItem(
        'user_thitracnghiem',
        data.tentaikhoan
      );

      localStorage.setItem(
        'id_user_thitracnghiem',
        data._id
      );

      return data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);



// ==========================
// LOGOUT
// ==========================

export const logoutAccount = createAsyncThunk(
  'user/logout',

  async (_, thunkAPI) => {

    try {

      await userApi.logout();

      localStorage.removeItem('user_thitracnghiem');
      localStorage.removeItem('id_user_thitracnghiem');

      return true;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);



// ==========================
// SLICE
// ==========================

export const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {

    changeRole: (state, action) => {

      // CHỈ STATE
      state.roles_x01 = action.payload;
    },



    logout: (state) => {

      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;

      localStorage.removeItem('user_thitracnghiem');
      localStorage.removeItem('id_user_thitracnghiem');
    },
  },



  extraReducers: (builder) => {

    // LOGIN SUCCESS
    builder.addCase(
      loginAccount.fulfilled,

      (state, action) => {

        state.user = action.payload.tentaikhoan;
        state.id_user = action.payload._id;

        // ROLE CHỈ LƯU REDUX
        state.roles_x01 = action.payload.roles;
      }
    );



    // LOGIN FAILED
    builder.addCase(
      loginAccount.rejected,

      (state) => {

        state.user = null;
        state.id_user = null;
        state.roles_x01 = null;
      }
    );



    // LOGOUT SUCCESS
    builder.addCase(
      logoutAccount.fulfilled,

      (state) => {

        state.user = null;
        state.id_user = null;
        state.roles_x01 = null;
      }
    );



    // LOGOUT FAILED
    builder.addCase(
      logoutAccount.rejected,

      (state) => {

        state.user = null;
        state.id_user = null;
        state.roles_x01 = null;
      }
    );
  }
});



export const {
  changeRole,
  logout
} = authSlice.actions;

export default authSlice.reducer;