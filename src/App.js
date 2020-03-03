import React, { useState, useEffect } from "react"
import "./App.css"

import axiosWithAuth from "./utils/axiosWithAuth"
import Controls from "./components/Controls"

export default function App() {
  const [player, setPlayer] = useState({})
  const [map, setMap] = useState({ 0: { n: "?", s: "?", e: "?", w: "?" } })

  // initialize player
  useEffect(() => {
    axiosWithAuth()
      .get("/adv/init")
      .then(res => {
        setPlayer(res.data)
        return res.data
      })
      .catch(err => console.log(err))
  }, [])

  console.log("Player:", player)
  console.log("Map:", map)

  // graph map
  function graph(prevRoom, nextRoom, direction) {
    let opposite = {
      n: "s",
      s: "n",
      e: "w",
      w: "e"
    }

    let newMap = { ...map }

    newMap[prevRoom][direction] = nextRoom

    if (!Object.keys(newMap).includes(nextRoom)) {
      newMap[nextRoom] = {}

      for (let exit in player.exits) {
        newMap[nextRoom][exit] = "?"
      }
    }

    newMap[nextRoom][opposite[direction]] = prevRoom

    setMap(newMap)
  }

  // move
  async function move(direction) {
    if (player.exits.includes(direction)) {
      try {
        const prevRoom = player.room_id

        const response = await axiosWithAuth().post("/adv/move", {
          direction: direction
        })

        setPlayer(response.data)

        const nextRoom = response.data.room_id

        graph(prevRoom, nextRoom, direction)
      } catch (error) {
        console.log("Move Error:", error)
      }
    } else {
      console.log("Cannot move in that direction")
    }
  }

  // take treasure
  async function take(treasure) {
    try {
      await axiosWithAuth().post("/adv/take", { name: treasure })
    } catch (error) {
      console.log("Take Error:", error)
    }
  }

  // drop treasure
  async function drop(treasure) {
    try {
      await axiosWithAuth().post("/adv/drop", { name: treasure })
    } catch (error) {
      console.log("Drop Error:", error)
    }
  }

  // sell treasure
  async function sell(treasure) {
    try {
      await axiosWithAuth().post("/adv/sell", { name: treasure })
    } catch (error) {
      console.log("Sell Error:", error)
    }
  }

  // check inventory
  async function inventory() {
    try {
      const inventory = await axiosWithAuth().post("/adv/sell")
      console.log(inventory)
    } catch (error) {
      console.log("Inventory Error:", error)
    }
  }

  return (
    <div className="App">
      {Object.keys(player).map(key => {
        return (
          <p>
            {key} : {player[key]}`
          </p>
        )
      })}

      <Controls move={move} take={take} drop={drop} />
    </div>
  )
}
