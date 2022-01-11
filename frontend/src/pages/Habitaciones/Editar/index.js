import { Fragment, useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col,
    Table,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    CardBody,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";
import { get, post, put } from '../../../api'
import ClientInfo from './ClientInfo'
import ServiceInfo from './ServiceInfo'
import ExtrasInfo from './ExtrasInfo'
import PaymentInfo from './PaymentInfo'
import SummaryContext from './SummaryContext'
import SweetAlert from "react-bootstrap-sweetalert";

export default () => {
    const { id } = useParams();

    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { title: "Habitaciones", link: "/habitaciones" },
        { title: `Chekout`, link: "/#" },
    ])

    const [orderSummary, setOrderSummary] = useState({
        clients: [{}, {}],
        promotions: [],
        extras: [],
        metodo_de_pago: null
    })
    const [total, setTotal] = useState(0)
    const [payment, setPayment] = useState(null)
    const [inventario, setInventario] = useState([])
    const [responsePopup, setResponsePopup] = useState(null)

    const [activeTab, setActiveTab] = useState(1)

    const setPaid = (id) => {
        console.log(orderSummary.promotions)
        let temp = orderSummary.promotions
        const idx = temp.findIndex(item => item.id == id)
        temp[idx].paid = true
        console.log(temp)
        setOrderSummary({
            ...orderSummary,
            promotions: temp
        })
    }

    useEffect(() => {
        setTotal(
            orderSummary.promotions.reduce((carry, value) => carry + value.price, 0)
            + orderSummary.extras.reduce((carry, value) => carry + value.price, 0)
        )

        console.log(orderSummary)
    }, [orderSummary])

    useEffect(async () => {
        const response_inventario = await get('api/inventario/getInventario')

        setInventario(response_inventario.inventario)

        const response = await get(`api/services/getService?id=${id}`)

        const promociones = await get('api/services/listarPromociones')
        console.log(promociones)
        console.log(response)

        let promotions = response.findService.promociones.map(item => {
            let temp = item
            temp.beberages = []

            if (temp?.servicio_promociones.id_producto1 != null) {
                temp.beberages.push({
                    value: response_inventario.inventario.find(item => item.id == temp.servicio_promociones.id_producto1),
                })
            }

            if (temp?.servicio_promociones.id_producto2 != null) {
                temp.beberages.push({
                    value: response_inventario.inventario.find(item => item.id == temp.servicio_promociones.id_producto2),
                })
            }

            const included = []
            if (temp.trago && temp.bebida) {
                included.push([
                    {
                        id: 1,
                        type: 'Trago',
                    },
                    {
                        id: 2,
                        type: 'Bebida',
                    }
                ])
                included.push([
                    {
                        id: 1,
                        type: 'Trago',
                    },
                    {
                        id: 2,
                        type: 'Bebida',
                    }
                ])
            } else if (temp.trago) {
                included.push([
                    {
                        id: 1,
                        type: 'Trago',
                    }
                ])
                included.push([
                    {
                        id: 1,
                        type: 'Trago',
                    }
                ])
            } else if (temp.bebida) {
                included.push([
                    {
                        id: 2,
                        type: 'Bebida',
                    }
                ])
                included.push([
                    {
                        id: 2,
                        type: 'Bebida',
                    }
                ])
            }

            return {
                ...temp,
                hours: temp.horas,
                price: temp.precio,
                description: temp.descripcion,
                included
            }
        })

        let extras = []

        for (let pedido of response.findService.pedidos) {
            for (let producto of pedido.productos) {
                for (let i = 0; i < producto.detalle_pedido.cantidad; i++) {
                    extras.push({
                        id: producto.id,
                        price: producto.precio,
                        nombre: producto.nombre,
                        label: `${producto.nombre} ($${producto.precio})`,
                        stock: 0,
                        id_servicio: id,
                        id_pedido: pedido.id,
                    })
                }
            }
        }


        setOrderSummary({
            clients: [
                {
                    nombre: response.cliente1.nombre,
                    apellido: response.cliente1.apellido,
                    rut: response.cliente1.rut
                },
                {
                    nombre: response.cliente2.nombre,
                    apellido: response.cliente2.apellido,
                    rut: response.cliente2.rut
                },
            ],
            promotions: promotions,
            extras,
            metodo_de_pago: response?.findService?.promociones[0]?.servicio_promociones?.id_tipo_pago || 2
        })

        // setOrderSummary({
        //     ...orderSummary,
        //     clients: response.habitacion.clients,
        //     promotions: response.habitacion.promotions,
        //     extras: response.habitacion.extras,
        //     metodo_de_pago: response.habitacion.metodo_de_pago
        // })
    }, [])

    const checkForm = (form) => {
        const element = document.getElementById(form?.form || form)
        if (!element.checkValidity()) {
            form.tab != null && setActiveTab(form.tab)
            setTimeout(() => element.reportValidity(), 300)
        }
        return element.checkValidity()
    }

    const handleComplete = async () => {
        const forms = [{
            form: 'clients-form',
            tab: 1,
        }]
        let error = false

        for (const form of forms) {
            if (!checkForm(form)) {
                error = true
                break
            }
        }

        if (!error) {
            window.location = '/habitaciones'
        }
    }

    const handleClientChange = async () => {
        if (checkForm('clients-form')) {
            const response = await put('api/admin/updateClient', {
                id_servicio: id,
                clientes: orderSummary.clients
            }, { 'Content-Type': 'application/json' })

            return true
        }
        return false
    }

    const handleServiceChange = async () => {
        return true
    }

    const summaryContext = { orderSummary, setOrderSummary, payment, setPayment, setPaid, handleComplete }
    return <Fragment>
        <div className="page-content">
            {responsePopup != null && <SweetAlert
                title={responsePopup.ok ? 'Éxito' : 'Error'}
                type={responsePopup.ok ? 'success' : 'error'}
                onConfirm={() => setResponsePopup(null)}
            >
                {responsePopup.msg}
            </SweetAlert>}
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs
                    title="Chekout"
                    breadcrumbItems={breadcrumbItems}
                />

                <Row>
                    <Col lg="8">
                        <Card>
                            <CardBody>
                                <div
                                    id="checkout-nav-pills-wizard"
                                    className="twitter-bs-wizard"
                                >
                                    <Nav className="twitter-bs-wizard-nav" pills justified>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active: activeTab === 1,
                                                })}
                                                onClick={() => {
                                                    setActiveTab(1);
                                                }}
                                            >
                                                <span className="step-number">01</span>
                                                <span className="step-title">Información del cliente</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active: activeTab === 2,
                                                })}
                                                onClick={() => {
                                                    setActiveTab(2);
                                                }}
                                            >
                                                <span className="step-number">02</span>
                                                <span className="step-title">Servicio</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active: activeTab === 3,
                                                })}
                                                onClick={() => {
                                                    setActiveTab(3);
                                                }}
                                            >
                                                <span className="step-number">03</span>
                                                <span className="step-title">Extras</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active: activeTab === 4,
                                                })}
                                                onClick={() => {
                                                    setActiveTab(4);
                                                }}
                                            >
                                                <span className="step-number">04</span>
                                                <span className="step-title">Métodos de pago</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent
                                        activeTab={activeTab}
                                        className="twitter-bs-wizard-tab-content"
                                    >
                                        <TabPane tabId={1}>
                                            <SummaryContext.Provider value={summaryContext}>
                                                <ClientInfo />
                                            </SummaryContext.Provider>
                                        </TabPane>
                                        <TabPane
                                            tabId={2}
                                            id="v-pills-payment"
                                            role="tabpanel"
                                            aria-labelledby="v-pills-payment-tab"
                                        >
                                            <SummaryContext.Provider value={summaryContext}>
                                                <ServiceInfo id_servicio={id} inventario={inventario} />
                                            </SummaryContext.Provider>
                                        </TabPane>
                                        <TabPane
                                            tabId={3}
                                            id="v-pills-payment"
                                            role="tabpanel"
                                            aria-labelledby="v-pills-payment-tab"
                                        >
                                            <SummaryContext.Provider value={summaryContext}>
                                                <ExtrasInfo id_servicio={id} inventario={inventario} />
                                            </SummaryContext.Provider>
                                        </TabPane>
                                        <TabPane tabId={4} id="v-pills-confir" role="tabpanel">
                                            <SummaryContext.Provider value={summaryContext}>
                                                <PaymentInfo handleComplete={handleComplete} />
                                            </SummaryContext.Provider>
                                        </TabPane>
                                    </TabContent>
                                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                                        <li className={activeTab === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { activeTab === 1 || setActiveTab(activeTab - 1); }}>Anterior</Link></li>
                                        <li className={activeTab === 4 ? "next disabled " : "next success"}><Link to="#" onClick={async () => {
                                            let ready = false
                                            if (activeTab === 1) {
                                                ready = await handleClientChange()
                                            } else if (activeTab === 2) {
                                                ready = await handleServiceChange()
                                            } else if (activeTab === 3) {
                                                ready = await handleServiceChange()
                                            }
                                            if (ready) activeTab === 4 || setActiveTab(activeTab + 1);
                                        }}>Guardar</Link></li>
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="checkout-order-summary">
                            <CardBody>
                                <div className="p-3 bg-light mb-4">
                                    <h5 className="font-size-14 mb-0">
                                        Resumen de orden{" "}
                                        {/* <span className="float-end ms-2">#SK2356</span> */}
                                    </h5>
                                </div>
                                <div className="table-responsive">
                                    <Table className="align-middle mb-0 table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "110px" }} scope="col">
                                                    Promoción
                                                </th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col" width="100px">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderSummary.promotions.map((orderitem, key) => (
                                                <tr key={"_orderSummary_" + orderitem.id}>
                                                    <th scope="row">
                                                        Promoción {orderitem.hours} {orderitem.hours > 1 ? `horas` : `hora`}
                                                    </th>
                                                    <td>
                                                        {orderitem.beberages.map((item, idx) => <p className="text-muted mb-0">
                                                            Bebestible {idx + 1}: {item.value.nombre} {idx > 0 ? <br /> : ''}
                                                        </p>)}
                                                    </td>
                                                    <td>$ {orderitem.price.toLocaleString("es-CL")}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="2">
                                                    <h6 className="m-0 text-end">Sub Total:</h6>
                                                </td>
                                                <td>$ {orderSummary.promotions.reduce((carry, value) => carry + value.price, 0).toLocaleString("es-CL")}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table className="align-middle mb-0 table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th colSpan="2" style={{ width: "110px" }} scope="col">
                                                    Extras
                                                </th>
                                                <th scope="col" width="100px">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderSummary.extras.map((orderitem, key) => (
                                                <tr key={"_orderSummaryExtras_" + key}>
                                                    <th scope="row" colSpan="2">
                                                        {orderitem.nombre}
                                                    </th>
                                                    {/* <td>
                                                        {orderitem.beberages.map((item, idx) => <p className="text-muted mb-0">
                                                            Bebestible {idx + 1}: {item.value} {idx > 0 ? <br /> : ''}
                                                        </p>)}
                                                    </td> */}
                                                    <td>$ {orderitem.price.toLocaleString("es-CL")}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="2">
                                                    <h6 className="m-0 text-end">Sub Total:</h6>
                                                </td>
                                                <td>$ {orderSummary.extras.reduce((carry, value) => carry + value.price, 0).toLocaleString("es-CL")}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <h6 className="m-0 text-end">Total:</h6>
                                                </td>
                                                <td>$ {total.toLocaleString("es-CL")}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    </Fragment>
}