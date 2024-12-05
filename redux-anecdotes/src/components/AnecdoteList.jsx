import PropTypes from 'prop-types';

const AnecdoteList = ({anecdotes, handleVote}) => (
    anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
    )
)

AnecdoteList.propTypes = {
    anecdotes: PropTypes.func.isRequired
}

export default AnecdoteList