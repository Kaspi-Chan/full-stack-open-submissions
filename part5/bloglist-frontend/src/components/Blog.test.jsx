import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blogData = {
    title: 'Test title',
    author: 'Test Author',
    likes: 5,
    url: 'https://test.com'
  }

  test('renders content', () => {
    const { container } = render(<Blog blog={blogData} />)
    const hiddenpart = container.querySelector('.blog-secondary-content')

    const title = screen.getByText('Test title')
    const author = screen.getByText('Test Author')
    expect(title).toBeDefined()
    expect(author).toBeDefined()

    expect(hiddenpart).not.toBeVisible()
    const url = screen.getByText('https://test.com', { exact: false })
    const likes = screen.getByText('5', { exact: false })
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('renders hidden content after view button is clicked', async () => {
    render(<Blog blog={blogData} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('https://test.com', { exact: false })
    const likes = screen.getByText('5', { exact: false })
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('the like event handler is triggered twice if clicked twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blogData} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likesButton = screen.getByText('like')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})