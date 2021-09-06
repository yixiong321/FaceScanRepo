
import {AiFillFolderOpen} from "react-icons/ai"
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';
const renderHistory =(history,index)=>{
    return (
        <tr key={index}>
            <td>{history.date}</td>
            <td>{history.lab_group}</td>  
            <td>
            <MDBBtn  color="info" size="sm">
                <AiFillFolderOpen></AiFillFolderOpen>
                </MDBBtn >
            </td>          
        </tr>

    )
}

export const HistoryTable=(props)=>{
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
                {props.data.map(renderHistory)}
            </MDBTableBody>
        </MDBTable>
    )
}