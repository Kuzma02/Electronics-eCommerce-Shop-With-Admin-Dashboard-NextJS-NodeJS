"use client";
import React, { FormEvent, useState } from 'react'

interface RangeProps {
    min: number;
    max: number;
    priceValue: number;
    setInputCategory: any;
}

const Range = ({ min, max, priceValue, setInputCategory } : RangeProps) => {
    const [ currentRangeValue, setCurrentRangeValue ] = useState<number>(priceValue);

    const handleRange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentRangeValue(parseInt(e.target.value));
    }

  return (
    <div>
        <input type="range" min={min} max={max} value={priceValue} className="range range-warning" />
        <span>{ `Max price: $${currentRangeValue}` }</span>
    </div>
  )
}

export default Range