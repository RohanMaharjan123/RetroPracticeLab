"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns";

interface Note {
  id: string;
  date: string;
  task: string;
  description: string;
}

interface AddNoteFormProps {
  onAddNote: (note: Omit<Note, "id">) => void;
  onUpdateNote: (note: Note) => void;
  editingNote: Note | null;
  onCancel: () => void;
}

export function AddNoteForm({ onAddNote, onUpdateNote, editingNote, onCancel }: AddNoteFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (editingNote) {
      setDate(new Date(editingNote.date));
      setTask(editingNote.task);
      setDescription(editingNote.description);
    } else {
      setDate(undefined);
      setTask("");
      setDescription("");
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) return;

    // Format the date using local time (YYYY-MM-DD)
    const noteData = {
      date: format(date, "yyyy-MM-dd"), // Use date-fns to ensure local date
      task,
      description,
    };

    if (editingNote) {
      onUpdateNote({ ...noteData, id: editingNote.id });
    } else {
      onAddNote(noteData);
    }

    // Reset form
    setDate(undefined);
    setTask("");
    setDescription("");
  };

  const handleCancel = () => {
    setDate(undefined);
    setTask("");
    setDescription("");
    onCancel();
  };

  const handleSelect = (day: Date | undefined) => {
    setDate(day);
  };

  return (
    <div className="flex justify-center mt-16 w-2/3 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm w-2/3">
        <div>
          <Label htmlFor="date" className="font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full justify-start text-left font-normal"
              >
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                disabled={(day) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return day < today;
                }}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
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
            maxLength={200}
            className="mt-1.5"
          />
          <div className="mt-1 text-sm text-neutral-500">
            {description.length} / 200
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {editingNote ? "Update Note" : "Add Note"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}