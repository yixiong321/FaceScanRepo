import {Button,Container,Tabs,Tab,Card,Form} from "react-bootstrap" ;
import Groups from "../data/groups";
import { LabGrpsTable } from "./LabGroupTable";
import { HistoryTable } from "./historyTable.";
import history from "../data/History";
import { NamelistTable } from "./Namelist";
import students from "../data/students";

export const DashboardTabs = () => {
    return (
        <Card variant="light" border="dark" className="cardy">
            <Tabs variant="pills"  defaultActiveKey="Lab Groups" id="dashboardTabs" className="mb-3 px-2 tabsSystem">
                <Tab eventKey="Lab Groups" title="Lab Groups">       
                    <Container className="containerTable">
                        <LabGrpsTable data={Groups}></LabGrpsTable>
                    </Container>
                </Tab>
                <Tab eventKey="View Attendence History" title="View Attendence History">
                    <Container className="containerTable">
                        <Form>
                            {['checkbox'].map((type) => (
                                <div key={`default-${type}`} className="mb-3">
                                <h5>Filter By:</h5>
                                <Form.Check 
                                    type={type}
                                    id={`default-${type}`}
                                    label="Lab Group"
                                    inline
                                />
                                <Form.Check
                                    type={type}
                                    label="Date"
                                    id={`default ${type} 1`}
                                    inline
                                />
                                </div>
                            ))}
                        </Form>
                        <HistoryTable data={history}></HistoryTable>
                    </Container>
                </Tab>
                <Tab eventKey="student" title="student">       
                    <Container className="containerTable">
                        <NamelistTable data={students}></NamelistTable>
                    </Container>
                </Tab>
            </Tabs>
        </Card>

    )
}
