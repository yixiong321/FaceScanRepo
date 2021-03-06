import { MDBContainer } from "mdb-react-ui-kit";
import { LabGrpsTable } from "./LabGroupTable";
import { HistoryTable } from "./HistoryTable";
import React, { useState } from "react";

import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCard,
} from "mdb-react-ui-kit";

export default function TabsSYS() {
  const [basicActive, setBasicActive] = useState("tab1");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  return (
    <MDBCard className="shadow-5-strong">
      <MDBTabs className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            className="tabsys"
            onClick={() => handleBasicClick("tab1")}
            active={basicActive === "tab1"}
          >
            Lab Groups
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            className="tabsys"
            onClick={() => handleBasicClick("tab2")}
            active={basicActive === "tab2"}
          >
            View Past Sessions
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={basicActive === "tab1"}>
          <MDBContainer>
            <LabGrpsTable></LabGrpsTable>
          </MDBContainer>
        </MDBTabsPane>
        <MDBTabsPane show={basicActive === "tab2"}>
          <MDBContainer>
            <HistoryTable></HistoryTable>
          </MDBContainer>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBCard>
  );
}