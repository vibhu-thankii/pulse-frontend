/* ========================================================================== */
/* FILE: src/features/ui/uiSlice.js (UPDATED)                                 */
/* Added state to manage the new profile dropdown.                            */
/* ========================================================================== */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',
    isNotificationsOpen: false,
    isProfileDropdownOpen: false, // New state
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleNotifications: (state) => {
            state.isNotificationsOpen = !state.isNotificationsOpen;
            state.isProfileDropdownOpen = false; // Close other dropdowns
        },
        toggleProfileDropdown: (state) => {
            state.isProfileDropdownOpen = !state.isProfileDropdownOpen;
            state.isNotificationsOpen = false; // Close other dropdowns
        },
        closeAllPopovers: (state) => {
            state.isNotificationsOpen = false;
            state.isProfileDropdownOpen = false;
        }
    },
});

export const { setSearchTerm, toggleNotifications, toggleProfileDropdown, closeAllPopovers } = uiSlice.actions;
export default uiSlice.reducer;
