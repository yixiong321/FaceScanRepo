
import { MdDeleteForever,MdModeEdit,MdAddToPhotos} from "react-icons/md";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'

const renderEntry =(entry,index)=>{
    return (
        <tr key={index}>
            <td>{entry.id}</td>
            <td>{entry.course_code}</td>
            <td>{entry.index}</td>
            <td>{entry.lab_group}</td>
            <td>
            <Link to={`session?code=${entry.course_code}&index=${entry.index}&group=${entry.lab_group}`}>
            <MDBBtn color="primary" size="sm">
                <MdAddToPhotos></MdAddToPhotos>
                </MDBBtn>{' '}
            </Link>
            <MDBBtn color="secondary" size="sm">
                <MdModeEdit></MdModeEdit>
                </MDBBtn>{' '}
            <MDBBtn color="danger" size="sm">
            <MdDeleteForever></MdDeleteForever>
            </MDBBtn>
            </td>

            
        </tr>
    )
}


export const LabGrpsTable=(props)=>{
    return (
        <MDBTable responsive hover >
            <MDBTableHead>
                <tr>
                    {Object.keys(props.data[0]).map(
                        key=>{return <th key={key}>{key.toUpperCase()}</th>})}
                    <th>ACTIONS</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {props.data.map(renderEntry)}
            </MDBTableBody>
        </MDBTable>
    )
}