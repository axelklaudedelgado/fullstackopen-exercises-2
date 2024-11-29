import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('< Blog />', () => {
  const blog = {
    title: 'Test',
    author: 'John Doe',
    url: 'test.com',
    likes: 23,
    user: 'mockuserid123'
  }

  const mockUpdateLikes = vi.fn()

  test('at start only title and author are displayed', () => {
    const { container } = render(<Blog blog={blog} updateLikes={mockUpdateLikes} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Test John Doe'
    )
  })

  test('after clicking the button, URL and likes are displayed', async () => {
    const { container } = render(<Blog blog={blog} updateLikes={mockUpdateLikes} />)

    const user = userEvent.setup()
    const button = container.querySelector('button')
    await user.click(button)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('test.com')
    expect(div).toHaveTextContent('likes 23')
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const { container } = render(<Blog blog={blog} updateLikes={mockUpdateLikes} />)

    const user = userEvent.setup()
    const button = container.querySelector('button')
    await user.click(button)

    const likeBtn = container.querySelector('.likeBtn')
    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(mockUpdateLikes.mock.calls).toHaveLength(2)
  })
})