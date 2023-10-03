import NoteForm from "../components/NoteForm"
import { NoteData, Tag} from '../App'
import { useNote } from "../components/NoteLayout"
type EditNoteProps = {
  onUpdateNote: (id: string, note: NoteData)=>void;
  onAddTag: (tag: Tag)=>void;
  availableTags: Tag[];
}

const EditNote: React.FC<EditNoteProps> = ({onUpdateNote, onAddTag, availableTags}) => {
  const originalNote = useNote()
  return (
    <>
      <h1 className='mb-4'>Edit Note</h1>
      <NoteForm onUpdate={onUpdateNote} onAddTag={onAddTag} availableTags ={availableTags} originalNote={originalNote} ></NoteForm>
    </>
  )
}

export default EditNote