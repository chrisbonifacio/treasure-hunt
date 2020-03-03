import axios from "axios"

export default function axiosWithAuth() {
  return axios.create({
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token 12f701e536340660a0ef384bf2d3e4947bed8e5f"
    }
  })
}
