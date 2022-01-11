import { useState, useContext, useEffect } from 'react';
import {
    Row,
    Col,
    CardTitle,
} from "reactstrap";
import CardPromocion from '../../../../components/Common/CardPromocion'
import SummaryContext from '../SummaryContext'
import { get } from '../../../../api'

export default ({ inventario }) => {
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

    const addPromotions = (promotion) => setOrderSummary({
        ...orderSummary,
        promotions: [...orderSummary.promotions, promotion]
    })

    const editPromotion = (idx, promotion) => {
        const promotions = [...orderSummary.promotions]
        promotions[idx] = promotion
        setOrderSummary({
            ...orderSummary,
            promotions
        })
    }

    const deletePromotion = (idx) => setOrderSummary({
        ...orderSummary,
        promotions: [...orderSummary.promotions.slice(0, idx), ...orderSummary.promotions.slice(idx + 1)]
    })

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