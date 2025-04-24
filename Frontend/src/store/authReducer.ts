  import { createSlice } from '@reduxjs/toolkit'

  interface AuthState {
      user: any | null;
      token: string | null;
      userId: string | null;
      flag: boolean | false;
    }
    const initialState: AuthState = {
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      flag: false,
    }
    
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setCredentials: (state , action) =>{
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.userId = action.payload.user.sub;

          localStorage.setItem("token" , action.payload.token);
          //console.log(JSON.stringify(action.payload.user));
          localStorage.setItem("user" , JSON.stringify(action.payload.user));
          localStorage.setItem("userId" , action.payload.user.sub);

      },
      setValueFlag:(state , action)=>{
        state.flag = action.payload.flag;
      },
      logout: (state) => {
          state.user = null;
          state.userId = null;
          state.token = null;
          state.flag = false;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
      },
    },
  })

  export const { setCredentials , logout, setValueFlag } = authSlice.actions;
  export default authSlice.reducer;
