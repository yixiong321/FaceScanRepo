import { Container, Modal } from "react-bootstrap";
import { useState } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { MDBBtn } from "mdb-react-ui-kit";
import { useGlobalContext } from "./Context";
// import LabGroupDataService from "../service/lab-group-http"
// import CourseDataService from "../service/course-http"

export const LabGrpsTable = () => {
  //// STATES ///
  //this is to determine whether to show/hide the confirmation modal
  const { globalLabGroups } = useGlobalContext();

  const [showDeleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [labGroups, setLabGroups] = useState([...globalLabGroups]);

  //adding the btns for the different actions
  const addLabGrpButtons = (data) => {
    data.forEach(function (entry) {
      entry.actions = isEditing ? (
        <div>
          <MDBBtn color="primary" size="sm" disabled className="tableBtns">
            New
          </MDBBtn>{" "}
          <MDBBtn
            color="secondary"
            size="sm"
            disabled
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => handleEditLabGrp(e.target.value)}
            className="tableBtns"
          >
            Edit
          </MDBBtn>{" "}
          <MDBBtn
            color="danger"
            size="sm"
            disabled
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => {
              setSelected(e.target.value);
              setDeleteModal(true);
            }}
          >
            Del
          </MDBBtn>
        </div>
      ) : (
        <div>
          <MDBBtn color="primary" size="sm" className="tableBtns">
            New
          </MDBBtn>{" "}
          <MDBBtn
            color="secondary"
            className="tableBtns"
            size="sm"
            value={entry.lab_group_id}
            onClick={(e) => {
              handleEditLabGrp(e.target.value);
            }}
          >
            Edit
          </MDBBtn>{" "}
          <MDBBtn
            color="danger"
            size="sm"
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => {
              setSelected(e.target.value);
              setDeleteModal(true);
            }}
          >
            Del
          </MDBBtn>
        </div>
      );
    });
    return data;
  };

  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "ID",
        field: "lab_group_id",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Date",
        },
      },
      {
        label: "Course code",
        field: "course_code",
        width: 150,
      },
      {
        label: "Course Name",
        field: "course_name",
        width: 150,
      },
      {
        label: "Lab Group",
        field: "lab_group_name",
        width: 150,
      },
      {
        label: "Actions",
        field: "actions",
        width: 150,
        sort: "disabled",
      },
    ],
    rows: addLabGrpButtons(labGroups),
  });

  const handleDeleteLabGrp = (e) => {
    e.preventDefault();
    var filtered = datatable.rows.filter(function (el) {
      return el.lab_group_id != selected;
    });
    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: filtered };
    });
    // delete from db need to see the API
    setDeleteModal(false);
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

  const postNewSession = () => {
    return;
    //get the current datetime
    //id,session_name,date_time_start,date_time_end,lab_group
    //get the variables and push to the db
    //encode the variables to the url.
  };

  const handleEditLabGrp = (labGrpID) => {
    //find the row and edit the row to the editable format!
    let toEditIndex = datatable.rows.findIndex(
      (row) => row.lab_group_id == labGrpID
    );
    // console.log(datatable.rows[toEditIndex])
    setEditRow({ ...datatable.rows[toEditIndex] });
    setEditIndex(toEditIndex);
    setEditing(true);
    setNewRow({ ...datatable.rows[toEditIndex] });

    Object.keys(datatable.rows[toEditIndex]).map((key) => {
      if (key != "actions") {
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

  const handleStopEdit = () => {
    datatable.rows[editIndex] = editRow;
    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: datatable.rows };
    });
    setEditing(false);
  };

  const handleSaveEditLabGrp = () => {
    //push changes to datatable
    datatable.rows[editIndex] = newRow;
    // console.log(newRow)
    setDatatable((prevDatatable) => {
      return { ...prevDatatable, rows: datatable.rows };
    });
    setEditing(false);
  };

  return isEditing ? (
    <Container>
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 20, 25]}
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
          onClick={() => handleSaveEditLabGrp()}
        >
          Save
        </MDBBtn>{" "}
        <MDBBtn color="danger" size="sm" onClick={() => handleStopEdit()}>
          Cancel
        </MDBBtn>{" "}
      </div>
    </Container>
  ) : (
    <Container>
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 20, 25]}
        entries={20}
        pagesAmount={4}
        data={datatable}
        searchTop
        searchBottom={false}
      />
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setDeleteModal(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Body>
            Are you sure you want to delete this Lab Group ({selected})?
          </Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <MDBBtn onClick={(e) => handleDeleteLabGrp(e)}>Yes</MDBBtn>
          <MDBBtn color="danger" onClick={(e) => setDeleteModal(false)}>
            No
          </MDBBtn>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
