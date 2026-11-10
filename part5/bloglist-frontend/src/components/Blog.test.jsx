import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Test title',
    author: 'Test Author',
    likes: 5,
    url: 'https://test.com',
  }

  const { container } = render(<Blog blog={blog} />)

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