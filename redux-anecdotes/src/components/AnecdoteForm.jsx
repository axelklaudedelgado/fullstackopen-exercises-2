import PropTypes from 'prop-types';

const AnecdoteForm = ({onSubmit}) => (
    <div>
        <h2>create new</h2>
        <form onSubmit={onSubmit}>
            <div><input name='anecdote' /></div>
            <button>create</button>
        </form>
    </div>
)

AnecdoteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AnecdoteForm