import { useState, useContext, useEffect } from 'react';
import {
    Row,
    Col,
    CardTitle,
} from "reactstrap";
import CardPromocion from '../../../../components/Common/CardPromocionEditar'
import SummaryContext from '../SummaryContext'
import { get, post, put, del } from '../../../../api'

export default ({ id_servicio, inventario }) => {
    const { orderSummary, setOrderSummary } = useContext(SummaryContext)
    const [promotions, setPromotions] = useState([])

    useEffect(async () => {
        const response = await get('api/services/listarPromociones')

        setPromotions(response.msg.map(item => {
            const included = []
            if (item.trago && item.bebida) {
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
            } else if (item.trago) {
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
            } else if (item.bebida) {
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
                ...item,
                hours: item.horas,
                price: item.precio,
                description: item.descripcion,
                included
            }
        }))


    }, [])

    const addPromotions = async (promotion) => {
        const response = await post(`api/servicio_promocion/agregarPromocion`, {
            id_servicio,
            promocion: {
                id_promocion: promotion.id,
                id_productos: promotion.beberages.map(item => item.value.id),
                id_tipo_pago: orderSummary.metodo_de_pago
            }
        }, { 'Content-Type': 'application/json' })
        console.log(response)
        setOrderSummary({
            ...orderSummary,
            promotions: [...orderSummary.promotions, promotion]
        })
    }

    const editPromotion = async (idx, promotion) => {
        const response = await put(`api/services/editarPromocion`, {
            id_servicio,
            id_promocion: promotion.id,
            id_producto1: promotion.beberages[0]?.value?.id,
            id_producto2: promotion.beberages[1]?.value?.id,
        }, { 'Content-Type': 'application/json' })
        console.log(response)
        const promotions = [...orderSummary.promotions]
        promotions[idx] = promotion
        setOrderSummary({
            ...orderSummary,
            promotions
        })
    }

    const deletePromotion = async (idx) => {
        const response = await del(`api/servicio_promocion/eliminarPromocion`, {
            id_servicio,
            id_promocion: orderSummary.promotions[idx].id
        }, { 'Content-Type': 'application/json' })
        setOrderSummary({
            ...orderSummary,
            promotions: [...orderSummary.promotions.slice(0, idx), ...orderSummary.promotions.slice(idx + 1)]
        })
    }

    return <div>
        <CardTitle className="h4">
            Añadir promociones
        </CardTitle>
        <p className="card-title-desc">
            Estas son las promociones disponibles para añadir
        </p>
        <Row>
            {
                promotions.map((promotion) => (<Col lg={4} sm={6} key={promotion.id}>
                    <CardPromocion
                        inventario={inventario}
                        promotion={promotion}
                        added={false}
                        addPromotions={addPromotions}
                        active={false} />
                </Col>))
            }
        </Row>

        <CardTitle className="h4">
            Promociones añadidas
        </CardTitle>
        <p className="card-title-desc">
            Estas son las promociones que el cliente ya ha añadido
        </p>
        <Row>
            {
                orderSummary.promotions.map((promotion, idx) => (<Col lg={4} sm={6} key={`${promotion.id}-${idx}`}>
                    <CardPromocion
                        current_idx={idx}
                        inventario={inventario}
                        promotion={promotion}
                        editPromotion={editPromotion}
                        deletePromotion={deletePromotion}
                        added={true}
                        active={true} />
                </Col>))
            }
        </Row>

        {/* <CardTitle className="h4">
            Promociones pagadas
        </CardTitle>
        <p className="card-title-desc">
            Estas son las promociones que el cliente ya pagó
        </p>
        <Row>
            {
                [].map((promotion) => (<Col lg={4} sm={6}>
                    <CardPromocion
                        inventario={inventario}
                        promotion={promotion}
                        addPromotions={addPromotions}
                        added={true}
                        active={true} />
                </Col>))
            }
        </Row> */}
    </div>
}