import React, { useState } from 'react'
import Board from './Board'

export default function App() {
	const [history, setHistory] = useState([Array<string | null>(9).fill(null)])
	const [locationHistory, setLocationHistory] = useState<(string | null)[]>([null])
	const [currentMove, setCurrentMove] = useState(0)
	const [currentMoveSquare, setCurrentMoveSquare] = useState<number | null>(null)
	const [isDescending, setIsDescending] = useState(false)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]

	type Locations = {
		0: string
		1: string
		2: string
		3: string
		4: string
		5: string
		6: string
		7: string
		8: string
	}

	const locations: Locations = {
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

	function handlePlay(nextSquares: (string | null)[]) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function handleAddLocation(i: number) {
		const nextLocationHistory = [...locationHistory.slice(0, currentMove + 1), locations[i as keyof typeof locations]]
		setLocationHistory(nextLocationHistory)
		setCurrentMoveSquare(i)
	}

	function jumpTo(nextMove: number, locationHistoryMove: string | null) {
		setCurrentMove(nextMove)
		nextMove > 0
			? setCurrentMoveSquare(
					Number(
						Object.keys(locations).find(
							key => locations[key as unknown as keyof typeof locations] === locationHistoryMove
						)
					)
			  )
			: setCurrentMoveSquare(null)
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

	const moves = history.map((_squares, move) => {
		let description: string
		if (move > 0) {
			move !== currentMove
				? (description = `Go to move #${move} (${locationHistory[move]})`)
				: (description = `You are at move #${move} (${locationHistory[move]})`)
		} else if (move === currentMove) {
			description = 'You are at game start'
		} else {
			description = 'Go to game start'
		}
		return (
			<li key={move}>
				{move !== currentMove ? (
					<button type='button' onClick={() => jumpTo(move, locationHistory[move])}>
						{description}
					</button>
				) : (
					description
				)}
			</li>
		)
	})

	return (
		<>
			<div className='game'>
				<div className='game-board'>
					<Board
						move={currentMove}
						moveSquare={currentMoveSquare}
						xIsNext={xIsNext}
						squares={currentSquares}
						onPlay={handlePlay}
						onAddLocation={handleAddLocation}
						onResetGame={handleResetGame}
					/>
				</div>
				<div className='game-info'>
					<button type='button' onClick={handleSortHistory}>
						Sort by {isDescending ? 'asending' : 'descending'}
					</button>
					<ul>{isDescending ? moves.reverse() : moves}</ul>
				</div>
			</div>
		</>
	)
}
