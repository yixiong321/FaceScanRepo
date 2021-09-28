
import { Container,Modal } from 'react-bootstrap';
import React,{ useState} from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import { MdDeleteForever,MdModeEdit,MdAddToPhotos} from "react-icons/md";
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'



export const LabGrpsTable=(props)=> {
//adding the btns for the different actions
const addLabGrpButtons=(data)=>{
    data.forEach(function (entry, index) {
        entry.btns = <div><Link to={`session?code=${entry.course_code}&index=${entry.index}&group=${entry.lab_group}`}>
            <MDBBtn color="primary" size="sm">
            <MdAddToPhotos></MdAddToPhotos>
            </MDBBtn>{' '}
        </Link>
        <MDBBtn color="secondary" size="sm">
            <MdModeEdit></MdModeEdit>
            </MDBBtn>{' '}
        <MDBBtn color="danger" size="sm" 
            onClick={(e) => {
                setDeleteModal(true)}
                
                }> 
        <MdDeleteForever></MdDeleteForever>
        </MDBBtn></div>
        });
    return data;
}

//this is to determine whether to show/hide the confirmation modal
const [showDeleteModal,setDeleteModal]=useState(false)
const [selected,setSelected] = useState(null)


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
    label: 'lab_group',
    field: 'lab_group',
    width: 150,
    },
    {
    label: 'Actions',
    field: 'btns',
    width: 150,
    sort: 'disabled',
    },
],
rows:addLabGrpButtons(props.data),
});
const rows = datatable.rows
function handleDeleteLabGrp(toDel){
    setDatatable(prevDatatable=>{
        return {...prevDatatable, rows: prevDatatable.rows.filter(row=>row.index != toDel)}
    })
}
function handleEditLabGrp(){
    //setDatatable()
}

return <Container><MDBDataTableV5 
    hover 
    entriesOptions={[5, 20, 25]} 
    entries={20} 
    pagesAmount={4} 
    data={datatable} 
    searchTop 
    searchBottom={false} 
    />
    <Modal show={showDeleteModal} /*onHide={handleConfirmDelete}*/ centered>
        <Modal.Header closeButton>
            <Modal.Body>Are you sure you want to delete this Lab Group?</Modal.Body>
        </Modal.Header>
        <Modal.Footer>
            <MDBBtn /*onClick=()=>{handleDeleteLabGrp}*/>
            Yes
            </MDBBtn>
            <MDBBtn color="danger" onClick={() => setDeleteModal(false)}>
            No
            </MDBBtn>
        </Modal.Footer>
    </Modal>
    </Container>
}