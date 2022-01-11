import React, { Component, useState, useEffect } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, Badge, Nav, NavItem, NavLink, TabPane, CardText, TabContent } from "reactstrap"
import classnames from "classnames";
import SweetAlert from "react-bootstrap-sweetalert";
import { timeFormat, moneyFormat, dateFormat } from "../../helpers/formatters";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Table from '../../components/Common/InventarioTable'
import MiniWidgets from "../../components/Common/MiniWidgets";
import VentasTable from "./Ventas";
import GastosTable from "./Gastos";
import RetirosTable from "./Retiros";
import { get, post } from '../../api'

export default () => {
    const [activeTab, setActiveTab] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [cierreCajaPopup, setCierreCajaPopup] = useState(false)
    const [responsePopup, setResponsePopup] = useState(null)
    const [stats, setStats] = useState({
        caja: 0,
        ventas: 0,
        gastos: 0,
        retiros: 0
    })
    const [registros, setRegistros] = useState([])
    const breadcrumbItems = [
        { title: "Caja", link: "#" },
    ]

    const renderState = (state) => {
        const color = {
            1: 'bg-warning',
            2: 'bg-danger',
            3: 'bg-success',
        }

        const label = {
            1: 'Pendiente',
            2: 'Cancelado',
            3: 'Pagado',
        }

        return <Badge className={`${color[state]} me-1`}>{label[state]}</Badge>
    }

    useEffect(() => {
        get('api/caja').then(res => {
            setStats(res.caja[0])
        })

        get('api/registros/getRegistros').then(res => {
            setRegistros(res.allRegistros.map(item => ({
                ...item,
                id_habitacion: item.id_habitacion || '-',
                estado: renderState(1),
                monto: item.monto ? moneyFormat(item.monto) : '-',
                fecha: item.fecha ? dateFormat(new Date(item.fecha)) : '-',
                fecha_entrada: item.fecha_entrada ? dateFormat(new Date(item.fecha_entrada)) : '-',
                usuario: item.usuario.nombre + ' ' + item.usuario.apellido,
            })))
        })
    }, [refresh])

    function get_variation(x1, x2) {
        x1 = x1 == null ? 0 : x1;
        x2 = x2 == null ? 0 : x2;
        return x1 == 0 && x2 == 0 ? 0 : (x1 == 0 ? -100 : (x2 == 0 ? 100 : (
            ((x1 - x2) / x2) * 100)));
    }

    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true,
        },
        {
            dataField: 'usuario',
            text: 'Usuario',
            sort: true
        },
        {
            dataField: 'id_habitacion',
            text: 'N° Habitación',
            sort: true
        },
        {
            dataField: 'fecha_entrada',
            text: 'Fecha de entrada',
            sort: true
        },
        {
            dataField: 'fecha',
            text: 'Fecha de transacción',
            sort: true
        },
        {
            dataField: 'monto',
            text: 'Monto',
            sort: true
        },
        {
            dataField: 'observacion',
            text: 'Observación',
            sort: true
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Caja" breadcrumbItems={breadcrumbItems} />

                    <div className="position-relative" style={{ height: 50 }}>
                        <div aria-label="Page navigation example" className="pagination-rounded position-absolute top-0" style={{ right: 0 }}>
                            <Button onClick={() => setCierreCajaPopup(true)} color="success">Cierre de caja</Button>
                        </div>
                    </div>

                    {responsePopup != null && <SweetAlert
                        title={responsePopup.ok ? 'Éxito' : 'Error'}
                        type={responsePopup.ok ? 'success' : 'error'}
                        onConfirm={() => setResponsePopup(null)}
                    >
                        {responsePopup.msg}
                    </SweetAlert>}

                    {cierreCajaPopup && <SweetAlert
                        showCancel
                        title="Cerrar caja"
                        cancelBtnBsStyle="danger"
                        confirmBtnBsStyle="success"
                        confirmBtnText="Aceptar"
                        cancelBtnText="Cancelar"
                        onConfirm={async () => {
                            let id_usuario = "";
                            if (localStorage.getItem("authUser")) {
                                const obj = JSON.parse(localStorage.getItem("authUser"));
                                id_usuario = obj.id
                            }
                            const response = await post('api/caja/cierre', {
                                id_usuario
                            }, { 'Content-Type': 'application/json' })
                            setResponsePopup({
                                msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                                ok: response.ok
                            })
                            setCierreCajaPopup(false)
                            setRefresh(!refresh)
                        }}
                        onCancel={() => setCierreCajaPopup(false)}
                    >
                        <p>¿Está seguro que desea cerrar la caja?</p>
                    </SweetAlert>}

                    <Row>
                        <MiniWidgets
                            title="Caja"
                            value={moneyFormat(stats.caja)}
                            // icon="ri-stack-line"
                            // rate={0}
                            desc="Desde el turno anterior"
                        />
                        <MiniWidgets
                            title="Ventas"
                            value={moneyFormat(stats.ventas)}
                            // icon="ri-stack-line"
                            // rate={0}
                            desc="Desde el turno anterior"
                        />
                        <MiniWidgets
                            title="Gastos"
                            value={moneyFormat(stats.gastos)}
                            // icon="ri-add-fill"
                            // rate={0}
                            desc="Desde el turno anterior"
                            negative
                        />
                        <MiniWidgets
                            title="Retiros"
                            value={moneyFormat(stats.retiros)}
                            // icon=" ri-add-fill"
                            // rate={0}
                            desc="Desde el turno anterior"
                            negative
                        />

                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <Nav pills className="navtab-bg nav-justified">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: activeTab === 0
                                                })}
                                                onClick={() => {
                                                    setActiveTab(0);
                                                }}
                                            >
                                                Registros
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: activeTab === 1
                                                })}
                                                onClick={() => {
                                                    setActiveTab(1);
                                                }}
                                            >
                                                Ventas
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: activeTab === 2
                                                })}
                                                onClick={() => {
                                                    setActiveTab(2);
                                                }}
                                            >
                                                Gastos
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: activeTab === 3
                                                })}
                                                onClick={() => {
                                                    setActiveTab(3);
                                                }}
                                            >
                                                Retiros
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardBody>
                            </Card>
                        </Col>

                        {
                            activeTab === 0 && <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="h4">Registros del turno</CardTitle>
                                        <p className="card-title-desc">
                                            Listado de todos los registros realizados en el turno
                                        </p>
                                        <Table
                                            data={registros}
                                            columns={columns}
                                            order="desc"
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        }

                        {
                            activeTab === 1 && <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="h4">Ventas</CardTitle>
                                        <p className="card-title-desc">
                                            Listado de todas las ventas
                                        </p>
                                        <VentasTable />
                                    </CardBody>
                                </Card>
                            </Col>
                        }

                        {
                            activeTab === 2 && <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="h4">Gastos</CardTitle>
                                        <p className="card-title-desc">
                                            Listado de todas los gasots
                                        </p>
                                        <GastosTable cajaRefresh={refresh} setCajaRefresh={setRefresh} />
                                    </CardBody>
                                </Card>
                            </Col>
                        }

                        {
                            activeTab === 3 && <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="h4">Retiros</CardTitle>
                                        <p className="card-title-desc">
                                            Listado de todas los retiros
                                        </p>
                                        <RetirosTable cajaRefresh={refresh} setCajaRefresh={setRefresh} />
                                    </CardBody>
                                </Card>
                            </Col>
                        }

                    </Row>
                </div >
            </div >
        </React.Fragment >
    )
}