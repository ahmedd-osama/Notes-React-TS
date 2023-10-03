import NoteForm from "../components/NoteForm"
import {NoteData, Tag} from '../App'
type NewNoteProps = {
  onCreateNote: (noteData: NoteData)=>void;
  onAddTag: (tag: Tag)=>void;
  availableTags: Tag[];
}
const NewNote: React.FC<NewNoteProps> = ({onCreateNote, onAddTag, availableTags}) => {
  return (
    <>
      <h1 className='mb-4'>Note</h1>
      <NoteForm onSubmit = {onCreateNote} onAddTag={onAddTag} availableTags ={availableTags} ></NoteForm>
    </>
  )
}

export default NewNote