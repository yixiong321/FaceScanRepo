
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';


const renderStudents =(Student,index)=>{
    return (
        <tr key={index}>
            <td>{Student.name}</td>
            <td>{Student.matric_number}</td>  
            <td>
            <select name="attendance" >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Absent with Valid Reason">Absent with Valid Reason</option>
            </select>
            </td>          
        </tr>

    )
}

export const NamelistTable=(props)=>{
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
                {props.data.map(renderStudents)}
            </MDBTableBody>
        </MDBTable>
    )
}