import React from 'react'
import calculateWinner from '../helpers/calculateWinner'
import { BoardProps } from '../types/types'
import Square from './Square'

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
				<button className='reset' onClick={onResetGame}>
					New game
				</button>
			)}
			{board}
		</>
	)
}
