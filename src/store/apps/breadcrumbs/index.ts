// ** Redux Imports
import { createSlice, current } from '@reduxjs/toolkit'
import { saveDataToSession } from 'src/utils/breadcrumbsRedux';

export const breadcrumbsData = createSlice({
  name: 'breadcrumbs',
  initialState: {
    data: typeof window !== 'undefined' && (JSON.parse(sessionStorage.getItem("breadcrumbs")!)) || []
  },
  reducers: {
    resetData: (state) => {
      state.data = []
      saveDataToSession(current(state))
    },
    updateData: (state, action) => {
      state.data.push(action.payload);
      saveDataToSession(current(state))
    },
    sliceData: (state, action) => {
      const { payload } = action;
      if (payload !== state.data.length - 1) {
        const newData = state.data.slice(0, payload + 1);
        state.data = newData;
      }
      saveDataToSession(current(state))
    },

  },
})
export const { updateData, sliceData, resetData } = breadcrumbsData.actions

export default breadcrumbsData.reducer