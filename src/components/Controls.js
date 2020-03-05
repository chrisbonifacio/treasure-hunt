import React from "react"
import { useSelector } from "react-redux"
import "./Controls.scss"

export default function Controls({ move, take }) {
  const room = useSelector(state => state.player.room_id)
  const items = useSelector(state => state.player.items)
  const map = useSelector(state => state.map)

  return (
    <div className="buttons">
      <div className="actions">
        {items &&
          items.map(item => (
            <button onClick={() => take(item)}>Pick up: {item}</button>
          ))}
      </div>
      <div className="directions">
        {/* move north */}
        {map[room] && map[room].hasOwnProperty("n") && (
          <button className="north" onClick={() => move("n")}>
            <div>{map[room]["n"]}</div>
          </button>
        )}

        {/* move south */}
        {map[room] && map[room].hasOwnProperty("s") && (
          <button className="south" onClick={() => move("s")}>
            <div>{map[room]["s"]}</div>
          </button>
        )}

        {/* move east */}
        {map[room] && map[room].hasOwnProperty("e") && (
          <button className="east" onClick={() => move("e")}>
            <div>{map[room]["e"]}</div>
          </button>
        )}

        {/* move west */}
        {map[room] && map[room].hasOwnProperty("w") && (
          <button className="west" onClick={() => move("w")}>
            <div>{map[room]["w"]}</div>
          </button>
        )}
      </div>
    </div>
  )
}
