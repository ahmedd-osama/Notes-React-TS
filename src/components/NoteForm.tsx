import { useRef, FormEvent, useState, useEffect } from "react";
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreateableReactSelect from "react-select/creatable";
import { Note, NoteData,Tag } from "../App";
import { v4 as uuidv4 } from "uuid";

type NoteFormProps = {
  onSubmit?:(note: NoteData) => void;
  onUpdate?: (id: string, note: NoteData) => void
  onAddTag: (tag: Tag)=>void;
  availableTags: Tag[];
  originalNote?: Note
};
const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onAddTag, availableTags, originalNote, onUpdate }) => {
  const title = useRef<HTMLInputElement>(null);
  const markdown = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([] as Tag[])
  useEffect(() => {
    if(originalNote){
      setSelectedTags(originalNote.tags)
    }
  }, [originalNote])

  //handlers
  const submitForm = ()=>{
    const formData: NoteData = {
      title: title.current!.value,
      markdown: markdown.current!.value,
      tags: selectedTags,
    };
    if(originalNote){
      onUpdate && onUpdate(originalNote.id,formData);
    }else{
      onSubmit && onSubmit(formData)
    }
    navigate('..');
  }
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    submitForm()
  };
  useEffect(() => {
    const handleKeyPress = (e:KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // Prevent the default Ctrl + S behavior (usually save or browser print)
        submitForm(); // Trigger your form submission function
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  return (
    <Row className="justify-content-center">
      <Col className="col-md-8">
        <Form onSubmit={submitHandler}>
          <Stack gap={4}>
            <Row>
              <Col className="col-12 col-lg-6">
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Title" ref={title} defaultValue={originalNote?originalNote.title:''} />
                </Form.Group>
              </Col>
              <Col className="col-12 col-lg-6">
                <Form.Group controlId="tags">
                  <Form.Label>Tags </Form.Label>
                  <CreateableReactSelect isMulti 
                  options = {availableTags.map(({label, id}:Tag)=> {return {label: label, value: id}})}
                  onCreateOption={label =>{
                    const newTag:Tag = {label: label, id: uuidv4()}
                    onAddTag(newTag);
                    setSelectedTags(prev => [...prev, newTag]);
                  }}
                  value={selectedTags.map((tag)=> {return {label: tag.label, value: tag.id} })}
                  onChange={tags =>{
                    setSelectedTags(tags.map(tag=>{return {label: tag.label, id: tag.value}}));
                  }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="note">
                  <Form.Label> Note: </Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={15}
                    defaultValue={originalNote?originalNote.markdown:''}
                    ref={markdown}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button variant="primary" type='submit'>Save</Button>
              <Link to="..">
                <Button variant="outline-secondary">Cancel</Button>
              </Link>
            </Stack>
          </Stack>
        </Form>
      </Col>
    </Row>
  );
};

export default NoteForm;
