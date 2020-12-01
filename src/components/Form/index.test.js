import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import Form from '.'

describe('Form', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    working: false
  }

  test('should render properly', () => {
    render(<Form {...defaultProps} />)

    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeEnabled()
  })

  test('should call onSubmit callback properly', () => {
    render(<Form {...defaultProps} />)

    fireEvent.change(screen.getByTestId('city-field'), { target: { value: 'Malaga' } })
    fireEvent.click(screen.getByRole('button'))

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({ city: 'Malaga', country: 'es' })
  })

  test('should disable submit button if working', () => {
    const props = {
      ...defaultProps,
      working: true
    }
    render(<Form {...props} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})