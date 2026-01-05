import axios from "axios"
import { io } from "socket.io-client"

const login = async () => {
  const res = await axios.post(
    "http://localhost:5000/api/auth/login",
    {
      email: "arshaqtk4@gmail.com",
      password: "password123",
    },
    {
      withCredentials: true, // not mandatory but safe
      validateStatus: () => true,
    }
  )

  const setCookie = res.headers["set-cookie"]

  console.log("SET COOKIE HEADER:", setCookie)

  if (!setCookie || !setCookie.length) {
    throw new Error("No cookie received from login")
  }

  // Extract only cookie key=value
  return setCookie[0].split(";")[0]
}

const run = async () => {
  const cookie = await login()

  const socket = io("http://localhost:5000", {
    extraHeaders: {
      cookie,
    },
  })

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id)
  })

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message)
  })
}

run()
