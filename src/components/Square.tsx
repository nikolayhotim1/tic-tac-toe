import React from 'react'
import { SquareProps } from '../types/types'

export default function Square({ className, value, onSquareClick }: SquareProps) {
	return (
		<button className={`square ${className}`} onClick={onSquareClick}>
			{value}
		</button>
	)
}
