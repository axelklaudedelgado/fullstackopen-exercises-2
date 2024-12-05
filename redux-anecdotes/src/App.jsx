import { createAnecdote, updateAnecdoteVotes } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const anecdotes = useSelector(state => state.sort((previousAnecdote, nextAnecdote) => nextAnecdote.votes - previousAnecdote.votes))
  const dispatch = useDispatch()
  
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  const vote = (id) => {
    dispatch(updateAnecdoteVotes(id))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList anecdotes={anecdotes} handleVote={vote} />
      <AnecdoteForm onSubmit={addAnecdote} />
    </div>
  )
}

export default App