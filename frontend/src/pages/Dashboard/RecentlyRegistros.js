import { useState } from "react";
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

export default ({ data }) => {

    return <Card>
        <CardBody>
            <h4 className="card-title mb-4">Registros recientes</h4>

            <SimpleBar style={{ maxHeight: 600 }}>
                <ul className="list-unstyled activity-wid">
                    {
                        data.length === 0 && <li className="text-center">No hay registros</li>
                    }
                    {
                        data.map(item => (
                            <li className="activity-list">
                                <div className="activity-icon avatar-xs">
                                    <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                        <i className="ri-edit-2-fill"></i>
                                    </span>
                                </div>
                                <div>
                                    <div>
                                        <h5 className="font-size-13">{item.fecha} <small className="text-muted">{item.hora}</small></h5>
                                    </div>

                                    <div>
                                        <p className="text-muted mb-0">{item.observacion}</p>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </SimpleBar>
        </CardBody>
    </Card>
}