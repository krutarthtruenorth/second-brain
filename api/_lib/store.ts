export interface Note {
  text: string;
  source_id: string;
  created_at: string;
  preview: string;
}

const notes: Note[] = [];

export const addNote = (note: Note) => notes.push(note);
export const getNotes = () => [...notes];
export const getNoteCount = () => notes.length;
