
import React from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import { MDBBtn } from 'mdb-react-ui-kit';
import {AiFillFolderOpen} from "react-icons/ai"

const addHistoryButtons=(data)=>{
    data.forEach(function (element) {
        element.btns = <MDBBtn  color="info" size="sm" >
                        <AiFillFolderOpen></AiFillFolderOpen>
                        </MDBBtn >;
      });
    return data;
}

export const HistoryTable=(props)=> {
  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: 'Date',
        field: 'date',
        width: 150,
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'Date',
        },
      },
      {
        label: 'Lab Group',
        field: 'lab_group',
        width: 150,
      },
      {
        label: 'Actions',
        field: 'btns',
        width: 150,
        sort: 'disabled',
      },
    ],
    rows:addHistoryButtons(props.data),
  });

  return <MDBDataTableV5 
  hover 
  entriesOptions={[5, 20, 25]} 
  entries={20} 
  pagesAmount={4} 
  data={datatable} 
  searchTop 
  searchBottom={false} 
  />;
}