import React from 'react'
import { Moves, SquareValues, SquareIndices } from './App'
import Square from './Square'

export default function Board({ move, moveSquare, xIsNext, squares, onPlay, onAddLocation, onResetGame }: BoardProps) {
	function handleClick(i: SquareIndices) {
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		onAddLocation(i)
		const nextSquares = squares.slice()
		xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O')
		onPlay(nextSquares)
	}

	let status: Statuses
	const winnerData = calculateWinner(squares)
	const squaresStyles = Array<SquaresStyles>(9).fill('')
	if (winnerData !== null && winnerData.winner !== null) {
		status = `Winner: ${winnerData.winner}`
		for (const square of winnerData.winSquares) {
			squaresStyles[square] = 'win'
		}
	} else if (move === 9) {
		status = 'Draw'
	} else {
		status = `Next player: ${xIsNext ? 'X' : 'O'}`
	}
	const boardSquares: JSX.Element[] = squares.map((square, index) => {
		let squareStyle: SquareStyle = ''
		index === moveSquare && (squareStyle = 'current')
		const squareClass: SquareClasses = `${squaresStyles[index]} ${squareStyle}`
		return (
			<Square
				key={index}
				className={squareClass}
				value={square}
				onSquareClick={() => handleClick(index as SquareIndices)}
			/>
		)
	})
	let squareIndex = 0
	const board: JSX.Element[] = []
	for (let i = 0; i < 3; i++) {
		const columns: JSX.Element[] = []
		for (let j = 0; j < 3; j++) {
			columns.push(boardSquares[squareIndex])
			squareIndex++
		}
		board.push(
			<div key={i} className='board-row'>
				{columns}
			</div>
		)
	}
	return (
		<>
			<div className='status'>{status}</div>
			{(winnerData || move === 9) && (
				<button type='button' className='reset' onClick={onResetGame}>
					New game
				</button>
			)}
			{board}
		</>
	)
}

function calculateWinner(squares: (SquareValues | null)[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	] as const
	for (let line of lines) {
		const [a, b, c] = line
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], winSquares: line }
		}
	}
	return null
}

type BoardProps = {
	move: Moves
	moveSquare: SquareIndices | null
	xIsNext: boolean
	squares: (SquareValues | null)[]
	onPlay: (nextSquares: (SquareValues | null)[]) => void
	onAddLocation: (i: SquareIndices) => void
	onResetGame: () => void
}
type Statuses = 'Next player: X' | 'Next player: O' | 'Draw' | 'Winner: X' | 'Winner: O'
type SquaresStyles = '' | 'win'
type SquareStyle = '' | 'current'
export type SquareClasses = ' ' | 'win ' | ' current' | 'win current'
