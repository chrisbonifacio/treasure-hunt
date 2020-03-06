import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axiosWithAuth from "../utils/axiosWithAuth"
import "./Inventory.scss"

export default function Inventory({ sell, drop }) {
  const dispatch = useDispatch()
  const status = useSelector(state => state.inventory)

  async function getInventory() {
    try {
      const response = await axiosWithAuth().post("/adv/status")
      dispatch({ type: "GET_INVENTORY", payload: response.data })
    } catch (error) {
      console.log("Inventory Error:", error)
    }
  }

  return (
    <div className="inventory">
      <h2>Status</h2>
      <button onClick={getInventory}>Check Inventory</button>
      <ul>
        {Object.keys(status).map(key => {
          if (key !== "inventory") {
            return (
              <li>
                {key}:{status[key]}
              </li>
            )
          }
        })}
      </ul>
      <h2>Inventory</h2>

      <ul>
        {status.inventory.map(item => {
          return (
            <li>
              {item}
              <button onClick={() => sell(item)}>sell</button>
              <button onClick={() => drop(item)}>drop</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
