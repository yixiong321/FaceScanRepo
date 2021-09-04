import {Container,Tabs,Tab,Card,Nav} from "react-bootstrap" ;
import Groups from "../data/groups";
import { LabGrpsTable } from "./LabGroupTable";

export const DashboardTabs = () => {
    return (
        <Card bg='light' >
            <Tabs defaultActiveKey="Lab Groups" id="dashboardTabs" className="mb-3 px-3" >
            <Tab eventKey="Lab Groups" title="Lab Groups" className="" >
                <Container >
                    <LabGrpsTable data={Groups}></LabGrpsTable>
                </Container>
            </Tab>
            <Tab eventKey="View Attendence History" title="View Attendence History">
                <Container />
            </Tab>
            </Tabs>
        </Card>

    )
}
