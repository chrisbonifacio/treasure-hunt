import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import "./App.scss"

import axiosWithAuth from "./utils/axiosWithAuth"
import Controls from "./components/Controls"
import Inventory from "./components/Inventory"
import Status from "./components/Status"
import Map from "./components/Map"

export default function App() {
  const dispatch = useDispatch()
  const player = useSelector(state => state.player)
  const map = useSelector(state => state.map)

  console.log("ROOMS FOUND:", Object.keys(map).length)
  console.log("MAP:", map)

  // find nearest unexplored room
  function pathToUnexplored(currentRoom) {
    "get path to the nearest unexplored room"
    // create queue
    let queue = []

    // create visited set
    let visited = new Set()

    // queue first path
    queue.push([currentRoom])

    // while queue isn't empty, find path
    while (queue.length > 0) {
      let path = queue.shift()

      let room = path[path.length - 1]

      // check if room contains unexplored exit
      if (Object.values(map[room]).includes("?")) {
        dispatch({ type: "GET_PATH", payload: path })
        return path
      }

      // if room has not been visited, mark as visited
      if (!visited.has(room)) {
        // enumerate all adjacent nodes, construct a new path and push it into the queue

        for (let neighbor of Object.values(map[room])) {
          let new_path = [...path]
          new_path.push(neighbor)
          queue.push(new_path)
        }
        visited.add(room)
      }
    }
  }

  // get path back to room Zero
  // find nearest unexplored room
  function pathToZero(currentRoom, targetRoom = 0) {
    // create queue
    let queue = []

    // create visited set
    let visited = new Set()

    // queue first path
    queue.push([currentRoom])

    // while queue isn't empty, find path
    while (queue.length > 0) {
      let path = queue.shift()

      let room = path[path.length - 1]

      // check if room contains unexplored exit
      if (room === targetRoom) {
        dispatch({ type: "GET_PATH_TO_ZERO", payload: path })
        return path
      }

      // if room has not been visited, mark as visited
      if (!visited.has(room)) {
        // enumerate all adjacent nodes, construct a new path and push it into the queue

        for (let neighbor of Object.values(map[room])) {
          if (neighbor !== "?") {
            let new_path = [...path]
            new_path.push(neighbor)
            queue.push(new_path)
          }
        }
        visited.add(room)
      }
    }
  }

  // init player
  async function init() {
    try {
      const response = await axiosWithAuth().get("/adv/init")

      const player = response.data

      dispatch({ type: "INIT", payload: player })
    } catch (error) {
      dispatch({ type: "INIT_FAILURE" })
    }
  }

  // graph map
  function graph(prevRoom, nextRoom, exits, direction) {
    let opposite = {
      n: "s",
      s: "n",
      e: "w",
      w: "e"
    }

    let newMap = { ...map }

    newMap[prevRoom][direction] = nextRoom

    if (!Object.keys(newMap).includes(String(nextRoom))) {
      newMap[nextRoom] = {}

      for (let i = 0; i < exits.length; i++) {
        let exit = exits[i]
        newMap[nextRoom][exit] = "?"
      }
    }

    newMap[nextRoom][opposite[direction]] = prevRoom

    dispatch({ type: "GRAPH_MAP", payload: newMap })
  }

  // move
  async function move(direction) {
    if (player.exits.includes(direction)) {
      let response = null

      try {
        const prevRoom = player.room_id

        const nextRoomExplored = map[player.room_id][direction]

        if (nextRoomExplored !== "?") {
          response = await axiosWithAuth().post("/adv/move", {
            direction: direction,
            next_room_id: String(nextRoomExplored)
          })
          console.log("traveled wisely")
        } else {
          response = await axiosWithAuth().post("/adv/move", {
            direction: direction
          })
          console.log("traveled foolishly")
        }

        dispatch({ type: "MOVE", payload: response.data })

        const nextRoom = response.data.room_id

        const newExits = response.data.exits

        graph(prevRoom, nextRoom, newExits, direction)
      } catch (error) {
        console.log("Move Error:", error.data)
      }
    } else {
      console.log("Cannot move in that direction")
    }
  }

  // take treasure
  async function take(treasure) {
    try {
      const response = await axiosWithAuth().post("/adv/take", {
        name: treasure
      })
      dispatch({ type: "TAKE_TREASURE", payload: response.data })
      console.log(`TOOK ${treasure}:`, response.data)
    } catch (error) {
      console.log("Take Error:", error)
    }
  }

  // drop treasure
  async function drop(treasure) {
    try {
      const response = await axiosWithAuth().post("/adv/drop", {
        name: treasure
      })
      dispatch({ type: "DROP_TREASURE", payload: response.data })
      console.log(response.data)
    } catch (error) {
      console.log("Drop Error:", error)
    }
  }

  // sell treasure
  async function sell(treasure) {
    try {
      const response = await axiosWithAuth().post("/adv/sell", {
        name: treasure,
        confirm: "yes"
      })
      dispatch({ type: "SELL_TREASURE", payload: response.data })
      console.log(response.data)
    } catch (error) {
      console.log("Sell Error:", error)
    }
  }

  // buy donuts
  async function buyDonut() {
    try {
      const response = await axiosWithAuth().post("/adv/buy", {
        name: "donut",
        confirm: "yes"
      })
      dispatch({ type: "BUY_DONUT", payload: response.data })
      console.log(response.data)
    } catch (error) {
      console.log("Sell Error:", error)
    }
  }

  return (
    <div className="App">
      <div className="container">
        <button className="init-button" onClick={init}>
          Initialize Player
        </button>
        {/* <Map /> */}
        <Inventory sell={sell} drop={drop} />
        <Status pathToUnexplored={pathToUnexplored} pathToZero={pathToZero} />
        <Controls move={move} take={take} drop={drop} buyDonut={buyDonut} />
      </div>
    </div>
  )
}
