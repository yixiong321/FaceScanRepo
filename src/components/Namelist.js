import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { MDBCard } from "mdb-react-ui-kit";
import { MDBBtn } from "mdb-react-ui-kit";
import AttendanceDataService from "../service/attendance-http";
import StudentDataService from "../service/student-http";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import {FaEdit} from "react-icons/fa";

export const NamelistTable = () => {
  const { sessionid } = useParams();
  const [testing, setTesting] = useState(0);
  //console.log('here',data)

  const [selected, setSelected] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [allow, setAllow] = useState(0);
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Student Name",
        field: "student",
        width: 100,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "student",
        },
      },
      {
        label: "Matric Number",
        field: "matric_number",
        width: 100,
      },
      /*       {
        label: 'Date Time Captured',
        field: 'date_time_captured',
        width: 100,
      },
      {
        label: 'Date Time Modified',
        field: 'date_time_modified',
        width: 100,
      }, */
      {
        label: "Attendance Status",
        field: "attendance",
      },
      {
        label: "Remarks",
        field: "remarks",
        width:150
      },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
      },
    ],
    rows: [],
  });

  useEffect(() => {
    let isSubscribed = true;
    AttendanceDataService.getAttendanceFromSessionId(sessionid).then(
      (response) => {
        if (isSubscribed) {
          const x = response.data;
          setDatatable((prevDatatable) => {
            return { ...prevDatatable, rows: x };
          });
          let y = testing + 1;
          setTesting(y);
        }
      }
    );

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    const handleChange = (e, index, key) => {
      datatable.rows[index][key] = (
        <MDBInput
          maxlength={256}
          value={e.target.value}
          onChange={(e) => handleChange(e, index, key)}
        ></MDBInput>
      );
      setNewRow((prevNewRow) => {
        return { ...prevNewRow, [key]: e.target.value };
      });

      setDatatable((prevDatatable) => {
        return { ...prevDatatable, rows: datatable.rows };
      });
    };
    const handleEditAttendance = (studentID) => {
      //find the row and edit the row to the editable format!
      let select = document.getElementById(studentID);
      select.removeAttribute("disabled");
      setEditing(true);
      let toEditIndex = datatable.rows.findIndex(
        (row) => row.student == studentID
      );
      // console.log(datatable.rows[toEditIndex])
      setEditRow({ ...datatable.rows[toEditIndex] });
      setEditIndex(toEditIndex);
      setNewRow({ ...datatable.rows[toEditIndex] });
      Object.keys(datatable.rows[toEditIndex]).map((key) => {
        if (key === "remarks") {
          datatable.rows[toEditIndex][key] = (
            <MDBInput
              value={datatable.rows[toEditIndex][key]}
              onChange={(e) => handleChange(e, toEditIndex, key)}
            ></MDBInput>
          );
        }
      });
      setDatatable((prevDatatable) => {
        return { ...prevDatatable, rows: datatable.rows };
      });
    };
    const addNamelistSelect = (dataJson) => {
      dataJson.forEach(function (element) {
        element.attendance = (
          <select
            id={`${element.student}`}
            disabled
            className="selection"
            value={`${element.status}` + `${element.student}`}
            onChange={(e) => handleSelectChange(e)}
            aria-label="attendance"
          >
            <option value={"1" + `${element.student}`}>Present</option>
            <option value={"2" + `${element.student}`}>Absent</option>
            <option value={"3" + `${element.student}`}>Late</option>
            <option value={"4" + `${element.student}`}>
              Absent with Valid Reason
            </option>
          </select>
        );

        element.actions = isEditing ? (
          <div>
            <MDBBtn color="secondary" size="sm" disabled className="tableBtns">
              <FaEdit />
            </MDBBtn>
          </div>
        ) : (
          <div>
            <MDBBtn
              color="secondary"
              className="tableBtns"
              size="sm"
              value={element.student}
              onClick={(e) => {
                handleEditAttendance(e.currentTarget.value);
              }}
            >
              <FaEdit />
            </MDBBtn>
          </div>
        );
      });
      return dataJson;
    };
    function handleSelectChange(event) {
      var selectElement = event.target;
      var value = selectElement.value;
      let studentid = value.slice(1);
      console.log(studentid);
      let stat = value[0];
      console.log(stat);

      let toEditIndex = datatable.rows.findIndex(
        (row) => row.student == studentid
      );

      datatable.rows[toEditIndex].status = stat;
      setNewRow((prevNewRow) => {
        return { ...prevNewRow, status: stat };
      });
      setDatatable((prevDatatable) => {
        return { ...prevDatatable, rows: addNamelistSelect(datatable.rows) };
      });

      // do whatever you want with value
    }

    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: addNamelistSelect(datatable.rows) };
    });
  }, [testing, isEditing]);

  const handleSaveEditAtd = () => {
    //need to push the edited value
    // changing data modified,edited remark and status

    let data = new FormData();
    data.append("remarks", `${newRow.remarks}`);
    data.append("status", `${newRow.status}`);
    data.append("student",`${newRow.student}`);
    data.append("lab_session",`${parseInt(sessionid.slice(12))}`);
    
    AttendanceDataService.patchAttendanceFromID(newRow.id,data).then(
      async() => {
        //fetch the data
        console.log("inside");
        let response=await AttendanceDataService.getAttendanceFromSessionId(sessionid);
        console.log(response.data);
        setDatatable((prevDatatable) => {
          return { ...prevDatatable, rows: response.data };
        });
        setEditing(false);
      }
    );
  };

  const handleStopEditAtd = () => {
    let select = document.getElementById(datatable.rows[editIndex].student);
    select.setAttribute("disabled", "");
    datatable.rows[editIndex] = editRow;
    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: datatable.rows };
    });
    setEditing(false);
  };
  const handleChange = (e, index, key) => {
    datatable.rows[index][key] = (
      <MDBInput
        value={e.target.value}
        onChange={(e) => handleChange(e, index, key)}
      ></MDBInput>
    );

    setNewRow((prevNewRow) => {
      return { ...prevNewRow, [key]: e.target.value };
    });

    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: datatable.rows };
    });
  };

  return isEditing ? (
    <Container>
      <MDBCard className="shadow-5-strong p-3">
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
          <MDBBtn color="primary" size="sm" onClick={() => handleSaveEditAtd()}>
            Save
          </MDBBtn>{" "}
          <MDBBtn color="danger" size="sm" onClick={() => handleStopEditAtd()}>
            Cancel
          </MDBBtn>{" "}
        </div>
      </MDBCard>
    </Container>
  ) : (
    <Container>
      <MDBCard className="shadow-5-strong p-3">
        <MDBDataTableV5
          hover
          entriesOptions={[5, 20, 25]}
          entries={20}
          pagesAmount={4}
          data={datatable}
          searchTop
          searchBottom={false}
        />
      </MDBCard>
    </Container>
  );
};
