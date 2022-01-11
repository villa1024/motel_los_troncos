import React, { useState, useContext, useEffect } from 'react';
import {
    Input,
    Card,
    Label,
    CardBody,
    CardTitle,
} from "reactstrap";

import { Link } from 'react-router-dom'
import classnames from 'classnames'
import SweetAlert from "react-bootstrap-sweetalert";
import Switch from 'react-switch'
import SummaryContext from '../../pages/Habitaciones/Editar/SummaryContext'

export default ({ current_idx, inventario, active, added, addPromotions, editPromotion, deletePromotion, promotion, paid }) => {
    const { setPaid } = useContext(SummaryContext)
    const [addPopup, setAddPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [editPopup, setEditPopup] = useState(false)
    const [beberages, setBeberages] = useState(current_idx != null ? promotion.beberages : Array(promotion.included.length).fill({}))
    const [options, setOptions] = useState({})

    useEffect(() => {
        if (addPopup) {
            setBeberages(Array(promotion.included.length).fill({}))
        }
    }, [addPopup])

    useEffect(() => {
        setOptions({
            1: inventario.filter(item => item.tipo_producto.tipo === 'Licores'),
            2: inventario.filter(item => item.tipo_producto.tipo === 'Bebida'),
        })
    }, [inventario])

    const beberageChange = (idx, value) => {
        let temp = beberages
        temp[idx] = {
            id: value.target.id,
            value: inventario.find(item => item.id == value.target.value)
        }
        setBeberages(temp)
        setRefresh(!refresh)
    }

    function DollarSymbol() {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 12,
                    color: "#fff",
                    paddingRight: 2
                }}
            >
                {" "}
                <i className="ri-money-dollar-circle-line"></i>
            </div>
        );
    };

    return <Card className={classnames("border rounded shipping-address", {
        'active': active
    })}>
        <CardBody>
            {
                !paid && <Link onClick={added ? () => setEditPopup(true) : () => setAddPopup(true)} to="#" className="float-end ms-1">
                    {
                        added ? 'Editar' : 'Añadir'
                    }
                </Link>
            }
            {
                (added && false) && <Switch
                    uncheckedIcon={<DollarSymbol />}
                    className="me-1 mb-sm-8 mb-2"
                    checkedIcon={<DollarSymbol />}
                    onColor="#38a4f8"
                    onChange={() => setPaid(promotion.id)}
                    checked={paid}
                />
            }
            <h5 className="font-size-14 mb-4">
                Promoción {promotion.hours} {promotion.hours > 1 ? `horas` : `hora`}
            </h5>

            <h5 className="font-size-14">
                ${promotion.price.toLocaleString("es-CL")}
            </h5>
            <p className="mb-1">
                {promotion.description}
            </p>
            {/* <p className="mb-0">Mo. 012-345-6789</p> */}
        </CardBody>
        {addPopup ? (
            <SweetAlert
                showCancel
                title="Escoger añadidos de la promoción"
                cancelBtnBsStyle="danger"
                confirmBtnBsStyle="success"
                confirmBtnText="Añadir"
                cancelBtnText="Cancelar"
                onConfirm={() => {
                    const form = document.querySelector('#beberages')
                    if (form.checkValidity()) {
                        addPromotions({
                            ...promotion,
                            beberages
                        })
                        setAddPopup(false)
                    } else {
                        form.reportValidity()
                    }
                }}
                onCancel={() => setAddPopup(false)}
            >
                {
                    promotion.included.length === 0 && <div className="my-2">
                        <p>Esta promoción no incluye bebestibles</p>
                    </div>
                }
                <form id={`beberages`}>
                    {
                        promotion.included.map((item, idx) => (
                            <div className="my-2" key={`bebestible-add-${idx}`}>
                                <CardTitle className="h4 mt-4">
                                    Bebestible {idx + 1}
                                </CardTitle>
                                {
                                    item.map(type => (
                                        <React.Fragment>
                                            <p className="card-title-desc mb-0 mt-2">
                                                {type.type}
                                            </p>
                                            <div className="mx-4">
                                                {
                                                    options[type.id].map((option, sub_idx) => {
                                                        return (
                                                            <div className="form-check" key={`bebestible-add-${idx}-inventario-${option.id}`}>
                                                                <Input required id={sub_idx} className="form-check-input" type="radio" name={`bebestible-${idx + 1}`} checked={beberages[idx]?.value?.id == option.id} onChange={(value) => beberageChange(idx, value)} value={option.id} />
                                                                <Label className="form-check-label" id={sub_idx}>
                                                                    {option.nombre}
                                                                </Label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        ))
                    }
                </form>
            </SweetAlert>
        ) : null
        }
        {editPopup ? (
            <SweetAlert
                showCancel={false}
                showConfirm={false}
                title="Editar promoción"
                onConfirm={() => {
                    addPromotions({
                        ...promotion,
                        beberages
                    })
                    setEditPopup(false)
                }}
                onCancel={() => setEditPopup(false)}
            >
                {
                    promotion.included.length === 0 && <div className="my-2">
                        <p>Esta promoción no incluye bebestibles</p>
                    </div>
                }
                <form id={`beberages`}>
                    {
                        promotion.included.map((item, idx) => (
                            <div className="my-2" key={`bebestible-edit-${idx}`}>
                                <CardTitle className="h4 mt-4">
                                    Bebestible {idx + 1}
                                </CardTitle>
                                {
                                    item.map(type => (
                                        <React.Fragment>
                                            <p className="card-title-desc mb-0 mt-2">
                                                {type.type}
                                            </p>
                                            <div className="mx-4">
                                                {
                                                    options[type.id].map((option, sub_idx) => (
                                                        <div className="form-check" key={`bebestible-edit-${idx}-inventario-${option.id}`}>
                                                            <Input id={sub_idx} className="form-check-input" type="radio" name={`bebestible-${idx + 1}`} value={option.id} checked={beberages[idx]?.value?.id == option.id} onChange={(value) => beberageChange(idx, value)} />
                                                            <Label className="form-check-label" id={sub_idx}>
                                                                {option.nombre}
                                                            </Label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        ))
                    }
                </form>
                <p style={{ display: 'flex', zIndex: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '1.25em auto 0px' }}>
                    <button onClick={() => setEditPopup(false)} className="btn btn-lg btn-danger" style={{ marginRight: '8px' }} >Cancelar</button>
                    <button onClick={() => deletePromotion(current_idx)} className="btn btn-lg btn-danger" style={{ marginRight: '8px' }}>Eliminar</button>
                    <button onClick={() => {
                        const form = document.querySelector('#beberages')
                        if (form.checkValidity()) {
                            editPromotion(current_idx, {
                                ...promotion,
                                beberages
                            })
                            setEditPopup(false)
                        } else {
                            form.reportValidity()
                        }
                    }} className="btn btn-lg btn-success" style={{ marginRight: '8px', borderColor: 'rgb(76, 174, 76)', boxShadow: 'rgba(0, 0, 0, 0.075) 0px 1px 1px inset, rgba(76, 174, 76, 0.6) 0px 0px 8px' }}>Editar</button>
                </p>
            </SweetAlert>
        ) : null
        }
    </Card >
}