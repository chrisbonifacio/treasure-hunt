import React from "react"
import "./Controls.scss"

export default function Controls({ move }) {
  return (
    <div className="buttons">
      {/* move north */}
      <button onClick={() => move("n")}>N</button>

      {/* move south */}
      <button onClick={() => move("s")}>S</button>

      {/* move east */}
      <button onClick={() => move("e")}>E</button>

      {/* move west */}
      <button onClick={() => move("w")}>W</button>
    </div>
  )
}
