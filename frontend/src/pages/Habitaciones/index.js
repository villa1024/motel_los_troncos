import { useState, useEffect } from 'react'
import { Row, Button } from 'reactstrap'
import {
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Cuadricula from "./Cuadricula";
import Tabla from "./Tabla";
import MiniWidgets from "../../components/Common/MiniWidgets";
import { get, put, post } from '../../api'
import SweetAlert from "react-bootstrap-sweetalert";
import { timeFormat } from '../../helpers/formatters';

export default () => {
    const breadcrumbItems = [
        { title: "Habitaciones", link: "#" },
    ]
    const history = useHistory();

    const [view, setView] = useState(1)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [currentFilter, setCurrentFilter] = useState(null)
    const [rerender, setRerender] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [responsePopup, setResponsePopup] = useState(null)
    const [cancelarReservaPopup, setCancelarReservaPopup] = useState(false)
    const [desalojarPopup, setDesalojarPopup] = useState(false)
    const [reserva, setReserva] = useState(null)

    const states = [
        {
            id: 1,
            state: 'Disponible'
        },
        {
            id: 2,
            state: 'Ocupado'
        },
        {
            id: 3,
            state: 'En limpieza'
        },
    ]

    const [rooms, setRooms] = useState([])

    useEffect(async () => {
        const response = await get('api/services/listarHabitaciones')

        setRooms(response.listaHabitaciones.map((item) => {
            console.log(item.servicios)
            let salida = item.servicios.length > 0 && item.servicios[0]?.hr_salida ? new Date(`01-01-2021 ${item.servicios[0]?.hr_salida}`) : '-'
            let entrada = item.servicios.length > 0 && item.servicios[0]?.hr_entrada ? new Date(`01-01-2021 ${item.servicios[0]?.hr_entrada}`) : '-'
            if (entrada != '-') {
                entrada.setTime(entrada.getTime() - (3 * 60 * 60 * 1000))
                entrada = `${timeFormat(entrada.getHours())}:${timeFormat(entrada.getMinutes())}:${timeFormat(entrada.getSeconds())}`
            }
            if (salida != '-') {
                salida.setTime(salida.getTime() - (3 * 60 * 60 * 1000))
                salida = `${timeFormat(salida.getHours())}:${timeFormat(salida.getMinutes())}:${timeFormat(salida.getSeconds())}`
            }

            return ({
                id: item.numero,
                number: item.numero,
                state: item.estado.id,
                paid: item.paid ?? false,
                servicio: item.servicios[0]?.id,
                entrada: item.estado.id == 1 ? '-' : entrada,
                salida: item.estado.id == 1 ? '-' : salida,
            })
        }))
    }, [refresh])

    const onCheckout = (id) => {
        history.push(`/habitaciones/${id}/check-out`)
    }

    const onEdit = (id) => {
        history.push(`/habitaciones/${id}/editar`)
    }

    const onEnable = async (id) => {
        const response = await put('api/services/habilitarHabitacion', { id }, { 'Content-Type': 'application/json' })
        setResponsePopup({
            msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
            ok: response.ok
        })

        setRefresh(!refresh)
        setRerender(!rerender)
    }

    const onDesalojar = async (id) => {
        setReserva(id)
        setDesalojarPopup(true)
    }

    const onCancel = async (id) => {
        setReserva(id)
        setCancelarReservaPopup(true)
    }

    return <div className="page-content">
        {responsePopup != null && <SweetAlert
            title={responsePopup.ok ? 'Éxito' : 'Error'}
            type={responsePopup.ok ? 'success' : 'error'}
            onConfirm={() => setResponsePopup(null)}
        >
            {responsePopup.msg}
        </SweetAlert>}
        {desalojarPopup && <SweetAlert
            showCancel
            type="info"
            title="Está seguro que desea desalojar esta habitación"
            cancelBtnBsStyle="danger"
            confirmBtnBsStyle="success"
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            onConfirm={async () => {
                const response = await post('api/services/desalojarHabitacion', { id: reserva }, { 'Content-Type': 'application/json' })
                setResponsePopup({
                    msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                    ok: response.ok
                })

                setRefresh(!refresh)
                setRerender(!rerender)
                setReserva(null)
                setDesalojarPopup(false)
            }}
            onCancel={() => setDesalojarPopup(false)}
        />}
        {cancelarReservaPopup && <SweetAlert
            showCancel
            type="info"
            title="Está seguro que desea cancelar esta reserva"
            cancelBtnBsStyle="danger"
            confirmBtnBsStyle="success"
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            onConfirm={async () => {
                const response = await post('api/services/cancel', { id_servicio: reserva }, { 'Content-Type': 'application/json' })
                setResponsePopup({
                    msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                    ok: response.ok
                })

                setRefresh(!refresh)
                setRerender(!rerender)
                setReserva(null)
                setCancelarReservaPopup(false)
            }}
            onCancel={() => setCancelarReservaPopup(false)}
        />}
        <Container fluid>
            <Breadcrumbs
                title="Habitaciones"
                breadcrumbItems={breadcrumbItems}
            />

            <Row>
                <MiniWidgets
                    title="Disponibles"
                    value={`${rooms.filter(item => item.state == 1).length.toLocaleString("es-CL")}`}
                    icon={
                        <Button color="success" style={{ pointerEvents: 'none', height: 50, width: 50 }}></Button>
                    }
                    rate={0}
                    desc="Desde el turno anterior"
                />
                <MiniWidgets
                    title="Ocupado"
                    value={`${rooms.filter(item => item.state == 2).length.toLocaleString("es-CL")}`}
                    icon={
                        <Button color="warning" style={{ pointerEvents: 'none', height: 50, width: 50 }}></Button>
                    }
                    rate={0}
                    desc="Desde el turno anterior"
                />
                <MiniWidgets
                    title="En limpieza"
                    value={`${rooms.filter(item => item.state == 3).length.toLocaleString("es-CL")}`}
                    icon={
                        <Button color="danger" style={{ pointerEvents: 'none', height: 50, width: 50 }}></Button>
                    }
                    rate={0}
                    desc="Desde el turno anterior"
                    negative
                />
            </Row>

            <div className="position-relative" style={{ height: 50 }}>
                <Pagination aria-label="Page navigation example" className="pagination-rounded position-absolute left-0 top-0" style={{ gap: 10 }}>
                    <PaginationItem onClick={() => setView(1)} active={view === 1}><PaginationLink href="#">Tabla</PaginationLink></PaginationItem>
                    <PaginationItem onClick={() => setView(2)} active={view === 2}><PaginationLink href="#">Cuadrícula</PaginationLink></PaginationItem>
                </Pagination>
                <div aria-label="Page navigation example" className="pagination-rounded position-absolute top-0" style={{ right: 0 }}>
                    <Dropdown
                        isOpen={dropdownOpen}
                        direction="left"
                        toggle={() =>
                            setDropdownOpen(!dropdownOpen)
                        }
                    >
                        <DropdownToggle color="light" caret>
                            Filtro: {currentFilter == null ? 'Todo' : states.find(item => item.id === currentFilter).state}
                            <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                onClick={() => setCurrentFilter(null)}
                                active={currentFilter === null}>
                                Todo
                            </DropdownItem>
                            {
                                states.map(state => (
                                    <DropdownItem
                                        key={`dropdown-item-${state.id}`}
                                        onClick={() => setCurrentFilter(state.id)}
                                        active={state.id === currentFilter}>
                                        {state.state}
                                    </DropdownItem>
                                ))
                            }
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            {
                view === 1 ?
                    <Tabla
                        rooms={rooms.filter(item => currentFilter === null || currentFilter === item.state)}
                        onCheckout={onCheckout}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onDesalojar={onDesalojar}
                        onEnable={onEnable} />
                    : <Cuadricula
                        rooms={rooms.filter(item => currentFilter === null || currentFilter === item.state)}
                        onCheckout={onCheckout}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onDesalojar={onDesalojar}
                        onEnable={onEnable} />
            }
        </Container>
    </div>
}