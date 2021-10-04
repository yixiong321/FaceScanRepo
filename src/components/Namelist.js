import React, { useState, useEffect } from 'react';
import { MDBDataTableV5, MDBInput } from 'mdbreact';
import { MDBCard } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';
import AttendanceDataService from '../service/attendance-http'
import {
  useParams
} from "react-router-dom";

export const JFC=(session)=>{
  const [payload,setPayload]=useState(null)
  async function getData(){
    let res = await AttendanceDataService.getAttendanceFromSessionId(session)
    setPayload(res.data)
  }
  useEffect(()=>{
    getData();
  },[])
  //console.log('payload',payload)
  return payload
}

export const NamelistTable = () => {
  const {sessionid} = useParams()
  const data =  JFC(sessionid)
  const [testing,setTesting]= useState(0)
  //console.log('here',data)
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: 'Student Name',
        field: 'student',
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'student',
        },
      },
      {
        label: 'Matric Number',
        field: 'matric_number',
      },
      {
        label: 'Date Time Captured',
        field: 'date_time_captured',
      },
      {
        label: 'Date Time Modified',
        field: 'date_time_modified',
      },
      {
        label: 'Attendance Status',
        field: 'attendance',
      },
      {
        label: 'Remarks',
        field: 'remarks',
      },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
      },
    ],
    rows:data
  })
  
  const [selected, setSelected] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({})
  
  useEffect(()=>{
    let isSubscribed = true;
      AttendanceDataService.getAttendanceFromSessionId(sessionid).then(
        response =>{
          if(isSubscribed){
            const x =response.data
            setDatatable((prevDatatable) => {
              return {...prevDatatable, rows:x};
            });
            let y=testing+1
            setTesting(y)
          }})
      return () => (isSubscribed = false)
  }, []);  

  useEffect(() => {
    console.log('wtf',datatable)
    
  }, [testing]);

  const addNamelistSelect = (dataJson) => {
    dataJson.forEach(function (element) {
      element.attendance = <select value={`${element.status}`} 
      //onChange={(e)=>handleSelectChange(e)}
      aria-label="attendance">
        <option value="1" >Present</option>
        <option value="2" >Absent</option>
        <option value="3">Late</option>
        <option value="4" >Absent with Valid Reason</option>
      </select>

      element.actions = isEditing ? (
        <div>
          <MDBBtn
            color="secondary"
            size="sm"
            disabled
            className="tableBtns"
            value={element.student}
            onClick={(e) => {handleEditAttendance(e.target.value)}}
            className="tableBtns"
          >
            Edit
          </MDBBtn>
        </div>
      ) : (
        <div>
          <MDBBtn
            color="secondary"
            className="tableBtns"
            size="sm"
            value={element.student}
            onClick={(e) => {handleEditAttendance(e.target.value)}}
          >
            Edit
          </MDBBtn>
        </div>
      )
      })
      return dataJson
    }
    const handleEditAttendance = (studentID) => {
      //find the row and edit the row to the editable format!
       setEditing(true)
      console.log(studentID)
      console.log(datatable.rows) 
    }


  return (isEditing ? <MDBCard className='shadow-5-strong p-3'>
    <MDBDataTableV5
      hover
      entriesOptions={[5, 20, 25]}
      entries={20}
      pagesAmount={4}
      data={datatable}
      searchTop
      searchBottom={false}
    />
    <div>
      <MDBBtn
        color="primary"
        size="sm"
        //onClick={() => handleSaveEditAtd()}
      >
        Save
      </MDBBtn>{" "}
      <MDBBtn color="danger" size="sm" 
      //onClick={() => handleStopEditAtd()}
      >
        Cancel
      </MDBBtn>{" "}
    </div>
  </MDBCard> :
    <MDBCard className='shadow-5-strong p-3'>
      <MDBDataTableV5
        hover
        entriesOptions={[5, 20, 25]}
        entries={20}
        pagesAmount={4}
        data={datatable}
        searchTop
        searchBottom={false}
      />
    </MDBCard>)

}
