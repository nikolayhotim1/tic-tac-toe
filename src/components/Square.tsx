import React, { MouseEventHandler } from 'react'

type SquareProps = {
	className: string
	value: string | null
	onSquareClick: MouseEventHandler<HTMLButtonElement>
}

export default function Square({ className, value, onSquareClick }: SquareProps) {
	return (
		<button type='button' className={`square ${className}`} onClick={onSquareClick}>
			{value}
		</button>
	)
}
