"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Note {
  id: string
  date: string
  task: string
  description: string
}

interface AddNoteFormProps {
  onAddNote: (note: Omit<Note, "id">) => void
  onUpdateNote: (note: Note) => void
  editingNote: Note | null
  onCancel: () => void
}

export function AddNoteForm({ onAddNote, onUpdateNote, editingNote, onCancel }: AddNoteFormProps) {
  const [date, setDate] = useState("")
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (editingNote) {
      setDate(editingNote.date)
      setTask(editingNote.task)
      setDescription(editingNote.description)
    } else {
      // Set the default date to today when adding a new note
      setDate(new Date().toISOString().split("T")[0])
      setTask("")
      setDescription("")
    }
  }, [editingNote])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const noteData = {
      date,
      task,
      description,
    }

    if (editingNote) {
      onUpdateNote({ ...noteData, id: editingNote.id })
    } else {
      onAddNote(noteData)
    }

    // Reset form
    setDate(new Date().toISOString().split("T")[0])
    setTask("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1.5"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {editingNote ? "Update Note" : "Add Note"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

