import { Fragment, useState, useEffect } from "react"
import { Button, Row, Col, Label, Input } from 'reactstrap'
import Table from '../../../components/Common/InventarioTable'
import SweetAlert from "react-bootstrap-sweetalert";
import { get, post } from '../../../api'
import { dateFormat } from "../../../helpers/formatters";

export default ({ cajaRefresh, setCajaRefresh }) => {
    const [addPopup, setAddPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [responsePopup, setResponsePopup] = useState(null)
    const [data, setData] = useState([])
    const initialForm = {
        fecha: '',
        monto: '',
        descripcion: ''
    }
    const [form, setForm] = useState(initialForm)

    const timeFormat = (number) => number > 9 ? `${number}` : `0${number}`

    // const data = Array(15).fill(null).map(item => ({
    //     amount: `$ ${Math.round(Math.random() * 10000).toLocaleString("es-CL")}`, id: Math.round(Math.round(Math.random() * 5014)),
    //     room: Math.round(Math.round(Math.random() * 32)),
    //     checkin_date: `${timeFormat(Math.round(Math.round(Math.random() * 31)))}-10-2021 ${timeFormat(Math.round(Math.round(Math.random() * 23)))}:${timeFormat(Math.round(Math.round(Math.random() * 59)))}`,
    //     transaction_date: `${timeFormat(Math.round(Math.round(Math.random() * 31)))}-10-2021 ${timeFormat(Math.round(Math.round(Math.random() * 23)))}:${timeFormat(Math.round(Math.round(Math.random() * 59)))}`,
    //     obs: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam, perferendis. Nobis voluptate, assumenda quae magni reiciendis unde asperiores enim eum.'
    // }))

    useEffect(async () => {
        const response = await get('api/caja/allGastos')

        setData(response.findGastos.map(item => ({
            id: item.id,
            amount: `$ ${Math.round(item.monto).toLocaleString("es-CL")}`,
            obs: item.descripcion,
            checkin_date: dateFormat(new Date(item.fecha)),
        })))

    }, [refresh])

    const handleFormChange = (value, attr) => {
        setForm({
            ...form,
            [attr]: value.target.value
        })
    }

    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true,
        },
        // {
        //     dataField: 'room',
        //     text: 'N° Habitación',
        //     sort: true
        // },
        {
            dataField: 'checkin_date',
            text: 'Fecha de gasto',
            sort: true
        },
        // {
        //     dataField: 'transaction_date',
        //     text: 'Fecha de transacción',
        //     sort: true
        // },
        {
            dataField: 'amount',
            text: 'Monto',
            sort: true
        },
        {
            dataField: 'obs',
            text: 'Observación',
            sort: true
        },
    ];

    return (
        <Fragment>
            <div aria-label="Page navigation example" className="pagination-rounded position-absolute top-0 m-3" style={{ right: 0 }}>
                <Button onClick={() => setAddPopup(true)} color="success">Agregar gasto</Button>
            </div>
            <Table
                data={data}
                columns={columns}
                order="desc"
            />
            {responsePopup != null && <SweetAlert
                title={responsePopup.ok ? 'Éxito' : 'Error'}
                type={responsePopup.ok ? 'success' : 'error'}
                onConfirm={() => setResponsePopup(null)}
            >
                {responsePopup.msg}
            </SweetAlert>}
            {addPopup ? (
                <SweetAlert
                    showCancel
                    title="Añadir un gasto"
                    cancelBtnBsStyle="danger"
                    confirmBtnBsStyle="success"
                    confirmBtnText="Añadir"
                    cancelBtnText="Cancelar"
                    onConfirm={async () => {
                        const response = await post('api/caja/gasto', form, { 'Content-Type': 'application/json' })
                        setResponsePopup({
                            msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                            ok: response.ok
                        })
                        setForm(initialForm)
                        setAddPopup(false)
                        setRefresh(!refresh)
                        setCajaRefresh(!cajaRefresh)
                    }}
                    onCancel={() => {
                        setForm(initialForm)
                        setAddPopup(false)
                    }}
                >
                    <Row>
                        {/* <Col lg={12}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="fecha"
                                    className="form-label w-100"
                                    style={{ textAlign: 'left' }}
                                >
                                    Fecha
                                </Label>
                                <Input
                                    type="datetime-local"
                                    className="form-control"
                                    placeholder="Ingrese la fecha del gasto"
                                    name="fecha"
                                    value={form.fecha}
                                    onChange={(value) => handleFormChange(value, 'fecha')}
                                />
                            </div>
                        </Col> */}
                        <Col lg={12}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-name"
                                    className="form-label w-100"
                                    style={{ textAlign: 'left' }}
                                >
                                    Monto
                                </Label>
                                <Input
                                    type="number"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="Ingrese el monto del gasto"
                                    name="monto"
                                    value={form.monto}
                                    onChange={(value) => handleFormChange(value, 'monto')}
                                />
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="billing-email-address"
                                    className="form-label w-100"
                                    style={{ textAlign: 'left' }}
                                >
                                    Observación
                                </Label>
                                <Input
                                    type="textarea"
                                    className="form-control"
                                    id="billing-email-address"
                                    placeholder="Ingrese una observación del gasto"
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={(value) => handleFormChange(value, 'descripcion')}
                                />
                            </div>
                        </Col>
                    </Row>
                </SweetAlert>
            ) : null
            }
        </Fragment>
    )
}