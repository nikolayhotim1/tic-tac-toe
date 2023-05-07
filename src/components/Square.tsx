import React, { MouseEventHandler } from 'react'
import { SquareValues } from './App'
import { SquareClasses } from './Board'

export default function Square({ className, value, onSquareClick }: SquareProps) {
	return (
		<button type='button' className={`square ${className}`} onClick={onSquareClick}>
			{value}
		</button>
	)
}

type SquareProps = {
	className: SquareClasses
	value: SquareValues | null
	onSquareClick: MouseEventHandler<HTMLButtonElement>
}
