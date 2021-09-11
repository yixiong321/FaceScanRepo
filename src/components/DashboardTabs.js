import { MDBCardHeader, MDBCheckbox, MDBContainer } from 'mdb-react-ui-kit';
import Groups from "../data/groups";
import { LabGrpsTable } from "./LabGroupTable";
import { HistoryTable } from "./historyTable.";
import history from "../data/History";
import { NamelistTable } from "./Namelist";
import students from "../data/students";
import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn
} from 'mdb-react-ui-kit';

export default function TabsSYS() {
  const [basicActive, setBasicActive] = useState('tab1');

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  return (
    <MDBCard className='shadow-5-strong' >
      <MDBTabs className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink className="tabsys" onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
            Lab Groups
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink className="tabsys" onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
            View Attendance History
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink className="tabsys" onClick={() => handleBasicClick('tab3')} active={basicActive === 'tab3'}>
            Students(test)
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
   
      <MDBTabsContent>
        <MDBTabsPane show={basicActive === 'tab1'}>
            <MDBContainer>
                <LabGrpsTable data={Groups}></LabGrpsTable>
            </MDBContainer>
        </MDBTabsPane>
        <MDBTabsPane show={basicActive === 'tab2'}>
            <MDBContainer>
                <h4>Filters:</h4>
                <MDBCheckbox inline name='flexCheck' value='' id='LabGrpCheckbox' label='Lab Group' />
                <MDBCheckbox inline name='flexCheck' value='' id='DateCheckbox' label='Date (Oldest to Latest)' />
                <HistoryTable data={history}></HistoryTable>
            </MDBContainer>
        </MDBTabsPane>
        <MDBTabsPane show={basicActive === 'tab3'}>
            <MDBContainer>
                <NamelistTable data={students}></NamelistTable>
            </MDBContainer>
        </MDBTabsPane>
      </MDBTabsContent>
     
    </MDBCard>
  );
}