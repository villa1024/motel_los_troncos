import { Badge } from "reactstrap"
import React, { Component, useState, useEffect } from "react"
import { timeFormat, moneyFormat } from "../../../helpers/formatters";
import { get } from "../../../api";

import Table from '../../../components/Common/InventarioTable'

export default () => {
    const [data, setData] = useState([]);
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
        // get('/api/').then(res => {
        //     setData(res.data)
        // })
    }, [])

    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true,
        },
        {
            dataField: 'room',
            text: 'N° Habitación',
            sort: true
        },
        {
            dataField: 'checkin_date',
            text: 'Fecha de entrada',
            sort: true
        },
        {
            dataField: 'transaction_date',
            text: 'Fecha de transacción',
            sort: true
        },
        {
            dataField: 'amount',
            text: 'Monto',
            sort: true
        },
        {
            dataField: 'state',
            text: 'Estado',
            sort: true
        },
        {
            dataField: 'obs',
            text: 'Observación',
            sort: true
        },
    ];

    return (
        <Table
            data={data}
            columns={columns}
            order="desc"
        />
    )
}