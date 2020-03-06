import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

import "./Status.scss"

export default function Status({ pathToUnexplored, pathToZero }) {
  const dispatch = useDispatch()
  const player = useSelector(state => state.player)
  const cooldown = useSelector(state => state.player.cooldown)
  const map = useSelector(state => state.map)

  // const [cd, setCD] = useState(99)

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
      <p>
        Path to Unexplored:
        {map[player.room_id] && pathToUnexplored(player.room_id).join(", ")}
      </p>
      <p>
        Path to Zero:
        {map[player.room_id] && pathToZero(player.room_id, 0).join(", ")}
      </p>
      <p>
        Path to Well:
        {map[player.room_id] && pathToZero(player.room_id, 55).join(", ")}
      </p>
      <p>Cooldown: {cooldown}</p>
    </div>
  )
}
