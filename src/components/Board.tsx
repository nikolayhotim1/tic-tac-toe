import React from 'react'
import Square from './Square'

type BoardProps = {
	move: number
	moveSquare: number | null
	xIsNext: boolean
	squares: (string | null)[]
	onPlay: (nextSquares: (string | null)[]) => void
	onAddLocation: (i: number) => void
	onResetGame: () => void
}

export default function Board({ move, moveSquare, xIsNext, squares, onPlay, onAddLocation, onResetGame }: BoardProps) {
	function handleClick(i: number) {
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		onAddLocation(i)
		const nextSquares = squares.slice()
		xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O')
		onPlay(nextSquares)
	}

	let status: string
	const winnerData = calculateWinner(squares)
	const squaresStyles = Array<string>(9).fill('')
	if (winnerData) {
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
		let squareStyle = ''
		index === moveSquare && (squareStyle = 'current')
		return (
			<Square
				key={index}
				className={`${squaresStyles[index]} ${squareStyle}`}
				value={square}
				onSquareClick={() => handleClick(index)}
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

function calculateWinner(squares: (string | null)[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], winSquares: lines[i] }
		}
	}
	return null
}
