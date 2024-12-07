import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdoteVotes } from '../reducers/anecdoteReducer'
import { setNotificaionMessage, clearNotificationMessage } from '../reducers/notificationReducer'

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
              dispatch(updateAnecdoteVotes(anecdote.id))
              dispatch(setNotificaionMessage(`you voted '${anecdote.content}'`))
              setTimeout(() => {
              dispatch(clearNotificationMessage())
              }, 5000)
              }
            }>vote</button>
          </div>
        </div>
    )
  )
}

export default AnecdoteList