import React from "react"
import { useSelector } from "react-redux"
import Room from "./Room"

import "./Room.scss"

export default function Map() {
  const map = useSelector(state => state.map)
  console.log(map)

  // DFT MAP GENERATION

  function generate_map(map) {
    const rooms = Object.keys(map)

    // create stack
    const stack = []

    // create visited set
    const visited = new Set()

    // push first room into stack
    stack.push(rooms[0])

    // while stack is not empty
    while (stack.length > 0) {
      // pop room to check from stack
      let curr = stack.pop()

      // if room not in visited, mark as visited
      if (!Array.from(visited).includes(curr)) {
        visited.add(curr)
      }
    }
  }

  return (
    <div className="map">
      {Object.keys(map).map(room => {
        return <Room room={map[room]} />
      })}
    </div>
  )
}
