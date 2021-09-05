import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import {AiFillFolderOpen} from "react-icons/ai"

const renderHistory =(history,index)=>{
    return (
        <tr key={index}>
            <td>{history.date}</td>
            <td>{history.lab_group}</td>  
            <td>
            <Button variant="info" size="sm">
                <AiFillFolderOpen></AiFillFolderOpen>
                </Button>{' '}
            </td>          
        </tr>

    )
}

export const HistoryTable=(props)=>{
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
                {props.data.map(renderHistory)}
            </tbody>
        </Table>
    )
}