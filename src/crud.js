import React,{useState,useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = ()=>{
    const [data,setData] = useState([]);
    const [name,setName] = useState('');
    const [age,setAge] = useState('');
    const [active,setActive] = useState(0);
    
    const [editId,setEditId] = useState('');
    const [editName,setEditName] = useState('');
    const [editAge,setEditAge] = useState('');
    const [editActive,setEditActive] = useState(0);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const baseUrl = 'http://54.153.169.207:5001/api/employee/'

    // const empdata = []
    
    useEffect(()=>{
        getData();
    },[]);

    const getData = () => {
        axios.get(baseUrl)
        .then((result) =>{
            setData(result.data)
        })
        .catch( (error)=> {
            console.log(error)
        })
    }

    const handleEdit = (id)=>{
        handleShow()
        axios.get(baseUrl+id)
        .then((result)=>{
            setEditName(result.data.name)
            setEditAge(result.data.age)
            setEditActive(result.data.active)
            setEditId(id)

        })
    }
    const handleActiveChange =  (e) => {
        e.target.checked ? setActive(1) : setActive(0)
    }

    const handleEditActiveChange =  (e) => {
        e.target.checked ? setEditActive(1) : setEditActive(0)
    }

    const handleDelete = (id)=>{
        if(window.confirm("Are you sure to delete?") === true)
            axios.delete(baseUrl+id)
            .then((result)=>{
                if(result.status === 200)
                {
                    toast.success('Employee Has Been Deleted!')
                    getData()
                }   
            }).catch((err)=>{
                toast.error(err)
            })
    }
    const handleUpdate = () => {
        const updateData = {
            'name':editName,
            'age': editAge,
            'active': editActive
        }
        axios.put(baseUrl+editId, updateData)
        .then((result)=>{
            getData()
            clear()
            toast.success('Employee Has Been Updated!')
            handleClose()
        }).catch((err)=>{
            toast.error(err)
        })
    }
    const handleCreate =  () => {
        const newData = {
            'name': name,
            'age': age,
            'active':active,
        }
        axios.post(baseUrl,newData)
        .then((result)=>{
            getData()
            clear()
            toast.success('Employee Has Been Added!')
        }).catch((err)=>{
            toast.error(err)
        })
    }

    const clear = () => {
        setName('')
        setAge('')
        setActive(0)
        setEditName('')
        setEditAge('')
        setEditActive(0)
        setEditId('')
    }

    return (
        <Fragment>
            <br></br>
            <ToastContainer/>
            <Container style={{width: "80%",margin: "0 auto", textAlign:"center"}}>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" 
                        value={name} onChange={(e) => setName(e.target.value)}>
                    </input>
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" 
                        value={age} onChange={(e) => setAge(e.target.value)}></input>
                    </Col>
                    <Col>
                        <Form>
                        <Form.Check // prettier-ignore
                            checked = {active === 1 ? true : false}
                            onChange={(e) => handleActiveChange(e)}
                            type="switch"
                            id="create-switch"
                            label="Active"
                        />
                        </Form>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={()=>{handleCreate()}}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover style={{width: "80%",margin: "0 auto", textAlign:"center"}}>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Active</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data && data.length > 0 ? data.map((item,index)=>{
                        return (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{item.active}</td>
                                <td colSpan={2}>
                                    <button className="btn btn-primary" onClick={()=>handleEdit(item.id)}>Edit</button> &nbsp;
                                    <button className="btn btn-danger" onClick={()=>handleDelete(item.id)}>Delete</button>

                                </td>
                            </tr>
                        )
                    })
                    :null
                } 
                    
                    
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Name" 
                    value={editName} onChange={(e) => setEditName(e.target.value)}>
                    </input>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Age" 
                    value={editAge} onChange={(e) => setEditAge(e.target.value)}></input>
                    </Col>
                    <Col>
                    <Form>
                    <Form.Check // prettier-ignore
                        checked = {editActive === 1 ? true : false}
                        onChange={(e) => handleEditActiveChange(e)}
                        type="switch"
                        id="update-switch"
                        label="Active"
                    />
                    </Form>
                    </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default CRUD;