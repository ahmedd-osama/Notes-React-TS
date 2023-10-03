import React from 'react'
import { Note } from '../App'
import { useParams, Navigate, Outlet, useOutletContext } from 'react-router-dom'
type NoteLayoutProps ={
  notes: Note[],
}
const NoteLayout: React.FC<NoteLayoutProps> = ({notes}) => {
  const {id} = useParams()
  const noteIndex: number  = notes.findIndex(note=> note.id === id) 
  if(noteIndex === -1){
    return (
      <Navigate to='/' replace/>
    )
  }
  const note = notes[noteIndex];
  return (
    <>
    <Outlet context={note}/>
    </>
  )
}

export default NoteLayout

export function useNote(){
  return useOutletContext<Note>()
}