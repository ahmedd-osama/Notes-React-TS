import { Note as NoteType } from '../App';
import { useNote } from './NoteLayout'
import { Badge, Stack, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
type NoteComponentProps = {
  onDeleteNote: (id: string)=>void;
}
export default function NoteComponent({onDeleteNote}: NoteComponentProps ) {
  const note: NoteType = useNote()
  const {tags, title, markdown,id} = note;
  const navigate = useNavigate()
  return (
    <>
      <Row className = 'align-items-center mb-4'>
        <Col>
        <h1>{title}</h1>
        <Stack direction = 'horizontal' gap={2} >
          {tags.map(tag=> <Badge key={tag.id}>{tag.label}</Badge>)}
        </Stack>
        </Col>
        <Col xs='auto'>
        <Stack direction='horizontal' gap={2}>
          <Link to={`/${id}/edit`}>
          <Button>Edit</Button>
          </Link>
          <Button className='outline-error' variant='outline-danger' onClick= {()=>{onDeleteNote(id); navigate('..')}}>Delete</Button>
          <Link to="..">
          <Button className='outline-secondary'variant='outline-secondary'>Back</Button>
          </Link>
        </Stack>
        </Col>
      </Row>
      <ReactMarkdown>
        {markdown}
      </ReactMarkdown>
    </>
  )
}