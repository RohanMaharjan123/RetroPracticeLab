"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AppSidebar } from "@/components/app-sidebar"
import { AddNoteForm } from "@/components/add-note-form"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Pencil, Trash2 } from "lucide-react"

interface Note {
  id: string
  date: string
  task: string
  description: string
}

const API_URL = "http://localhost:8000/api"

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showAddNoteForm, setShowAddNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      // router.push("/login")
      fetchNotes()
    } else {
      fetchNotes()
    }
  }, [router])

  const fetchNotes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_URL}/notes/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(response.data)
    } catch (err) {
      setError("Failed to fetch notes. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async (note: Omit<Note, "id">) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.post(`${API_URL}/notes/`, note, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes([...notes, response.data])
      setShowAddNoteForm(false)
    } catch (err) {
      setError("Failed to add note. Please try again.")
      console.error(err)
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowAddNoteForm(true)
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      const token = localStorage.getItem("accessToken")
      await axios.put(`${API_URL}/notes/${updatedNote.id}/`, updatedNote, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
      setShowAddNoteForm(false)
      setEditingNote(null)
    } catch (err) {
      setError("Failed to update note. Please try again.")
      console.error(err)
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const token = localStorage.getItem("accessToken")
        await axios.delete(`${API_URL}/notes/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setNotes(notes.filter((note) => note.id !== id))
      } catch (err) {
        setError("Failed to delete note. Please try again.")
        console.error(err)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {error && <p className="text-red-500">{error}</p>}
          {showAddNoteForm ? (
            <AddNoteForm onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} editingNote={editingNote} />
          ) : (
            <>
              <Button onClick={() => setShowAddNoteForm(true)}>Add New Note</Button>
              <div className="grid gap-4 md:grid-cols-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="group relative rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-medium text-neutral-900">{note.task}</h3>
                    <p className="text-sm text-neutral-500">{note.date}</p>
                    <p className="mt-2 text-neutral-700">{note.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

