import React, { Component, useState, useEffect } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Label } from "reactstrap"
import Tooltip from "../../components/Common/Tooltip";
import SweetAlert from "react-bootstrap-sweetalert";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SweetAlertFormButtons from "../../components/Common/SweetAlertFormButtons";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Table from '../../components/Common/InventarioTable'
import { get, put, del, post } from '../../api'

export default () => {
    const [addPopup, setAddPopup] = useState(false)
    const [editPopup, setEditPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [responsePopup, setResponsePopup] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [tipos, setTipos] = useState([])
    const [bodega, setBodega] = useState([])
    const [edit, setEdit] = useState(false)
    const [data, setData] = useState({
        licores: [],
        bebidas: [],
        comida: [],
        ropa: [],
        utencilios: [],
        otros: [],
    })

    const emptyProduct = {
        id: '',
        stock: '',
        nombre: '',
        id_tipo: '',
        cantidad: '',
        cantidad_minima: '',
        precio: '',
        inventario: { cantidad: '' },
        tipo_producto: { tipo: '' },
    }

    const [product, setProduct] = useState(emptyProduct)

    const breadcrumbItems = [
        { title: "Inventario", link: "#" },
    ]

    const onAddProduct = async () => {
        const response = await get('api/bodega/getBodega')
        setBodega(response.msg)
        setProduct(emptyProduct)
        setAddPopup(true)
    }

    const onEdit = (item, isEdit = false) => {
        setProduct(item)
        setEdit(isEdit)
        setEditPopup(true)
    };

    const onDelete = (item) => {
        setProduct(item)
        setDeletePopup(true)
    };

    const acciones = (item) => <div className="d-flex justify-content-center" style={{ width: '50px' }}>
        <Tooltip id={item.tipo_producto.tipo + '-' + item.id + '-take-button'} title="Editar stock">
            <Button onClick={() => onEdit(item)} color="link" className="text-info">
                <i className="ri-close-fill"></i>
            </Button>
        </Tooltip>
        <Tooltip id={item.tipo_producto.tipo + '-' + item.id + '-edit-button'} title="Editar producto">
            <Button onClick={() => onEdit(item, true)} color="link" className="text-warning">
                <i className="ri-pencil-fill"></i>
            </Button>
        </Tooltip>
        <Tooltip id={item.tipo_producto.tipo + '-' + item.id + '-delete-button'} title="Eliminar producto">
            <Button onClick={() => onDelete(item)} color="link" className="text-danger">
                <i className="ri-delete-bin-5-fill"></i>
            </Button>
        </Tooltip>
    </div>

    useEffect(async () => {
        const response = await get('api/products/obtenerTiposProducto')
        setTipos(response.msg)
    }, [])

    useEffect(async () => {
        const response = await get('api/inventario/getInventario')

        const map_products = (item) => ({
            ...item,
            precio: `$ ${item.precio.toLocaleString("es-CL")}`,
            cantidad: item.inventario.cantidad,
            actions: acciones(item)
        })

        setData({
            licores: response.inventario.filter(item => item.tipo_producto.tipo === 'Licores').map(map_products),
            bebidas: response.inventario.filter(item => item.tipo_producto.tipo === 'Bebida').map(map_products),
            comida: response.inventario.filter(item => item.tipo_producto.tipo === 'Comida').map(map_products),
            ropa: response.inventario.filter(item => item.tipo_producto.tipo === 'Ropa').map(map_products),
            utencilios: response.inventario.filter(item => item.tipo_producto.tipo === 'Utencilios').map(map_products),
            otros: response.inventario.filter(item => item.tipo_producto.tipo === 'Otros').map(map_products),
        })
    }, [refresh, tipos])

    const columns = [
        {
            dataField: 'id',
            text: 'Id',
            sort: true,
        },
        {
            dataField: 'nombre',
            text: 'Producto',
            sort: true
        },
        {
            dataField: 'cantidad',
            text: 'Stock',
            sort: true
        },
        {
            dataField: 'precio',
            text: 'Precio',
            sort: true
        },
        {
            dataField: 'actions',
            text: 'Acciones',
            sort: true
        }
    ];

    const handleAddSubmit = async (event, value) => {
        const response = await post('api/inventario/crearProductoInventario', value, { 'Content-Type': 'application/json' })
        setResponsePopup({
            msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
            ok: response.ok
        })
        setProduct(emptyProduct)
        setRefresh(!refresh)
        setAddPopup(false)
    }

    const handleEditSubmit = async (event, value) => {
        value = {
            ...value,
            id: product?.id,
            id_producto: product?.id,
            stock: product?.cantidad,
        }
        console.log(value)
        if (edit) {
            const response = await put('api/products/editarProducto', value, { 'Content-Type': 'application/json' })
            setResponsePopup({
                msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                ok: response.ok
            })
        } else {
            const response = await put('api/inventario/actualizarStockInventario', value, { 'Content-Type': 'application/json' })
            setResponsePopup({
                msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                ok: response.ok
            })
        }
        setEditPopup(false)
        setRefresh(!refresh)
        setProduct({})
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Inventario" breadcrumbItems={breadcrumbItems} />
                    <div className="position-relative" style={{ height: 50 }}>
                        <div aria-label="Page navigation example" className="pagination-rounded position-absolute top-0" style={{ right: 0 }}>
                            <Button onClick={onAddProduct} color="success">Traer producto de bodega</Button>
                        </div>
                    </div>
                    {addPopup ? (
                        <SweetAlert
                            showCancel={false}
                            showConfirm={false}
                            title="Traer producto de bodega"
                            onCancel={() => setAddPopup(false)}
                        >
                            <AvForm onValidSubmit={handleAddSubmit}>
                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-4">
                                            <Label
                                                htmlFor="id"
                                                className="form-label w-100"
                                                style={{ textAlign: 'left' }}
                                            >
                                                Producto
                                            </Label>
                                            <AvField
                                                type="select"
                                                id="id"
                                                name="id"
                                                className="form-select"
                                                validate={{ required: { value: true, errorMessage: 'El producto es requerido' } }}
                                            >
                                                <option value="">Seleccion un producto</option>
                                                {bodega.map(item => <option value={item.id}>{item.nombre}</option>)}
                                            </AvField>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="mb-4">
                                            <Label
                                                htmlFor="cantidad"
                                                className="form-label w-100"
                                                style={{ textAlign: 'left' }}
                                            >
                                                Stock
                                            </Label>
                                            <AvField
                                                type="number"
                                                className="form-control"
                                                placeholder="Ingrese la cantidad de stock"
                                                id="cantidad"
                                                name="cantidad"
                                                validate={{ required: { value: true, errorMessage: 'La cantidad de stock es requerida' } }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <SweetAlertFormButtons
                                    confirmBtnText="Añadir"
                                    onCancel={() => setAddPopup(false)}
                                />
                            </AvForm>
                        </SweetAlert>
                    ) : null
                    }
                    <Row>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Licores</CardTitle>
                                    <p className="card-title-desc">
                                        licores listados para inventario.
                                    </p>
                                    <Table
                                        data={data.licores}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Bebidas</CardTitle>
                                    <p className="card-title-desc">
                                        Bebidas listados para inventario.
                                    </p>
                                    <Table
                                        data={data.bebidas}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Comidas</CardTitle>
                                    <p className="card-title-desc">
                                        Comidas listados para inventario.
                                    </p>
                                    <Table
                                        data={data.comida}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Ropa</CardTitle>
                                    <p className="card-title-desc">
                                        Ropa listados para inventario.
                                    </p>
                                    <Table
                                        data={data.ropa}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Utencilios</CardTitle>
                                    <p className="card-title-desc">
                                        Utencilios listados para inventario.
                                    </p>
                                    <Table
                                        data={data.utencilios}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="col-6">
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Otros</CardTitle>
                                    <p className="card-title-desc">
                                        Otros productos listados para inventario.
                                    </p>
                                    <Table
                                        data={data.otros}
                                        columns={columns}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
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
                        title="Eliminar producto"
                        cancelBtnBsStyle="danger"
                        confirmBtnBsStyle="success"
                        confirmBtnText="Aceptar"
                        cancelBtnText="Cancelar"
                        onConfirm={async () => {
                            const response = await del('api/products/eliminarProducto', {
                                id_producto: product.id,
                            }, { 'Content-Type': 'application/json' })
                            setResponsePopup({
                                msg: response.errors ? <>{Object.keys(response.errors).map(item => <>- {response.errors[item].msg}<br /></>)}</> : response.msg,
                                ok: response.ok
                            })
                            setProduct({})
                            setRefresh(!refresh)
                            setDeletePopup(false)
                        }}
                        onCancel={() => setDeletePopup(false)}
                    ><p>¿Está seguro que desea eliminar el producto: <strong>{product.nombre}</strong>?</p></SweetAlert>}
                    {editPopup ? (
                        <SweetAlert
                            showCancel={false}
                            showConfirm={false}
                            title={edit ? 'Editar producto' : `Editar stock de ${product.nombre}`}
                            onCancel={() => setEditPopup(false)}
                        >
                            <AvForm onValidSubmit={handleEditSubmit}>
                                <Row>
                                    {
                                        edit ? <Row>
                                            <Col lg={12}>
                                                <div className="mb-4">
                                                    <Label
                                                        htmlFor="nombre"
                                                        className="form-label w-100"
                                                        style={{ textAlign: 'left' }}
                                                    >
                                                        Producto
                                                    </Label>
                                                    <AvField
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ingrese el nombre del producto"
                                                        id="nombre"
                                                        name="nombre"
                                                        validate={{ required: { value: true, errorMessage: 'El nombre del producto es requerido' } }}
                                                        value={product.nombre}
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={12}>
                                                <div className="mb-4">
                                                    <Label
                                                        htmlFor="id_tipo"
                                                        className="form-label w-100"
                                                        style={{ textAlign: 'left' }}
                                                    >
                                                        Categoría
                                                    </Label>
                                                    <AvField
                                                        type="select"
                                                        className="form-select"
                                                        id="id_tipo"
                                                        name="id_tipo"
                                                        value={tipos.find(item => item.tipo === product.tipo_producto.tipo).id}
                                                        validate={{ required: { value: true, errorMessage: 'La categoría es requerida' } }}
                                                    >
                                                        <option value="">Seleccion una categoría</option>
                                                        {tipos.map(tipo => <option value={tipo.id}>{tipo.tipo}</option>)}
                                                    </AvField>
                                                </div>
                                            </Col>
                                            <Col lg={12}>
                                                <div className="mb-4">
                                                    <Label
                                                        htmlFor="precio"
                                                        className="form-label w-100"
                                                        style={{ textAlign: 'left' }}
                                                    >
                                                        Precio
                                                    </Label>
                                                    <AvField
                                                        type="number"
                                                        className="form-control"
                                                        id="precio"
                                                        name="precio"
                                                        placeholder="Ingrese el precio del producto"
                                                        value={product.precio}
                                                        validate={{ required: { value: true, errorMessage: 'El precio es requerido' } }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row> : <Col lg={12}>
                                            <div className="mb-4">
                                                <Label
                                                    htmlFor="cantidad"
                                                    className="form-label w-100"
                                                    style={{ textAlign: 'left' }}
                                                >
                                                    Stock
                                                </Label>
                                                <AvField
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Ingrese la cantidad de stock"
                                                    id="cantidad"
                                                    name="cantidad"
                                                    value={product?.inventario?.cantidad}
                                                    validate={{ required: { value: true, errorMessage: 'La cantidad es requerida' } }}
                                                />
                                            </div>
                                        </Col>
                                    }
                                </Row>
                                <SweetAlertFormButtons
                                    confirmBtnText={"Editar"}
                                    onCancel={() => setEditPopup(false)}
                                />
                            </AvForm>
                        </SweetAlert>
                    ) : null
                    }
                </div >
            </div >
        </React.Fragment >
    )
}