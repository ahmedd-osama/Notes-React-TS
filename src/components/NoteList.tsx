import {FormEvent, useEffect, useState} from 'react'
import {  Tag } from '../App'
import { Form, Stack, Row, Col, Button, Modal} from "react-bootstrap";
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import NoteCard from './NoteCard';
import {v4 as uuidv4} from 'uuid'

type NoteListProp = {
  notes: SimplifiedNote[];
  availableTags: Tag[];
  onEditTags: (tags:Tag[])=>void
}
export type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string
}
const NoteList: React.FC<NoteListProp> = ({notes, availableTags, onEditTags}) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([] as Tag[]);
  const [title, setTitle] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<SimplifiedNote[]>([] as SimplifiedNote[])
  const [showEditTagsModal, setShowEditTagsModal] = useState(false)
  function closeEditTagsModal(){
    setShowEditTagsModal(false)
  }
  useEffect(()=>{
    if(title.trim().length !== 0 || selectedTags.length !=0){
      //filtering
      const filtered_notes= notes.filter(note=>{
        // filtering upon tags
        let containsTags = true;
        if(selectedTags.length !== 0){
          //---------------my solution ==========
          // const selectedTagsIds: string[] = selectedTags.map(tag => tag.id)
          // const noteTagsIds: string[] = note.tags.map(tag=>tag.id)
          // selectedTagsIds.map(selectedTagId=> { return noteTagsIds.includes(selectedTagId)}).includes(false)? containsTags = false : ''
          //---------------web dev cody solution==========
          selectedTags.every(tag=> note.tags.some(noteTag=> noteTag.id === tag.id)) ? containsTags = true : containsTags = false
        }
        
        // filtering upon title
        let containsTitle = true
        if(title.trim().length !== 0){
          containsTitle = note.title.includes(title)
        }

        return (containsTitle && containsTags)
      })
      setFilteredNotes(filtered_notes);
      return
    }
    setFilteredNotes(notes);
  }, [notes, selectedTags, title])
  return (
    <>
    <Row className='aling-items-center mb-4'>
      <Col>
        <h1>My Notes</h1>
      </Col>
      <Col xs='auto'>
        <Stack gap={2} direction='horizontal'>
        <Link to='/new'>
        <Button variant='primary'>create</Button>
        </Link>
        <Button variant='outline-secondary' onClick={()=>{setShowEditTagsModal(true)}}>Edit Tags</Button>
        </Stack>
      </Col>
    </Row>
    <Form className='mb-4'>
      <Row >
        <Stack direction='horizontal' gap={4}>
        <Col>
          <Form.Group>
          <Form.Label controlId='title'>Title</Form.Label>
          <Form.Control type = 'text' value={title} onChange={(e)=>setTitle(e.target.value)}></Form.Control>
          </Form.Group>
        </Col>
        <Col >
          <Form.Group controlId="tags">
            <Form.Label>Tags </Form.Label>
            <ReactSelect isMulti 
            options = {availableTags.map(({label, id}:Tag)=> {return {label: label, value: id}})}
            value={selectedTags.map((tag)=> {return {label: tag.label, value: tag.id} })}
            onChange={tags =>{
              setSelectedTags(tags.map(tag=>{return {label: tag.label, id: tag.value}}));
            }}
            />
          </Form.Group>
        </Col>
        </Stack>
      </Row>
    </Form>
    <Row xs={1} sm={2} lg={3} xlg={4} gap={4}>
      {filteredNotes.map(note=> (
      <Col className='mb-4' key={note.id}> 
        <NoteCard note = {note}></NoteCard>
      </Col>) )}
    </Row>
    <EditTagsModal tags= {availableTags} onEditTags = {onEditTags} show={showEditTagsModal} close={closeEditTagsModal}/>
    </>
  )
}

export default NoteList
type editTagsModal = {
  onEditTags: (tags:Tag[])=>void
  tags: Tag[];
  show: boolean;
  close: ()=>void;
}
function EditTagsModal ({tags, onEditTags, show, close}: editTagsModal){
  
  const [newTags, setNewTags] = useState<Tag[]>(tags)
  useEffect(()=>{
    setNewTags(tags)
  },[tags])
  function onTagChange (title: string, id: string){
    setNewTags(prev=> [...prev.map(tag=> {
      if(tag.id !== id) return tag
      tag.label = title;
      return tag
    })])
  }
  function onTagDelete ( id: string){
    setNewTags(prev=> [...prev.filter(tag=>tag.id !== id)])
  }
  function onAddNewTag (){
    setNewTags(prev=> [...prev.concat({label: 'New Added Tag', id: uuidv4()})])
  }
  function submitHandler (e: FormEvent){
    e.preventDefault()
    close()
    onEditTags(newTags)
  }
  return <Modal show = {show} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title> Edit Tags</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit = {submitHandler}>
        {newTags.map(tag => (
          <Row key={tag.id} className = 'align-items-center mt-2'>
            <Form.Group>
            <Row>
              <Col><Form.Control type = 'text' defaultValue={tag.label} onChange={e=>{onTagChange(e.target.value,tag.id)}} ></Form.Control></Col>
              <Col xs='auto'><Button variant='outline-danger' onClick={()=>{onTagDelete(tag.id)}}>&times;</Button></Col>
            </Row>
            </Form.Group>
          </Row>
        ))}
        <Button variant='outline-success' onClick={onAddNewTag} className='my-4 w-100'> Add New </Button>
        <Stack gap={2} direction='horizontal' className='my-4'>
          <Button type='submit' className='ms-auto'>Save</Button>
          <Button variant='outline-secondary' onClick={close}>cancel</Button>
        </Stack>
      </Form>
    </Modal.Body>
  </Modal>
}
