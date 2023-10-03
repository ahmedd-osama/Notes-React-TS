import {useMemo} from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import NewNote from "./pages/NewNote"
import { Routes, Route, Navigate } from "react-router-dom"
import {v4 as uuidv4} from 'uuid'
import NoteList from './components/NoteList'
import NoteLayout from './components/NoteLayout'
import NoteComponent  from './components/Note' 
import EditNote from './pages/EditNote'
// types
export type Note = {
  id: string
} & NoteData
export type rawNote = {
  id: string
}& rawNoteData
export type Tag ={
  id: string
  label: string
}
export type rawNoteData = {
  title: string
  markdown: string
  tagIDs: string[]  
}
export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

function App() {
  const [tags, setTags] = useLocalStorage<Tag[]>('Tags',[]);
  const [notes, setNotes] = useLocalStorage<rawNote[]>('NOTES',[])
  const notesWithTags: Note[] = useMemo(()=>{
    return notes.map((note: rawNote) => {return {...note, tags: tags.filter((tag: Tag) => note.tagIDs.includes(tag.id))}})
  },[notes,tags])
  const onCreateNote = ({tags , ...data }:NoteData)=>{
    // converting from NoteData to rawNoteData
    setNotes((prev: rawNote[])=>[...prev, {...data,id: uuidv4(), tagIDs: tags.map((tag: Tag)=> tag.id)}])
  }
  function onAddTag(tag:Tag){
    setTags(prev => [...prev , tag])
  }
  function onUpdateNote( id: string, newNote:NoteData){
    const noteIndex: number = notes.findIndex(note=> note.id === id)
    if(noteIndex !== -1){
      const newNotesList = notes;
      newNotesList[noteIndex] = {...newNote,id: id, tagIDs: newNote.tags.map((tag: Tag)=> tag.id)}
      setNotes(()=>{return [...newNotesList]})
    }
  }
  function onDeleteNote (id: string){
    setNotes([...notes.filter(note=>note.id !== id)])
  }
  function onEditTags (newTagsList: Tag[]){
    setTags([...newTagsList])
  }
  return (
    <Container className = 'my-4'>
      <Routes>
        <Route path={'/'} element = {<NoteList notes= {notesWithTags} availableTags={tags} onEditTags={onEditTags}/>}/>
        <Route path={'/new'} element = {<NewNote onCreateNote = {onCreateNote} onAddTag = {onAddTag} availableTags = {tags} />}/>
        <Route path="/:id" element = {<NoteLayout notes={notesWithTags}/>}>
          <Route 
            path = 'edit'
            element = {<EditNote onUpdateNote = {onUpdateNote} onAddTag = {onAddTag} availableTags = {tags} />}
          />
          <Route 
            index
            element = {<NoteComponent onDeleteNote = {onDeleteNote}/>}
          />
        </Route>
        {/* for unsupported routes handling */}
        <Route path={'*'} element = {<Navigate to={'/'}/>}/>
      </Routes>
    </Container>
  )
}

export default App
