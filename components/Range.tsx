"use client";
import React, { FormEvent, useState } from 'react'

interface RangeProps {
    min: number;
    max: number;
    defaultValue: number;
}

const Range = ({ min, max, defaultValue } : RangeProps) => {
    const [ currentRangeValue, setCurrentRangeValue ] = useState<number>(defaultValue);

    const handleRange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentRangeValue(parseInt(e.target.value));
    }

  return (
    <div>
        <input type="range" min={min} max={max} value={currentRangeValue} onChange={(e) => handleRange(e)} className="range range-warning" />
        <span>{ `Max price: $${currentRangeValue}` }</span>
    </div>
  )
}

export default Range