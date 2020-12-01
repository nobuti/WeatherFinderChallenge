import React from 'react'
import { render, screen } from '@testing-library/react'

import Info from '.'

describe('Info', () => {
  test('should render properly', () => {
    render(<Info datum="Madrid, ES">Wadus</Info>)
    expect(screen.getByTestId('info-datum')).toBeInTheDocument()
    expect(screen.getByText('Wadus')).toBeInTheDocument()
    expect(screen.getByText('Madrid, ES')).toBeInTheDocument()
  })

  test('should render nothing if datum is empty', () => {
    render(<Info>Wadus</Info>)
    expect(screen.queryByTestId('info-datum')).not.toBeInTheDocument()
    expect(screen.queryByText('Wadus')).not.toBeInTheDocument()
  })
})