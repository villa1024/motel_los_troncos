import { Fragment, useState, useEffect } from "react"
import { Button, Row, Col, Label, Input, Card, CardBody, CardTitle } from 'reactstrap'
import Table from '../../components/Common/InventarioTable'
import Tooltip from '../../components/Common/Tooltip'
import SweetAlertFormButtons from "../../components/Common/SweetAlertFormButtons"
import SweetAlert from "react-bootstrap-sweetalert";
import { get, post, put, del } from '../../api'
import { AvForm, AvField } from 'availity-reactstrap-validation';

export default () => {
    const [addPopup, setAddPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [edit, setEdit] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [responsePopup, setResponsePopup] = useState(null)
    Array.prototype.sample = function () {
        return this[Math.floor(Math.random() * this.length)];
    }

    const emptyUserForm = {
        id: null,
        nombre: '',
        apellido: '',
        telefono: '',
        rut: '',
        correo: '',
        direccion: '',
        password: '',
        rol: ''
    }

    const [userForm, setUserForm] = useState(emptyUserForm)

    const [data, setData] = useState([])
    const [roles, setRoles] = useState([])

    useEffect(async () => {
        const data = await get('api/admin/obtenerRolesUsuarios')
        setRoles(data.msg)

        const users = await get('api/admin/verUsuarios')
        setData(users.msg.map((item, idx) => ({
            ...item,
            rol: item.roles[0].rol,
            actions: acciones(item)
        })))
    }, [refresh])

    const acciones = (user) => <div className="d-flex justify-content-center" style={{ width: '50px' }}>
        <Tooltip id={'user-' + user.id + '-edit-button'} title="Editar Usuario">
            <Button onClick={() => { onEdit(user) }} color="link" className="text-warning">
                <i className="ri-pencil-fill"></i>
            </Button>
        </Tooltip>
        <Tooltip id={'user-' + user.id + '-delete-button'} title="Eliminar Usuario">
            <Button onClick={() => { onDelete(user) }} color="link" className="text-danger">
                <i className="ri-delete-bin-5-fill"></i>
            </Button>
        </Tooltip>
    </div>

    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true,
        },
        {
            dataField: 'nombre',
            text: 'Nombre',
            sort: true
        },
        {
            dataField: 'apellido',
            text: 'Apellido',
            sort: true
        },
        {
            dataField: 'rut',
            text: 'Rut',
            sort: true
        },
        {
            dataField: 'correo',
            text: 'Correo',
            sort: true
        },
        {
            dataField: 'telefono',
            text: 'Teléfono',
            sort: true
        },
        {
            dataField: 'rol',
            text: 'Rol',
            sort: true
        },
        {
            dataField: 'actions',
            text: 'Acciones',
            sort: true
        },
    ];

    const onEdit = (user) => {
        setUserForm(({
            ...user,
            rol: user.roles[0].id
        }))
        setEdit(true)
        setAddPopup(true)
    }

    const onDelete = (user) => {
        setUserForm(user)
        setDeletePopup(true)
    }

    const handleSubmit = async (event, value) => {
        value = {
            ...value,
            id: userForm?.id,
        }
        const response = edit ? await put('api/auth/updateUser', value, { 'Content-Type': 'application/json' }) : await post('api/auth/new', value, { 'Content-Type': 'application/json' })
        setResponsePopup({
            msg: response.errors ? <p>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</p> : response.msg,
            ok: response.ok
        })
        setUserForm(emptyUserForm)
        setAddPopup(false)
        setRefresh(!refresh)
    }

    return (
        <Card>
            <CardBody>
                <CardTitle className="h4">Usuarios</CardTitle>
                <p className="card-title-desc">
                    Listado de todas los usuarios registrados en la plataforma
                </p>
                <div aria-label="Page navigation example" className="pagination-rounded position-absolute top-0 m-3" style={{ right: 0 }}>
                    <Button onClick={() => {
                        setEdit(false)
                        setAddPopup(true)
                    }} color="success">Agregar usuario</Button>
                </div>
                <Table
                    data={data}
                    columns={columns}
                />
                {responsePopup != null && <SweetAlert
                    title={responsePopup.ok ? 'Éxito' : 'Error'}
                    type={responsePopup.ok ? 'success' : 'error'}
                    onConfirm={() => setResponsePopup(null)}
                >
                    {responsePopup.msg}
                </SweetAlert>}
                {deletePopup && <SweetAlert
                    showCancel
                    type="info"
                    title="Eliminar usuario"
                    cancelBtnBsStyle="danger"
                    confirmBtnBsStyle="success"
                    confirmBtnText="Aceptar"
                    cancelBtnText="Cancelar"
                    onConfirm={async () => {
                        const response = await del('api/auth/deleteUser', {
                            id: userForm.id,
                        }, { 'Content-Type': 'application/json' })
                        setResponsePopup({
                            msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                            ok: response.ok
                        })
                        setUserForm(emptyUserForm)
                        setRefresh(!refresh)
                        setDeletePopup(false)
                    }}
                    onCancel={() => setDeletePopup(false)}
                ><p>¿Está seguro que desea eliminar el usuario <strong>{userForm.nombre} {userForm.apellido}</strong> con rut <strong>{userForm.rut}</strong>?</p></SweetAlert>}
                {addPopup ? (
                    <SweetAlert
                        showCancel={false}
                        showConfirm={false}
                        title={edit ? "Editar usuario" : "Añadir un usuario"}
                        onCancel={() => setAddPopup(false)}
                    >
                        <AvForm onValidSubmit={handleSubmit}>
                            <Row>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="nombre"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Nombre
                                        </Label>
                                        <AvField
                                            type="text"
                                            className="form-control"
                                            placeholder="Ingrese el nombre del usuario"
                                            id="nombre"
                                            name="nombre"
                                            value={userForm.nombre}
                                            validate={{ required: { value: true, errorMessage: 'El nombre es requerido' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="apellido"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Apellido
                                        </Label>
                                        <AvField
                                            type="text"
                                            className="form-control"
                                            id="apellido"
                                            name="apellido"
                                            placeholder="Ingrese el apellido del usuario"
                                            value={userForm.apellido}
                                            validate={{ required: { value: true, errorMessage: 'El apellido es requerido' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="rut"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Rut
                                        </Label>
                                        <AvField
                                            type="text"
                                            className="form-control"
                                            id="rut"
                                            name="rut"
                                            pattern="^\d{7,8}[-][0-9kK]{1}$"
                                            placeholder="Ingrese el rut del usuario"
                                            value={userForm.rut}
                                            validate={{ required: { value: true, errorMessage: 'El rut es requerido' }, pattern: { value: '^\\d{7,8}[-][0-9kK]{1}$', errorMessage: 'Ingrese un RUT válido' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                {!edit && <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="password"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Contraseña
                                        </Label>
                                        <AvField
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Ingrese una contraseña"
                                            value={userForm.password}
                                            validate={{ required: { value: !edit, errorMessage: 'La contraseña es requerida' }, minLength: { value: 5, errorMessage: 'La contraseña debe tener al menos 5 caracteres' } }}
                                        />
                                    </div>
                                </Col>}
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="telefono"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Teléfono
                                        </Label>
                                        <AvField
                                            type="phone"
                                            className="form-control"
                                            placeholder="Ingrese el teléfono del usuario"
                                            id="telefono"
                                            name="telefono"
                                            value={userForm.telefono}
                                            validate={{ required: { value: true, errorMessage: 'El teléfono es requerido' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="correo"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Correo
                                        </Label>
                                        <AvField
                                            type="email"
                                            className="form-control"
                                            placeholder="Ingrese el correo del usuario"
                                            id="correo"
                                            name="correo"
                                            value={userForm.correo}
                                            validate={{ required: { value: true, errorMessage: 'El correo es requerido' }, email: { value: true, errorMessage: 'Ingrese un correo válido' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="direccion"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Dirección
                                        </Label>
                                        <AvField
                                            type="text"
                                            className="form-control"
                                            placeholder="Ingrese el correo del usuario"
                                            id="direccion"
                                            name="direccion"
                                            value={userForm.direccion}
                                            validate={{ required: { value: true, errorMessage: 'La dirección es requerida' } }}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="rol"
                                            className="form-label w-100"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Rol
                                        </Label>
                                        <AvField
                                            type="select"
                                            className="form-select"
                                            id="rol"
                                            name="rol"
                                            value={userForm.rol}
                                            validate={{ required: { value: true, errorMessage: 'El rol es requerido' } }}
                                        >
                                            <option value="">Seleccion un rol</option>
                                            {
                                                roles.map((item, idx) => <option value={item.id}>{item.rol}</option>)
                                            }
                                        </AvField>
                                    </div>
                                </Col>
                            </Row>
                            <SweetAlertFormButtons
                                confirmBtnText={edit ? "Editar" : "Añadir"}
                                onCancel={() => {
                                    setUserForm(emptyUserForm)
                                    setAddPopup(false)
                                }}
                            />
                        </AvForm>
                    </SweetAlert>
                ) : null
                }
            </CardBody>
        </Card>
    )
}