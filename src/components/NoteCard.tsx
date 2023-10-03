import { SimplifiedNote } from "./NoteList"
import styles from './NoteList.module.css'
import { Card, Stack, Badge} from "react-bootstrap";
import { Link } from "react-router-dom";

type NoteCardProps = {
  note: SimplifiedNote
}
export default function  NoteCard({note}: NoteCardProps){
  const {id, title, tags} = note
  return (
    <Card as={Link} to ={`/${id}`} className={`h-100 text-reset text-decoration-none p-2 ${styles.card}`}>
      <h2 className=' text-capitalize text-truncate'>{title}</h2>
      <Stack direction = 'horizontal' gap={2} className='mt-auto'>
        {tags.map(tag=> <Badge key={tag.id}>{tag.label}</Badge>)}
      </Stack>
    </Card>
  )
}
