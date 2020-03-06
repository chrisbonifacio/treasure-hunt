import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axiosWithAuth from "../utils/axiosWithAuth"

import sha256 from "sha256"

import "./Controls.scss"

export default function Controls({ move, take, buyDonut }) {
  const dispatch = useDispatch()
  const player = useSelector(state => state.player)
  const room = useSelector(state => state.player.room_id)
  const items = useSelector(state => state.player.items)
  const map = useSelector(state => state.map)
  const path = useSelector(state => state.path)
  const lastProof = useSelector(state => state.proof)
  const difficulty = useSelector(state => state.difficulty)
  const [name, setName] = useState("")

  // Wishing Well - Room 55
  // Shop - Room
  // Name Changer - 467

  // get proof
  async function getProof() {
    try {
      const response = await axiosWithAuth().get("/bc/last_proof")
      dispatch({ type: "GET_PROOF", payload: response.data })
      console.log(response.data)
    } catch (error) {
      console.log("Proof Error:", error)
    }
  }

  function validProof(guess, difficulty) {
    // get first 6 characters
    let leading = guess.slice(0, difficulty)

    console.log(guess)

    return leading === "0".repeat(difficulty)
  }

  function mineCoin(lastProof) {
    let proof = 0

    while (true) {
      let guess_hash = sha256(`${lastProof}${proof}`)

      if (validProof(guess_hash, 4)) {
        break
      }

      proof += 1
    }

    mine(proof)
  }

  async function mine(newProof) {
    try {
      const response = await axiosWithAuth().post("/bc/mine", {
        proof: newProof
      })
      console.log(response.data)
    } catch (error) {
      console.log("Proof Error:", error)
    }
  }

  async function examine(name) {
    try {
      const response = await axiosWithAuth().post("/adv/examine/", {
        name: name
      })

      console.log(response.data)
    } catch (error) {
      console.log("Examine Error:", error)
    }
  }

  // function goBackToUnexplored() {
  //   console.log("moving to unexplored")
  //   // get directions from path
  //   const mover = setInterval(() => {
  //     for (let i = 0; i < path.length; i++) {
  //       for (let direction of ["n", "s", "e", "w"]) {
  //         const curr = map[path[i]]
  //         const next = path[i + 1]

  //         if (curr[direction] === next) {
  //           console.log("made it here")
  //           move(direction)
  //         } else {
  //           clearInterval(mover)
  //         }
  //       }
  //     }
  //     console.log("looping")
  //   }, player.cooldown * 1000)
  // }

  async function submitHandler(e) {
    e.preventDefault()
    console.log(e)
    const response = await axiosWithAuth().post("/adv/change_name/", {
      name: name,
      confirm: "aye"
    })

    console.log(response.data)
  }

  function changeHandler(e) {
    setName(e.target.value)
  }

  return (
    <div className="buttons">
      <h2>Controls</h2>
      <div className="actions">
        {/* <button onClick={goBackToUnexplored}>Move to Unexplored</button> */}
        {items &&
          items.map(item => (
            <button onClick={() => take(item)}>Pick up: {item}</button>
          ))}
        {player.title === "JKMT Donuts" && (
          <button onClick={buyDonut}>Buy Donut</button>
        )}
        {player.title === "Wishing Well" && (
          <div className="mining">
            <button onClick={() => examine("well")}>Examine Well</button>
          </div>
        )}

        {player.title === "Pirate Ry's" && (
          <form onSubmit={submitHandler}>
            <label>
              Change Name:
              <input
                onChange={changeHandler}
                type="text"
                name="name"
                value={name}
              />
            </label>
          </form>
        )}
        <button onClick={getProof}>Get Proof</button>
        <button onClick={mineCoin}>Mine</button>
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
