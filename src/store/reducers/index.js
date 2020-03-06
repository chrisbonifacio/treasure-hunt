import axiosWithAuth from "../../utils/axiosWithAuth"
import {
  INIT,
  INIT_FAILURE,
  MOVE,
  MOVE_FAILURE,
  GRAPH_MAP,
  TAKE_TREASURE,
  SELL_TREASURE,
  BUY_DONUT,
  GET_INVENTORY,
  GET_PATH,
  GET_PATH_TO_ZERO,
  UPDATE_COOLDOWN,
  GET_PROOF
} from "../actions"

const initialState = {
  player: JSON.parse(localStorage.getItem("player")) || {
    room_id: 0,
    title: "A Dark Room",
    description: "You cannot see anything.",
    coordinates: "(60,60)",
    players: [],
    items: [],
    exits: ["n", "s", "e", "w"],
    cooldown: 0.0,
    errors: [],
    messages: []
  },
  map: JSON.parse(localStorage.getItem("map")) || {},
  inventory: JSON.parse(localStorage.getItem("inventory")) || {
    name: "br80",
    cooldown: 2.0,
    encumbrance: 2, // How much are you carrying?
    strength: 10, // How much can you carry?
    speed: 10, // How fast do you travel?
    gold: 400,
    bodywear: "None",
    footwear: "None",
    inventory: ["Small Treasure"],
    status: [],
    errors: [],
    messages: []
  },
  path: JSON.parse(localStorage.getItem("path")) || [],
  pathToZero: JSON.parse(localStorage.getItem("pathToZero")) || [],
  cooldown: 0,
  proof: 0,
  difficulty: 1,
  error: false
}

export function rootReducer(state = initialState, action) {
  switch (action.type) {
    case INIT:
      localStorage.setItem("player", JSON.stringify(action.payload))

      return { ...state, player: action.payload }

    case INIT_FAILURE:
      return { ...state, error: true }

    case UPDATE_COOLDOWN:
      let coolDownState = { ...state }
      coolDownState.player.cooldown -= 1

      return coolDownState

    case MOVE:
      localStorage.setItem("player", JSON.stringify(action.payload))
      return { ...state, player: action.payload }

    case MOVE_FAILURE:
      return { ...state, error: true }

    case GRAPH_MAP:
      localStorage.setItem("map", JSON.stringify(action.payload))
      return { ...state, map: action.payload }

    case GET_PATH:
      localStorage.setItem("path", JSON.stringify(action.payload))
      return { ...state, path: action.payload }

    case GET_PATH_TO_ZERO:
      localStorage.setItem("pathToZero", JSON.stringify(action.payload))
      return { ...state, pathToZero: action.payload }

    case TAKE_TREASURE:
      localStorage.setItem("player", JSON.stringify(action.payload))

      return { ...state, player: action.payload }

    case SELL_TREASURE:
      localStorage.setItem("player", JSON.stringify(action.payload))

      return { ...state, player: action.payload }

    case BUY_DONUT:
      localStorage.setItem("player", JSON.stringify(action.payload))
      return { ...state, player: action.payload }

    case GET_INVENTORY:
      localStorage.setItem("inventory", JSON.stringify(action.payload))
      return { ...state, inventory: action.payload }
    case GET_PROOF:
      localStorage.setItem("proof", action.payload.proof)
      localStorage.setItem("difficulty", action.payload.difficulty)

      const newProofState = { ...state }
      newProofState.proof = action.payload.proof
      newProofState.difficulty = action.payload.proof

      return newProofState

    default:
      return state
  }
}

// if (!localStorage.getItem("map")) {
//   localStorage.setItem(
//     "map",
//     JSON.stringify({
//       0: { n: 10, s: "?", e: "?", w: "?" },
//       10: { n: 19, s: 0, w: "?" },
//       19: { n: 20, s: 10, w: "?" },
//       20: { n: 63, s: 19, e: "?", w: "?" },
//       63: { n: 72, s: 20, w: "?" },
//       72: { s: 63, w: 76 },
//       76: { n: 83, e: 72, w: "?" },
//       83: { s: 76, e: 130, w: 125 },
//       125: { n: 165, e: 83, w: "?" },
//       130: { w: 83 },
//       165: { n: 203, s: 125, w: "?" },
//       203: { n: 268, s: 165, e: "?" },
//       268: { s: 203, e: "?", w: 312 },
//       312: { n: 328, e: 268 },
//       328: { n: 332, s: 312, e: 357, w: "?" },
//       332: { n: 350, s: 328 },
//       350: { n: 436, s: 332, e: 404 },
//       357: { w: 328 },
//       363: { n: "?", e: "?" },
//       404: { n: 481, w: 350 },
//       436: { s: 350 },
//       481: { s: 404 }
//     })
//   )
// }
