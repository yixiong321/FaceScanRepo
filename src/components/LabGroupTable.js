
import { Container,Modal,Form } from 'react-bootstrap';
import React,{ useState} from 'react';
import { MDBDataTableV5,MDBInput  } from 'mdbreact';
import { MdDeleteForever,MdModeEdit,MdAddToPhotos} from "react-icons/md";
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'



export const LabGrpsTable=(props)=> {
    //// STATES ////

    //this is to determine whether to show/hide the confirmation modal
    const [showDeleteModal,setDeleteModal]=useState(false)
    const [selected,setSelected] = useState(null)
    const [isEditing,setEditing] = useState(false)

    //adding the btns for the different actions
    const addLabGrpButtons=(data)=>{
        data.forEach(function (entry, index) {
            entry.actions = (isEditing)?<div>
            <MDBBtn color="primary" size="sm" disabled>
            <MdAddToPhotos></MdAddToPhotos>
            </MDBBtn>{' '}
        <MDBBtn color="secondary" size="sm" disabled value={entry.lab_group} 
                    onClick={(e)=>handleEditLabGrp(e.target.value)}>
                <MdModeEdit></MdModeEdit>
            </MDBBtn>{' '}
        <MDBBtn color="danger" size="sm" disabled value={entry.lab_group} onClick={(e)=>{setSelected(e.target.value)
                    setDeleteModal(true)}
                }> 
        <MdDeleteForever></MdDeleteForever>
        </MDBBtn></div>
            :<div><Link to={`session?code=${entry.course_code}&index=${entry.index}&group=${entry.lab_group}`}>
                <MDBBtn color="primary" size="sm">
                <MdAddToPhotos></MdAddToPhotos>
                </MDBBtn>{' '}
            </Link>
            <MDBBtn color="secondary" size="sm" value={entry.lab_group} 
                        onClick={(e)=>handleEditLabGrp(e.target.value)}>
                    <MdModeEdit></MdModeEdit>
                </MDBBtn>{' '}
            <MDBBtn color="danger" size="sm" value={entry.lab_group} onClick={(e)=>{setSelected(e.target.value)
                        setDeleteModal(true)}
                    }> 
            <MdDeleteForever></MdDeleteForever>
            </MDBBtn></div>
            });
        return data;
    }

    const [datatable, setDatatable] = useState({
    columns: [
        {
        label: 'ID',
        field: 'id',
        width: 150,
        attributes: {
            'aria-controls': 'DataTable',
            'aria-label': 'Date',
        },
        },
        {
        label: 'Course code',
        field: 'course_code',
        width: 150,
        },
        {
        label: 'Index',
        field: 'index',
        width: 150,
        },
        {
        label: 'Lab Group',
        field: 'lab_group',
        width: 150,
        },
        {
        label: 'Actions',
        field: 'actions',
        width: 150,
        sort: 'disabled',
        },
    ],
    rows:addLabGrpButtons(props.data),
    });

    
    const handleDeleteLabGrp = (e) => {
        e.preventDefault();
        var filtered = datatable.rows.filter(function(el) { return el.lab_group != selected; });
        setDatatable(prevDatatable=>{return {...prevDatatable,rows:filtered}})
        // delete from db need to see the API 
        setDeleteModal(false)
    }

    const handleChange=()=>{
        //when the user types sth do wat?
    }

    const handleEditLabGrp=(labGrp)=>{
        //find the row and edit the row to the editable format!    
        let toEditIndex=datatable.rows.findIndex((row)=>(row.lab_group == labGrp))
        setEditing(true);
        //setEditingLabgrp(labGrp);
        Object.keys(datatable.rows[toEditIndex]).map((key)=>{
            if (key!='actions'){
                datatable.rows[toEditIndex][key] = <Form.Control
                autoFocus
                type="text"
                required
                value={datatable.rows[toEditIndex][key]}
                onChange={handleChange}
                placeholder={datatable.rows[toEditIndex][key]}
                />
            }
        })
        setDatatable(prevDatatable=>{
            return {...prevDatatable, rows:datatable.rows}
        })
    }

    const handleStopEdit=()=>{
        setEditing(false)
    }

    const handleSaveEditLabGrp=()=>{
        //push changes to datatable

    }

    return isEditing?<Container><MDBDataTableV5 
        hover 
        entriesOptions={[5,10, 20, 25]} 
        entries={20} 
        pagesAmount={4} 
        data={datatable} 
        searchTop 
        searchBottom={false} 
        />
        <div>
            <MDBBtn color="primary" size="sm" onClick={(e)=>handleSaveEditLabGrp(e)}>
                Save
            </MDBBtn>{' '}
            <MDBBtn color="danger" size="sm" onClick={()=>handleStopEdit()}>
                Delete
            </MDBBtn>{' '}
        </div></Container>
        :<Container><MDBDataTableV5 
        hover 
        entriesOptions={[5,10, 20, 25]} 
        entries={20} 
        pagesAmount={4} 
        data={datatable} 
        searchTop 
        searchBottom={false} 
        />
        <Modal show={showDeleteModal} onHide={()=>{setDeleteModal(false)}} centered>
            <Modal.Header closeButton>
                <Modal.Body>Are you sure you want to delete this Lab Group ({selected})?</Modal.Body>
            </Modal.Header>
            <Modal.Footer>
                <MDBBtn onClick={(e)=>handleDeleteLabGrp(e)
                }>
                Yes
                </MDBBtn>
                <MDBBtn color="danger" onClick={(e) => setDeleteModal(false)}>
                No
                </MDBBtn>
            </Modal.Footer>
        </Modal>
        </Container>
}