import React, { Component, useState, useEffect } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, Badge } from "reactstrap"
import Tooltip from "../../components/Common/Tooltip";
import { timeFormat, moneyFormat, dateFormat } from "../../helpers/formatters";
import { get } from "../../api";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Table from '../../components/Common/InventarioTable'

export default () => {
    const [data, setData] = useState([])
    const breadcrumbItems = [
        { title: "Registros", link: "#" },
    ]

    const acciones = (id) => <div className="d-flex justify-content-center" style={{ width: '50px' }}>
        <Tooltip id={'trago-' + id + '-take-button'} title="Retirar producto">
            <Button color="link" className="text-info">
                <i className="ri-close-fill"></i>
            </Button>
        </Tooltip>
        <Tooltip id={'trago-' + id + '-edit-button'} title="Editar producto">
            <Button color="link" className="text-warning">
                <i className="ri-pencil-fill"></i>
            </Button>
        </Tooltip>
        <Tooltip id={'trago-' + id + '-delete-button'} title="Eliminar producto">
            <Button color="link" className="text-danger">
                <i className="ri-delete-bin-5-fill"></i>
            </Button>
        </Tooltip>
    </div>

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
        get('api/registros/getRegistros').then(res => {
            setData(res.allRegistros.map(item => ({
                ...item,
                id_habitacion: item.id_habitacion || '-',
                estado: renderState(1),
                monto: item.monto ? moneyFormat(item.monto) : '-',
                fecha: item.fecha ? dateFormat(new Date(item.fecha)) : '-',
                fecha_entrada: item.fecha_entrada ? dateFormat(new Date(item.fecha_entrada)) : '-',
                usuario: item.usuario.nombre + ' ' + item.usuario.apellido,
            })))
        })
    }, [])

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
                    <Breadcrumbs title="Registros" breadcrumbItems={breadcrumbItems} />

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Registros</CardTitle>
                                    <p className="card-title-desc">
                                        Listado de todos los registros realizados
                                    </p>
                                    <Table
                                        data={data}
                                        columns={columns}
                                        order="desc"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div >
            </div >
        </React.Fragment >
    )
}