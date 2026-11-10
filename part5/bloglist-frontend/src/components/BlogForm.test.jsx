import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls the handlers from its props', async () => {
    const mockHandler = vi.fn()

    render(<BlogForm addBlog={mockHandler} handleNottification={() => {}} />)

    const titleInputs = screen.getAllByRole('textbox')

    const user = userEvent.setup()
    for (const input of titleInputs) {
      await user.type(input, 'test')
    }
    const createButton = screen.getByText('Create')
    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual({ title: 'test', author: 'test', url: 'test' })
  })
})