import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userApi from '../api/userApi';

const initialState = {
  user: localStorage.getItem('user_thitracnghiem') || null,
  id_user: localStorage.getItem('id_user_thitracnghiem') || null,
  roles_x01: null,
  // Chỉ true sau khi /me hoặc login xác nhận cookie JWT hợp lệ
  sessionValid: false,
  sessionChecked: false,
};

export const loginAccount = createAsyncThunk(
  'user/login',
  async (payload, thunkAPI) => {
    try {
      let { data } = await userApi.login(payload);

      localStorage.setItem('user_thitracnghiem', data.tentaikhoan);
      localStorage.setItem('id_user_thitracnghiem', data._id);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await userApi.getMe();
      localStorage.setItem('user_thitracnghiem', data.tentaikhoan);
      localStorage.setItem('id_user_thitracnghiem', data._id);
      return data;
    } catch (error) {
      localStorage.removeItem('user_thitracnghiem');
      localStorage.removeItem('id_user_thitracnghiem');
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutAccount = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await userApi.logout();
    } catch (_) {
      // Cookie/API lỗi vẫn coi như đã đăng xuất phía client
    }
    localStorage.removeItem('user_thitracnghiem');
    localStorage.removeItem('id_user_thitracnghiem');
    return true;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeRole: (state, action) => {
      state.roles_x01 = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;
      state.sessionValid = false;
      state.sessionChecked = true;
      localStorage.removeItem('user_thitracnghiem');
      localStorage.removeItem('id_user_thitracnghiem');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAccount.fulfilled, (state, action) => {
      state.user = action.payload.tentaikhoan;
      state.id_user = action.payload._id;
      state.roles_x01 = action.payload.roles;
      state.sessionValid = true;
      state.sessionChecked = true;
    });

    builder.addCase(loginAccount.rejected, (state) => {
      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;
      state.sessionValid = false;
      state.sessionChecked = true;
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.tentaikhoan;
      state.id_user = action.payload._id;
      state.roles_x01 = action.payload.roles;
      state.sessionValid = true;
      state.sessionChecked = true;
    });

    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;
      state.sessionValid = false;
      state.sessionChecked = true;
    });

    builder.addCase(logoutAccount.fulfilled, (state) => {
      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;
      state.sessionValid = false;
      state.sessionChecked = true;
    });

    builder.addCase(logoutAccount.rejected, (state) => {
      state.user = null;
      state.id_user = null;
      state.roles_x01 = null;
      state.sessionValid = false;
      state.sessionChecked = true;
    });
  },
});

export const { changeRole, logout } = authSlice.actions;

export default authSlice.reducer;
