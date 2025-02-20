"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  username: string
  password: string
  address?: string
  phoneNumber?: string
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    address: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length <= 4) newErrors.password = "Password must be more than 4 characters"
    if (!isLogin) {
      if (!formData.address) newErrors.address = "Address is required"
      else if (formData.address.length <= 4) newErrors.address = "Address must be more than 4 characters"
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
      else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (isLogin) {
        if (formData.username === "admin" && formData.password === "admin") {
          router.push("/dashboard")
        } else {
          alert("Invalid credentials")
        }
      } else {
        // Here you would typically send the registration data to your backend
        console.log("Registration data:", formData)
        alert("Registration successful! You can now log in.")
        setIsLogin(true)
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials below to login to your account"
              : "Fill in your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              {!isLogin && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Your address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="1234567890"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                  </div>
                </>
              )}
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Register"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-blue-500 hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-blue-500 hover:underline">
                  Log in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

