"use client"

import { useState, useEffect } from "react"
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

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showAddNoteForm, setShowAddNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  useEffect(() => {
    const handleToggleAddNoteForm = () => {
      setShowAddNoteForm((prev) => !prev)
      setEditingNote(null)
    }

    window.addEventListener("toggleAddNoteForm", handleToggleAddNoteForm)

    return () => {
      window.removeEventListener("toggleAddNoteForm", handleToggleAddNoteForm)
    }
  }, [])

  const handleAddNote = (note: Omit<Note, "id">) => {
    const newNote = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
    }
    setNotes([...notes, newNote])
    setShowAddNoteForm(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowAddNoteForm(true)
  }

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
    setShowAddNoteForm(false)
    setEditingNote(null)
  }

  const handleDeleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id))
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {showAddNoteForm ? (
            <AddNoteForm onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} editingNote={editingNote} />
          ) : (
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
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

