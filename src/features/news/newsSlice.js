import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://pulse-backend-070y.onrender.com' // Your live URL from Render
  : 'http://localhost:5001'; // Your local URL for development

export const fetchHeadlines = createAsyncThunk(
    'news/fetchHeadlines',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/news?q=technology`);
            return response.data.articles.slice(0, 5);
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return rejectWithValue(message);
        }
    }
);

export const fetchNewsVolume = createAsyncThunk(
    'news/fetchNewsVolume',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/news?q=SaaS`);
            // FIXED: Ensure totalResults is a number to prevent NaN
            const totalResults = Number(response.data.totalResults) || 0;
            const mockHistoricalData = [
                { name: 'Jun 13', Mentions: Math.floor(totalResults * 0.6) },
                { name: 'Jun 14', Mentions: Math.floor(totalResults * 0.8) },
                { name: 'Jun 15', Mentions: Math.floor(totalResults * 0.7) },
                { name: 'Jun 16', Mentions: totalResults },
                { name: 'Jun 17', Mentions: Math.floor(totalResults * 0.9) },
                { name: 'Jun 18', Mentions: Math.floor(totalResults * 1.1) },
                { name: 'Jun 19', Mentions: Math.floor(totalResults * 1.2) },
            ];
            return mockHistoricalData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);

export const fetchCompetitorNews = createAsyncThunk(
    'news/fetchCompetitorNews',
    async (competitorNames, { rejectWithValue }) => {
        try {
            const requests = competitorNames.map(name =>
                axios.get(`${BACKEND_URL}/api/news?q="${name}"`)
            );
            const responses = await Promise.all(requests);
            const newsByCompetitor = {};
            competitorNames.forEach((name, index) => {
                newsByCompetitor[name] = responses[index].data.articles.slice(0, 3);
            });
            return newsByCompetitor;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);

export const fetchTrendData = createAsyncThunk(
    'news/fetchTrendData',
    async (topic, { rejectWithValue }) => {
         try {
            const response = await axios.get(`${BACKEND_URL}/api/news?q="${topic}"`);
            // FIXED: Ensure totalResults is a number
            const totalResults = Number(response.data.totalResults) || 0;
             const mockHistoricalData = [...Array(14)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (13 - i));
                return {
                    name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    Mentions: Math.floor(totalResults * (Math.random() * 0.5 + 0.7))
                }
            });
            mockHistoricalData[10].Mentions = totalResults;
            return mockHistoricalData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
);


const initialState = {
    headlines: [],
    volume: [],
    competitorNews: {},
    trendData: [],
    headlinesStatus: 'idle',
    volumeStatus: 'idle',
    competitorNewsStatus: 'idle',
    trendStatus: 'idle',
    error: null,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Headlines
            .addCase(fetchHeadlines.pending, (state) => { state.headlinesStatus = 'loading'; })
            .addCase(fetchHeadlines.fulfilled, (state, action) => { state.headlinesStatus = 'succeeded'; state.headlines = action.payload || []; })
            .addCase(fetchHeadlines.rejected, (state, action) => { state.headlinesStatus = 'failed'; state.error = action.payload; })
            // Volume
            .addCase(fetchNewsVolume.pending, (state) => { state.volumeStatus = 'loading'; })
            .addCase(fetchNewsVolume.fulfilled, (state, action) => { state.volumeStatus = 'succeeded'; state.volume = action.payload || []; })
            .addCase(fetchNewsVolume.rejected, (state, action) => { state.volumeStatus = 'failed'; state.error = action.payload; })
            // Competitor News
            .addCase(fetchCompetitorNews.pending, (state) => { state.competitorNewsStatus = 'loading'; })
            .addCase(fetchCompetitorNews.fulfilled, (state, action) => { state.competitorNewsStatus = 'succeeded'; state.competitorNews = action.payload || {}; })
            .addCase(fetchCompetitorNews.rejected, (state, action) => { state.competitorNewsStatus = 'failed'; state.error = action.payload; })
            // Trend Data
            .addCase(fetchTrendData.pending, (state) => { state.trendStatus = 'loading'; })
            .addCase(fetchTrendData.fulfilled, (state, action) => { state.trendStatus = 'succeeded'; state.trendData = action.payload || []; })
            .addCase(fetchTrendData.rejected, (state, action) => { state.trendStatus = 'failed'; state.error = action.payload; });
    },
});

export default newsSlice.reducer;
