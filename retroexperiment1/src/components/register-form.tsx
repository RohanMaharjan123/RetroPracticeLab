"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function RegisterForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length <= 4) {
      setError("Password must be more than 4 characters")
      return
    }

    if (address.length <= 4) {
      setError("Address must be more than 4 characters")
      return
    }
    // calling backend api to register user
    try {
      await axios.post("http://localhost:8000/api/register", {
        username,
        password,
        address,
        phone_number: phoneNumber,
      })

      // Redirect to login page after successful registration
      router.push("/")
    } catch (error) {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <Card className="w-[350px] bg-gray-300">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

