import React from 'react'
import {
    Card,
    CardBody,
    CardTitle,
    Button,
    Badge
} from 'reactstrap'
import Tooltip from '../../components/Common/Tooltip'
import Table from '../../components/Common/InventarioTable'

export default ({ rooms, onCheckout, onEnable, onCancel, onDesalojar, onEdit }) => {
    const states = {
        1: 'Disponible',
        2: 'Ocupado',
        3: 'En limpieza'
    }

    const renderState = (state) => {
        const color = {
            1: 'bg-success',
            2: 'bg-warning',
            3: 'bg-danger',
        }

        const label = {
            1: 'Disponible',
            2: 'Ocupado',
            3: 'En limpieza',
        }

        return <Badge className={`${color[state]} me-1`}>{label[state]}</Badge>
    }

    const renderActions = (room, idx) => <div className="d-flex justify-content-center" style={{ width: '50px' }}>
        {
            room.state === 1 && <Tooltip id={'room-' + idx + '-add-button'} title="Reservar habitación">
                <Button type="button" onClick={() => onCheckout(room.id)} color="link" className="text-success">
                    <i className="ri-add-fill"></i>
                </Button>
            </Tooltip>
        }
        {
            room.state === 2 && <React.Fragment>
                <Tooltip id={'room-' + idx + '-edit-button'} title="Editar reserva">
                    <Button onClick={() => onEdit(room.servicio)} color="link" className="text-warning">
                        <i className="ri-pencil-fill"></i>
                    </Button>
                </Tooltip>

                <Tooltip id={'room-' + idx + '-desalojar-button'} title="Desalojar habitación">
                    <Button onClick={() => onDesalojar(room.servicio)} color="link" className="text-info">
                        <i className="ri-logout-box-r-fill"></i>
                    </Button>
                </Tooltip>

                <Tooltip id={'room-' + idx + '-cancel-button'} title="Cancelar Reserva">
                    <Button onClick={() => onCancel(room.servicio)} color="link" className="text-danger">
                        <i className="ri-delete-bin-5-fill"></i>
                    </Button>
                </Tooltip>
            </React.Fragment>
        }
        {
            room.state === 3 && <React.Fragment>
                <Tooltip id={'room-' + idx + '-enable-button'} title="Habilitar habitación">
                    <Button onClick={() => onEnable(room.id)} color="link" className="text-success">
                        <i className="ri-refresh-fill"></i>
                    </Button>
                </Tooltip>
            </React.Fragment>
        }
    </div>

    const data = rooms.map((item, idx) => ({
        ...item,
        actions: renderActions(item, idx),
        state: renderState(item.state),
        paid: item.paid ? 'SI' : 'NO'
    }))

    const columns = [
        {
            dataField: 'number',
            text: 'Número',
            sort: true,
        },
        {
            dataField: 'state',
            text: 'Estado',
            sort: true
        },
        // {
        //     dataField: 'paid',
        //     text: 'Pagado',
        //     sort: true
        // },
        {
            dataField: 'entrada',
            text: 'Hora de entrada',
            sort: true
        },
        {
            dataField: 'salida',
            text: 'Hora de salida',
            sort: true
        },
        {
            dataField: 'actions',
            text: 'Acciones',
            sort: true
        }
    ];

    return <Card>
        <CardBody>
            <CardTitle className="h4 mb-4">
                Listado de habitaciones
            </CardTitle>
            <p className="card-title-desc">
                Listado de todas las habitaciones.
            </p>
            <Table
                data={data}
                columns={columns}
            />
        </CardBody>
    </Card>

}