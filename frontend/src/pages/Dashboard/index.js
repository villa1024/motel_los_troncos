import React, { Component, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { timeFormat, moneyFormat } from "../../helpers/formatters";
import { get } from '../../api'

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Components
// import MiniWidgets from "./MiniWidgets";
import MiniWidgets from "../../components/Common/MiniWidgets";
import CajaGraph from "./CajaGraph";
import UsersTable from "./UsersTable";
import RecentlyRegistros from "./RecentlyRegistros";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
import EarningReports from "./EarningReports";
import Sources from "./Sources";
import RecentlyActivity from "./RecentlyActivity";
import RevenueByLocations from "./RevenueByLocations";
import ChatBox from "./ChatBox";
import LatestTransactions from "./LatestTransactions";

export default () => {
    const [data, setData] = useState([])
    const [caja, setCaja] = useState(0)
    const [registros, setRegistros] = useState([])
    const breadcrumbItems = [
        { title: "Dashboard", link: "#" },
    ]

    useEffect(() => {
        get('api/caja/info').then(res => {
            setData(res.informacion)
            setCaja(res.caja)
        })

        get('api/registros/getRegistros').then(res => {
            setRegistros(res.allRegistros.map(item => {
                const date = new Date(item.fecha)
                return ({
                    ...item,
                    fecha: `${timeFormat(date.getDate())}/${timeFormat(date.getMonth())}/${date.getFullYear()}`,
                    hora: `${timeFormat(date.getHours())}:${timeFormat(date.getMinutes())}`
                })
            }))
        })
    }, [])

    function get_variation(x1, x2) {
        x1 = x1 == null ? 0 : x1;
        x2 = x2 == null ? 0 : x2;
        return x1 == 0 && x2 == 0 ? 0 : (x1 == 0 ? -100 : (x2 == 0 ? 100 : (
            ((x1 - x2) / x2) * 100)));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <MiniWidgets
                            title="Caja"
                            value={moneyFormat(caja)}
                            showRate={false}
                        // icon="ri-stack-line"
                        // rate={0}
                        // desc="Desde el mes anterior"
                        />
                        <MiniWidgets
                            title="Ventas"
                            value={moneyFormat(data[data.length - 1]?.ventas || 0)}
                            // icon="ri-stack-line"
                            rate={get_variation(data[data.length - 1]?.ventas, data[data.length - 2]?.ventas)}
                            desc="Desde el mes anterior"
                        />
                        <MiniWidgets
                            title="Gastos"
                            value={moneyFormat(data[data.length - 1]?.gastos || 0)}
                            // icon="ri-add-fill"
                            rate={get_variation(data[data.length - 1]?.gastos, data[data.length - 2]?.gastos)}
                            desc="Desde el mes anterior"
                            negative
                        />
                        <MiniWidgets
                            title="Retiros"
                            value={moneyFormat(data[data.length - 1]?.retiros || 0)}
                            // icon=" ri-add-fill"
                            rate={get_variation(data[data.length - 1]?.retiros, data[data.length - 2]?.retiros)}
                            desc="Desde el mes anterior"
                            negative
                        />

                        <Col xl={12}>
                            <CajaGraph data={data} />
                        </Col>

                        <Col xl={8}>
                            <UsersTable />
                        </Col>

                        <Col xl={4}>
                            <RecentlyRegistros data={registros} />
                        </Col>

                        {/* <Col xl={4}>

                            <SalesAnalytics />

                            <EarningReports />

                        </Col> */}
                    </Row>


                    {/* <Row>
                        <Sources />

                        <RecentlyActivity />

                        <RevenueByLocations />

                    </Row>

                    <Row>
                        <ChatBox />

                        <LatestTransactions />
                    </Row> */}

                </Container>
            </div>
        </React.Fragment>
    );
}
