import { MouseEventHandler } from 'react'

export type Locations = {
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

export type BoardProps = {
	move: number
	moveSquare: number | null
	xIsNext: boolean
	squares: (string | null)[]
	onPlay: (nextSquares: (string | null)[]) => void
	onAddLocation: (i: number) => void
	onResetGame: () => void
}

export type SquareProps = {
	className: string
	value: string | null
	onSquareClick: MouseEventHandler<HTMLButtonElement>
}
