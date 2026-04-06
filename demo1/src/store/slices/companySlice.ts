import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SelectedCompany {
  _id: string
  companyName: string
  [key: string]: any
}

interface CompanyState {
  selectedCompany: SelectedCompany | null
}

const initialState: CompanyState = {
  selectedCompany: null,
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSelectedCompany(state, action: PayloadAction<SelectedCompany | null>) {
      state.selectedCompany = action.payload
    },
    clearSelectedCompany(state) {
      state.selectedCompany = null
    },
  },
})

export const { setSelectedCompany, clearSelectedCompany } = companySlice.actions
export default companySlice.reducer
