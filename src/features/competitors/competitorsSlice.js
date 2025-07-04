/* ========================================================================== */
/* FILE: src/features/competitors/competitorsSlice.js (UPDATED)               */
/* The addCompetitor thunk now calls our new backend instead of mocking data. */
/* ========================================================================== */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import axios from 'axios';


const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://pulse-backend-070y.onrender.com' // Your live URL from Render
  : 'http://localhost:5001'; // Your local URL for development

export const fetchCompetitors = createAsyncThunk(
    'competitors/fetchCompetitors',
    async (userId, { rejectWithValue }) => {
        try {
            const q = collection(db, `users/${userId}/competitors`);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCompetitor = createAsyncThunk(
    'competitors/deleteCompetitor',
    async ({ userId, competitorId }, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, `users/${userId}/competitors`, competitorId));
            return competitorId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// UPDATED: This thunk now gets real data from our backend proxy
export const addCompetitor = createAsyncThunk(
    'competitors/addCompetitor',
    async ({ userId, name, domain }, { rejectWithValue }) => {
        try {
            // 1. Get enriched data from our backend
            const response = await axios.post(`${BACKEND_URL}/api/competitor`, { name, domain });
            const competitorData = response.data;
            
            // 2. Save the enriched data to the user's Firestore document
            const docRef = await addDoc(collection(db, `users/${userId}/competitors`), competitorData);
            
            // 3. Return the complete data to update the Redux state
            return { id: docRef.id, ...competitorData };
        } catch (error) {
            console.error("Error adding competitor:", error);
            const errorMessage = error.response ? error.response.data.error : error.message;
            return rejectWithValue(errorMessage);
        }
    }
);

export const generateCompetitorSummary = createAsyncThunk(
    'competitors/generateSummary',
    async (competitorNames, { rejectWithValue }) => {
        const prompt = `Act as a market analyst. Based on recent news, provide a one-paragraph executive summary of the competitive landscape for the following companies: ${competitorNames}. Focus on major activities like funding, product launches, partnerships, and market sentiment.`;
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyBTQVNdTr8xNCAAo6OjiBGE4LIXdFHiUNw"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error.message || 'AI summary generation failed.'); }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) { return result.candidates[0].content.parts[0].text; } 
            else { throw new Error("No summary was generated by the AI."); }
        } catch (error) {
            console.error("AI Generation Error:", error);
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    items: [],
    status: 'idle',
    error: null,
    summary: '',
    summaryStatus: 'idle',
};

const competitorsSlice = createSlice({
    name: 'competitors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitors.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCompetitors.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
            .addCase(fetchCompetitors.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(addCompetitor.fulfilled, (state, action) => { state.items.push(action.payload); state.error = null; })
            .addCase(addCompetitor.rejected, (state, action) => { state.error = action.payload; })
            .addCase(deleteCompetitor.fulfilled, (state, action) => { state.items = state.items.filter(item => item.id !== action.payload); })
            .addCase(generateCompetitorSummary.pending, (state) => { state.summaryStatus = 'loading'; })
            .addCase(generateCompetitorSummary.fulfilled, (state, action) => { state.summaryStatus = 'succeeded'; state.summary = action.payload; })
            .addCase(generateCompetitorSummary.rejected, (state, action) => { state.summaryStatus = 'failed'; state.error = action.payload; });
    }
});

export default competitorsSlice.reducer;
