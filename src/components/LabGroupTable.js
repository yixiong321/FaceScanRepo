import Table from 'react-bootstrap/Table'
import groups from '../data/groups'
import Button from 'react-bootstrap/Button'
import { MdDeleteForever,MdModeEdit,MdAddToPhotos} from "react-icons/md";

const renderEntry =(entry,index)=>{
    return (
        <tr key={index}>
            <td>{entry.id}</td>
            <td>{entry.course_code}</td>
            <td>{entry.index}</td>
            <td>{entry.lab_group}</td>
            <td>
            <Button variant="primary" size="sm">
                <MdAddToPhotos></MdAddToPhotos>
                </Button>{' '}
            <Button variant="secondary" size="sm">
                <MdModeEdit></MdModeEdit>
                </Button>{' '}
            <Button variant="danger" size="sm">
            <MdDeleteForever></MdDeleteForever>
            </Button>
            
            </td>

            
        </tr>
    )
}


export const LabGrpsTable=(props)=>{
    return (
        <Table responsive hover >
            <thead>
                <tr>
                    {Object.keys(props.data[0]).map(
                        key=>{return <th key={key}>{key}</th>})}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map(renderEntry)}
            </tbody>
        </Table>
    )
}