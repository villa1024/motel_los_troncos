import React, { Component } from 'react';
import { Col, Card, CardBody, Button } from "reactstrap";

export default ({ title, value, icon, rate, desc, span = 3, negative = false, onClick, showRate = true }) => {
    return <Col md={span}>
        <Card>
            <CardBody>
                <div className="d-flex">
                    <div className="flex-1 overflow-hidden">
                        <p className="text-truncate font -size-14 mb-2">{title}</p>
                        <h4 className="mb-0">{value}</h4>
                    </div>
                    <div className="text-primary">
                        {
                            icon && onClick ? <Button color="primary" onClick={onClick} size="sm">
                                {icon}
                            </Button> : icon
                        }
                    </div>
                </div>
            </CardBody>

            {showRate && <CardBody className="border-top py-3">
                <div className="text-truncate">
                    <span className={`badge badge-soft-${(negative ? !(rate > 0) : rate > 0) ? 'success' : 'danger'} font-size-11 me-1`}><i className={`mdi mdi-menu-${(negative ? !(rate > 0) : rate > 0) ? 'up' : 'down'}`}> </i> {rate}%</span>
                    <span className="text-muted ms-2">{desc}</span>
                </div>
            </CardBody>}
        </Card>
    </Col>
}