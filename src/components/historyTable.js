import React, { useState, useEffect } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { MDBBtn } from "mdb-react-ui-kit";
import { AiFillFolderOpen } from "react-icons/ai";
import { Link } from "react-router-dom";
import SessionDataService from "../service/session-http";
import { useGlobalContext } from "./Context";

const addHistoryButtons = (data) => {
  data.forEach(function (element) {
    element.btns = (
      <Link to={`attendance/lab_session=${element.id}/${element.labGrp}/${element.lab_grp_id}`}>
        <MDBBtn color="info" size="sm">
          <AiFillFolderOpen></AiFillFolderOpen>
        </MDBBtn>
      </Link>
    );
  });
  return data;
};
const formatSessionData = (labGroupData, sessionData) => {
  let newList = [];
  for (let x = 0; x < sessionData.length; x++) {
    for (let i = 0; i < labGroupData.length; i++) {
      if (labGroupData[i].lab_group_id === sessionData[x].lab_group) {
        let lab_grp_id = labGroupData[i].lab_group_id
        let labGrp = labGroupData[i].lab_group_name;
        let id = sessionData[x].id;
        let session_name = sessionData[x].session_name;
        let date_time_start = sessionData[x].date_time_start;
        let date_time_end = sessionData[x].date_time_end;
        let newObj = {
          id,
          session_name,
          date_time_start,
          date_time_end,
          labGrp,
          lab_grp_id
        };
        newList.push(newObj);
      }
    }
  }

  return newList;
};

const prepareSessionRows = (labData, SessData) => {
  let x = formatSessionData(labData, SessData);
  let y = addHistoryButtons(x);
  return y;
};

export const HistoryTable = () => {
  const { globalLabGroups } = useGlobalContext();
  const [labGroups, setLabGroups] = useState([...globalLabGroups]);
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: " Session ID",
        field: "id",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "id",
        },
      },
      {
        label: "Session Name",
        field: "session_name",
        width: 150,
      },
      {
        label: "Lab Group",
        field: "labGrp",
        width: 150,
      },
      {
        label: "Lab Group ID",
        field: "lab_grp_id",
        width: 150,
      },
      {
        label: "Start",
        field: "date_time_start",
        width: 150,
      },
      {
        label: "End",
        field: "date_time_end",
        width: 150,
      },

      {
        label: "Actions",
        field: "btns",
        width: 150,
        sort: "disabled",
      },
    ],
    rows: [],
  });

  useEffect(() => {
    let isSubscribed = true;
    SessionDataService.getSessions().then((response) => {
      if (isSubscribed) {
        let x = prepareSessionRows(labGroups, response.data);
        setDatatable((prevDatatable) => {
          return { ...prevDatatable, rows: x };
        });
      }
    });
    return () => (isSubscribed = false);
  }, [labGroups]);

  return (
    <MDBDataTableV5
      hover
      entriesOptions={[5, 20, 25]}
      entries={20}
      pagesAmount={4}
      data={datatable}
      searchTop
      searchBottom={false}
    />
  );
};
