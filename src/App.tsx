import React from 'react'
import { useState } from 'react'

function Square({ className, value, onSquareClick }) {
	return (
		<button className={`square ${className}`} onClick={onSquareClick}>
			{value}
		</button>
	)
}

function Board({ move, moveSquare, squares, xIsNext, onPlay, onAddLocation, onResetGame }) {
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
	const squaresStyles = Array(9).fill(null)
	if (winnerData) {
		const [winner, winSquares] = winnerData
		status = `Winner: ${winner}`
		for (const square of winSquares) {
			squaresStyles[square] = 'win'
		}
	} else if (move === 9) {
		status = 'Draw'
	} else {
		status = `Next player: ${xIsNext ? 'X' : 'O'}`
	}

	const board: JSX.Element[] = []
	const boardSquares: JSX.Element[] = squares.map((square: string, index: number) => {
		let squareStyle: string | null = null
		if (index === moveSquare) {
			squareStyle = 'current'
		}
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

export default function Game() {
	const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)])
	const [locationHistory, setLocationHistory] = useState<(string | null)[]>([null])
	const [currentMove, setCurrentMove] = useState<number>(0)
	const [currentMoveSquare, setCurrentMoveSquare] = useState<number | null>(null)
	const [isDescending, setIsDescending] = useState<boolean>(false)
	const currentSquares: (string | null)[] = history[currentMove]
	const xIsNext: boolean = currentMove % 2 === 0
	const locations: {
		0: string
		1: string
		2: string
		3: string
		4: string
		5: string
		6: string
		7: string
		8: string
	} = {
		0: 'row: 1, col: 1',
		1: 'row: 1, col: 2',
		2: 'row: 1, col: 3',
		3: 'row: 2, col: 1',
		4: 'row: 2, col: 2',
		5: 'row: 2, col: 3',
		6: 'row: 3, col: 1',
		7: 'row: 3, col: 2',
		8: 'row: 3, col: 3'
	}

	function handlePlay(nextSquares: string[]) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function handleAddLocation(i: number) {
		const nextLocationHistory = [...locationHistory.slice(0, currentMove + 1), locations[i]]
		setLocationHistory(nextLocationHistory)
		setCurrentMoveSquare(i)
	}

	function jumpTo(nextMove: number, locationHistoryMove: string) {
		setCurrentMove(nextMove)
		setCurrentMoveSquare(
			// @ts-ignore
			Number(Object.keys(locations).find(key => locations[key] === locationHistoryMove))
		)
	}

	function handleSortHistory() {
		setIsDescending(!isDescending)
	}

	function handleResetGame() {
		setHistory([Array(9).fill(null)])
		setLocationHistory([null])
		setCurrentMove(0)
		setCurrentMoveSquare(null)
	}

	const moves = history.map((squares, move) => {
		let description: string
		if (move > 0) {
			if (move !== currentMove) {
				description = `Go to move #${move} (${locationHistory[move]})`
			} else {
				description = `You are at move #${move} (${locationHistory[move]})`
			}
		} else if (move === currentMove) {
			description = 'You are at game start'
		} else {
			description = 'Go to game start'
		}
		return (
			<li key={move}>
				{move !== currentMove ? (
					// @ts-ignore
					<button onClick={() => jumpTo(move, locationHistory[move])}>
						{description}
					</button>
				) : (
					description
				)}
			</li>
		)
	})

	return (
		<div className='game'>
			<div className='game-board'>
				<Board
					move={currentMove}
					moveSquare={currentMoveSquare}
					squares={currentSquares}
					xIsNext={xIsNext}
					onPlay={handlePlay}
					onAddLocation={handleAddLocation}
					onResetGame={handleResetGame}
				/>
			</div>
			<div className='game-info'>
				<button onClick={handleSortHistory}>
					Switch to sort by {isDescending ? 'asending' : 'descending'}
				</button>
				<ol>{isDescending ? moves.reverse() : moves}</ol>
			</div>
		</div>
	)
}

function calculateWinner(squares: string[]) {
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
			return [squares[a], lines[i]]
		}
	}
	return null
}
