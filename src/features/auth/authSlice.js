/* ========================================================================== */
/* FILE: src/features/auth/authSlice.js (UPDATED)                             */
/* The user state now includes their full profile, including subscription.    */
/* ========================================================================== */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Thunk to fetch the full user profile from Firestore
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { uid: userId, ...docSnap.data() };
            } else {
                return rejectWithValue('No user profile found.');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to update user's subscription tier
export const updateUserTier = createAsyncThunk(
    'auth/updateUserTier',
    async ({ userId, tier, limit }, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { tier: tier, competitorLimit: limit });
            return { tier, competitorLimit: limit };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
  user: null, // Will now store the full profile object
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
        state.status = action.payload ? 'loading' : 'idle';
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchUserProfile.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(updateUserTier.fulfilled, (state, action) => {
            if (state.user) {
                state.user.tier = action.payload.tier;
                state.user.competitorLimit = action.payload.limit;
            }
        });
  }
});

export const { setUser, clearUser, setLoading } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;