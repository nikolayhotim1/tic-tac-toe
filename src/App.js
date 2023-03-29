import { useState } from 'react'

function Square({ value, onSquareClick, className }) {
	return (
		<button className={`square ${className}`} onClick={onSquareClick}>
			{value}
		</button>
	)
}

function Board({
	xIsNext,
	squares,
	onPlay,
	resetGame,
	currentMove,
	onAddLocation,
	currentMoveSquare
}) {
	function handleClick(i) {
		onAddLocation(i, winnerData)
		if (calculateWinner(squares) || squares[i]) return
		const nextSquares = squares.slice()
		xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O')
		onPlay(nextSquares)
	}

	const winnerData = calculateWinner(squares)
	let status
	const squaresStyles = Array(9).fill(null)
	if (winnerData) {
		const [winner, winSquares] = winnerData
		status = `Winner: ${winner}`
		for (const square of winSquares) {
			squaresStyles[square] = 'win'
		}
	} else if (currentMove === 9) {
		status = 'Draw'
	} else {
		status = `Next player: ${xIsNext ? 'X' : 'O'}`
	}

	const board = []
	const boardSquares = squares.map((square, index) => {
		let squareStyle
		if (index === currentMoveSquare) {
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
		const columns = []
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
			{(winnerData || currentMove === 9) && (
				<button className='reset' onClick={resetGame}>
					New game
				</button>
			)}
			{board}
		</>
	)
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [locationHistory, setLocationHistory] = useState([null])
	const [currentMove, setCurrentMove] = useState(0)
	const [currentMoveSquare, setCurrentMoveSquare] = useState(null)
	const currentSquares = history[currentMove]
	const [isDescending, setIsDescending] = useState(false)
	const xIsNext = currentMove % 2 === 0

	const locations = {
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

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function resetGame() {
		setHistory([Array(9).fill(null)])
		setLocationHistory([null])
		setCurrentMoveSquare(null)
		setCurrentMove(0)
	}

	function jumpTo(nextMove, locationHistoryMove) {
		setCurrentMove(nextMove)
		setCurrentMoveSquare(
			Number(Object.keys(locations).find(key => locations[key] === locationHistoryMove))
		)
	}

	function handleSortHistory() {
		setIsDescending(!isDescending)
	}

	function handleAddLocation(i, winnerData) {
		if (!winnerData && currentMove !== 9) {
			const nextLocationHistory = [...locationHistory.slice(0, currentMove + 1), locations[i]]
			setLocationHistory(nextLocationHistory)
			setCurrentMoveSquare(i)
		}
	}

	const moves = history.map((squares, move) => {
		let description
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
					xIsNext={xIsNext}
					squares={currentSquares}
					onPlay={handlePlay}
					resetGame={resetGame}
					currentMove={currentMove}
					onAddLocation={handleAddLocation}
					currentMoveSquare={currentMoveSquare}
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

function calculateWinner(squares) {
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
