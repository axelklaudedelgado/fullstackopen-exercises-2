import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdotes(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote 
      ) 
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { updateAnecdotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newNote))
  }
}

export const updateAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const anecdoteToUpdate = state.anecdotes.find(anecdote => anecdote.id === id)
    const content = { 
      ...anecdoteToUpdate, 
      votes: anecdoteToUpdate.votes + 1
    }
    const updatedAnecdote = await anecdoteService.updateAnecdote(id, content)
    dispatch(updateAnecdotes(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer