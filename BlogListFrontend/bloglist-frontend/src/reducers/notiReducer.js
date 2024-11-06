import { createSlice } from '@reduxjs/toolkit'

const notiSlice = createSlice({
    name: 'notification',
    initialState: { successMessage: '', errorMessage: '' },
    reducers: {
        setErrorMessage: (state, action) => {
            console.log(action.payload, state)
            state.errorMessage = action.payload
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload
        },
        clearMessage: (state) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    }
})


export const { setErrorMessage, setSuccessMessage, clearMessage } = notiSlice.actions
export default notiSlice.reducer
