import { Fragment, useEffect, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    Table,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    Form,
    Label,
    CardBody,
    CardTitle,
} from "reactstrap";
import SummaryContext from '../SummaryContext'

export default () => {
    const { orderSummary, setOrderSummary } = useContext(SummaryContext)

    const handleChangeClient = (client, value, attr) => {
        const clients = orderSummary.clients
        clients[client][attr] = value.target.value
        setOrderSummary({
            ...orderSummary,
            clients
        })

    }

    return <Fragment>
        <CardTitle className="h5">
            Información del cliente
        </CardTitle>
        <p className="card-title-desc">
            Ingrese los datos de los clientes
        </p>
        <Form id="clients-form">
            <div>
                <div>
                    <CardTitle className="h2">
                        Cliente 1
                    </CardTitle>
                    <Row>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-name"
                                    className="form-label"
                                >
                                    Nombre
                                </Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="Ingrese el nombre del cliente"
                                    value={orderSummary.clients[0].nombre}
                                    onChange={(value) => handleChangeClient(0, value, 'nombre')}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-name"
                                    className="form-label"
                                >
                                    Apellido
                                </Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="Ingrese el apellido del cliente"
                                    value={orderSummary.clients[0].apellido}
                                    onChange={(value) => handleChangeClient(0, value, 'apellido')}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-email-address"
                                    className="form-label"
                                >
                                    Rut
                                </Label>
                                <Input
                                    className="form-control"
                                    id="billing-email-address"
                                    placeholder="Rut"
                                    pattern="^\d{7,8}[-][0-9kK]{1}$"
                                    value={orderSummary.clients[0].rut}
                                    onChange={(value) => handleChangeClient(0, value, 'rut')}
                                    required
                                />
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <CardTitle className="h2">
                        Cliente 2
                    </CardTitle>
                    <Row>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-name"
                                    className="form-label"
                                >
                                    Nombre
                                </Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="Ingrese el nombre del cliente"
                                    value={orderSummary.clients[1].nombre}
                                    onChange={(value) => handleChangeClient(1, value, 'nombre')}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-name"
                                    className="form-label"
                                >
                                    Apellido
                                </Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="Ingrese el apellido del cliente"
                                    value={orderSummary.clients[1].apellido}
                                    onChange={(value) => handleChangeClient(1, value, 'apellido')}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-email-address"
                                    className="form-label"
                                >
                                    Rut
                                </Label>
                                <Input
                                    className="form-control"
                                    id="billing-email-address"
                                    placeholder="Rut"
                                    pattern="^\d{7,8}[-][0-9kK]{1}$"
                                    value={orderSummary.clients[1].rut}
                                    onChange={(value) => handleChangeClient(1, value, 'rut')}
                                    required
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Form>
    </Fragment>
}