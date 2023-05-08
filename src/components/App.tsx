import React, { useState } from 'react'
import Board from './Board'

export default function App() {
	const [history, setHistory] = useState([Array<SquareValues | null>(9).fill(null)])
	const [locationHistory, setLocationHistory] = useState<(Locations | null)[]>([null])
	const [currentMove, setCurrentMove] = useState<Moves>(0)
	const [currentMoveSquare, setCurrentMoveSquare] = useState<SquareIndices | null>(null)
	const [isDescending, setIsDescending] = useState(false)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]
	const locations = [
		'row: 1, col: 1',
		'row: 1, col: 2',
		'row: 1, col: 3',
		'row: 2, col: 1',
		'row: 2, col: 2',
		'row: 2, col: 3',
		'row: 3, col: 1',
		'row: 3, col: 2',
		'row: 3, col: 3'
	] as const

	function handlePlay(nextSquares: (SquareValues | null)[]) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove((nextHistory.length - 1) as Moves)
	}

	function handleAddLocation(i: SquareIndices) {
		const nextLocationHistory = [...locationHistory.slice(0, currentMove + 1), locations[i]]
		setLocationHistory(nextLocationHistory)
		setCurrentMoveSquare(i)
	}

	function jumpTo(nextMove: Moves, locationHistoryMove: Locations | null) {
		setCurrentMove(nextMove)
		nextMove > 0 && locationHistoryMove
			? setCurrentMoveSquare(locations.indexOf(locationHistoryMove) as SquareIndices)
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
		let description: Descriptions
		if (move > 0) {
			move !== currentMove
				? (description = `Go to move #${move as Moves} (${locationHistory[move] as Locations})`)
				: (description = `You are at move #${move as Moves} (${locationHistory[move] as Locations})`)
		} else if (move === currentMove) {
			description = 'You are at game start'
		} else {
			description = 'Go to game start'
		}
		return (
			<li key={move}>
				{move !== currentMove ? (
					<button type='button' onClick={() => jumpTo(move as Moves, locationHistory[move])}>
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

type Locations =
	| 'row: 1, col: 1'
	| 'row: 1, col: 2'
	| 'row: 1, col: 3'
	| 'row: 2, col: 1'
	| 'row: 2, col: 2'
	| 'row: 2, col: 3'
	| 'row: 3, col: 1'
	| 'row: 3, col: 2'
	| 'row: 3, col: 3'
export type Moves = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SquareValues = 'X' | 'O'
export type SquareIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type Descriptions =
	| `Go to move #${Moves} (${Locations})`
	| `You are at move #${Moves} (${Locations})`
	| 'You are at game start'
	| 'Go to game start'
