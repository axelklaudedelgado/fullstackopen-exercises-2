import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => [...state.anecdotes].sort((previousAnecdote, nextAnecdote) => nextAnecdote.votes - previousAnecdote.votes))

  const anecdotesFiltered = useSelector(state => {
    if ( state.filter !== '') {
      return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
    }
    return anecdotes
  })

  return(
    anecdotesFiltered.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => {
              dispatch(updateAnecdote(anecdote.id))
              dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
              }
            }>vote</button>
          </div>
        </div>
    )
  )
}

export default AnecdoteList