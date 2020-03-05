import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

import "./Status.scss"

export default function Status() {
  const dispatch = useDispatch()
  const player = useSelector(state => state.player)
  const cd = useSelector(state => state.player.cooldown)
  const path = useSelector(state => state.path)
  const pathToZero = useSelector(state => state.pathToZero)

  return (
    <div className="status">
      {Object.keys(player).map(key => {
        if (key !== "cooldown") {
          return (
            <p>
              {key} : {player[key]}
            </p>
          )
        }
      })}
      <p>Path to Unexplored: {path.join(", ")}</p>
      <p>Path to Zero: {pathToZero.join(", ")}</p>
      <p>Cooldown: {cd}</p>
    </div>
  )
}
