import React,{ useState} from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import { MDBCard } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';

const addNamelistSelect =(dataJson)=>{
    dataJson.forEach(function(element){
        element.attendance = <select aria-label="attendance">
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Absent with Valid Reason">Absent with Valid Reason</option>
                            </select>
    })

    return dataJson
}

const NamelistTable=(props)=> {
    const [datatable, setDatatable] = useState({
      columns: [
        {
          label: 'Name',
          field: 'name',
          width: 150,
          attributes: {
            'aria-controls': 'DataTable',
            'aria-label': 'Name',
          },
        },
        {
          label: 'Matric Number',
          field: 'matric_number',
          width: 150,
        },
        {
            label: 'Group',
            field: 'group',
            width: 150,
        },
        {
            label: 'Attendance',
            field: 'attendance',
            width: 150,
        },
      ],
      rows:addNamelistSelect(props.data),
    });
    const handleSaveChanges=()=>{
        //push changes to db
        //might want to show a message on successful 
        //SetDatatable()
    }

    return (<MDBCard className='shadow-5-strong p-3'>
        <MDBDataTableV5 
        hover 
        entriesOptions={[5, 20, 25]} 
        entries={20} 
        pagesAmount={4} 
        data={datatable} 
        searchTop 
        searchBottom={false} 
        />
        <MDBBtn size='sm' onClick={()=>{handleSaveChanges()}}>Save Changes</MDBBtn>
    </MDBCard>)
    
  }

export default NamelistTable;