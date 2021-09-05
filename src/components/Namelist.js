import Table from 'react-bootstrap/Table'


const renderStudents =(Student,index)=>{
    return (
        <tr key={index}>
            <td>{Student.name}</td>
            <td>{Student.matric_number}</td>  
            <td>
            <select name="attendence" >
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
        <Table responsive hover >
            <thead>
                <tr>
                    {Object.keys(props.data[0]).map(
                        key=>{return <th key={key}>{key.toUpperCase()}</th>})}
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map(renderStudents)}
            </tbody>
        </Table>
    )
}