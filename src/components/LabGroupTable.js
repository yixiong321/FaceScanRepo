import { Container, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { MDBBtn } from "mdb-react-ui-kit";
import { useGlobalContext } from "./Context";
import LabGroupDataService from "../service/lab-group-http";
import SessionDataService from "../service/session-http";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export const LabGrpsTable = () => {

  const { globalLabGroups, setGoFetch, goFetch } =
    useGlobalContext();

  const [showDeleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [labGroups, setLabGroups] = useState([...globalLabGroups]);
  const [startSession, setStartSession] = useState(false);
  const sessionData = {
    course: 0,
    session_name: "",
    date_time_start: "",
    date_time_end: "",
    lab_group: 0,
  };
  const [session, setSession] = useState(sessionData);
  const [errors, setErrors] = useState({});

  const addLabGrpButtons = (data) => {
    data.forEach(function (entry) {
      entry.actions = isEditing ? (
        <div>
          <MDBBtn color="primary" size="sm" disabled className="tableBtns">
            <FaPlus />
          </MDBBtn>{" "}
          <MDBBtn
            color="secondary"
            size="sm"
            disabled
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => handleEditLabGrp(e.target.value)}
          >
            <FaEdit />
          </MDBBtn>{" "}
          <MDBBtn
            color="danger"
            size="sm"
            disabled
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => {
              setSelected(e.currentTarget.value);
              setDeleteModal(true);
            }}
          >
            <FaTrash />
          </MDBBtn>
        </div>
      ) : (
        <div>
          <MDBBtn
            color="primary"
            size="sm"
            className="tableBtns"
            onClick={(e) => {
              setSession({
                ...session,
                lab_group: entry.lab_group_id,
                course: entry.course_id,
              });
              setStartSession(true);
            }}
          >
            <FaPlus />
          </MDBBtn>{" "}
          <MDBBtn
            color="secondary"
            className="tableBtns"
            size="sm"
            value={entry.lab_group_id}
            onClick={(e) => {
              handleEditLabGrp(e.currentTarget.value);
            }}
          >
            <FaEdit />
          </MDBBtn>{" "}
          <MDBBtn
            color="danger"
            size="sm"
            className="tableBtns"
            value={entry.lab_group_id}
            onClick={(e) => {
              setSelected(e.currentTarget.value);
              setDeleteModal(true);
            }}
          >
            <FaTrash />
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
        label: "Course Code",
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

  const handleDeleteLabGrp = async (e) => {
    e.preventDefault();
    // delete from db
    for (let i = 0; i < labGroups.length; i++) {
      if (labGroups[i].lab_group_id == selected) {
        labGroups.splice(i, 1);
        console.log("found to be deleted");
      }
    }

    LabGroupDataService.deleteLabGroup(selected).then(() => {
      let x = goFetch + 1;
      setGoFetch(x);
      let filtered = addLabGrpButtons(labGroups);
      setEditing(false);
      setDatatable((prevDatatable) => {
        return { ...prevDatatable, rows: filtered };
      });
    });
    setDeleteModal(false);
  };

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

  const handleEditLabGrp = (labGrpID) => {
    //find the row and edit the row to the editable format!
    let toEditIndex = datatable.rows.findIndex(
      (row) => row.lab_group_id == labGrpID
    );
    setEditRow({ ...datatable.rows[toEditIndex] });
    setEditIndex(toEditIndex);
    setEditing(true);
    setNewRow({ ...datatable.rows[toEditIndex] });

    Object.keys(datatable.rows[toEditIndex]).map((key) => {
      if (key === "lab_group_name") {
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
    let data = {
      lab_group_name: newRow.lab_group_name,
    };
    labGroups[editIndex] = newRow;
    LabGroupDataService.updateLabGroup(newRow.lab_group_id, data).then(() => {
      let x = goFetch + 1;
      setGoFetch(x);
      let filtered = addLabGrpButtons(labGroups);
      setEditing(false);
      setDatatable((prevDatatable) => {
        return { ...prevDatatable, rows: filtered };
      });
    });
    setEditing(false);
  };

  const handleFormChange = (field, value) => {
    setSession({
      ...session,
      [field]: value,
    });
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = async () => {
    const newErrors = {};
    const response = await checkServerResponse();

    if (response && response.session_name) {
      newErrors.session_name = response.session_name[0];
    }

    return newErrors;
  };

  const checkServerResponse = async () => {
    try {
      const {
        course,
        session_name,
        date_time_start,
        date_time_end,
        lab_group,
      } = session;
      const data = {
        session_name,
        date_time_start,
        date_time_end,
        lab_group,
      };
      const {
        data: { id },
      } = await SessionDataService.postNewSession(data);

      window.open(
        `/session?session=${id}&course=${course}&lab_group=${lab_group}`,
        "_blank"
      );
    } catch (e) {
      return e.response?.data;
    }
  };

  const handleStartSession = async (e) => {
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setSession(sessionData);
      setStartSession(false);
    }
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
      <Modal
        show={startSession}
        onHide={() => {
          setStartSession(false);
        }}
      >
        <Modal.Header>
          <Modal.Body>
            <Form>
              <h5>New Session for Lab Group {session.lab_group}</h5>
              <Form.Group className="my-4" controlId="session_name">
                <Form.Label>Session Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={session.session_name}
                  onChange={(e) =>
                    handleFormChange("session_name", e.target.value)
                  }
                  isInvalid={!!errors.session_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.session_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4" controlId="date_time_start">
                <Form.Label>Start Date and Time</Form.Label>
                <Datetime
                  inputProps={{ required: true }}
                  value={session.date_time_start}
                  onChange={(moment) =>
                    handleFormChange("date_time_start", moment)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="date_time_end">
                <Form.Label>End Date and Time</Form.Label>
                <Datetime
                  inputProps={{ required: true }}
                  value={session.date_time_end}
                  onChange={(moment) =>
                    handleFormChange("date_time_end", moment)
                  }
                />
              </Form.Group>
              <Modal.Footer>
                <MDBBtn onClick={handleStartSession}>
                  Start a new lab session
                </MDBBtn>
                <MDBBtn color="danger" onClick={() => setStartSession(false)}>
                  Cancel
                </MDBBtn>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </Container>
  );
};
