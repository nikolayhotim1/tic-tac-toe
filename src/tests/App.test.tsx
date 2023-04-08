import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from '../components/App'

test('renders learn react link', () => {
	render(<App />)
	const linkElement = screen.getByText(/Tic-Tac-Toe/i)
	expect(linkElement).toBeInTheDocument()
})
