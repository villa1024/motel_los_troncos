import React, { Component } from 'react';
import { Row, Col, Card, CardBody, ButtonGroup, Button } from 'reactstrap';

//Import Charts
import ReactApexChart from 'react-apexcharts';
import "./dashboard.scss";

export default ({ data }) => {
    const series = [
        // {
        //     name: 'Caja',
        //     type: 'column',
        //     data: data.map(item => item.ventas - item.retiros - item.gastos),
        // },
        {
            name: 'Ventas',
            type: 'line',
            data: data.map(item => item.ventas),
        },
        {
            name: 'Gastos',
            type: 'line',
            data: data.map(item => item.gastos),
        },
        {
            name: 'Retiros',
            type: 'line',
            data: data.map(item => item.retiros),
        },
    ]

    const options = {
        chart: {
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            }
        },
        stroke: {
            width: [3, 3, 3],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: true,
        },
        tooltip: {
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return `$ ${value.toLocaleString("es-CL")}`
                }
            }
        },
        colors: ['#1cbb8c', '#ff3d60', '#fcb92c'],
        labels: data.map(item => item.fecha),
    }

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    {/* <div className="float-end d-none d-md-inline-block">
                            <ButtonGroup className="mb-2">
                                <Button size="sm" color="light" type="button">Hoy</Button>
                                <Button size="sm" color="light" active type="button">Semanal</Button>
                                <Button size="sm" color="light" type="button">Mesnsual</Button>
                            </ButtonGroup>
                        </div> */}
                    <h4 className="card-title mb-4">Reporte de caja mensual</h4>
                    <div>
                        <div id="line-column-chart" className="apex-charts" dir="ltr">
                            <ReactApexChart options={options} series={series} type="line" height="280" />
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}