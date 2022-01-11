import React from 'react'
import {
    CardBody,
    Card,
    CardTitle,
    CardImg,
    CardText,
    Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import Tooltip from './Tooltip'

export default ({ img, room: { paid, state, number, id, servicio }, onCheckout, onEnable, onCancel, onDesalojar }) => {
    const states = {
        1: 'bg-color-success',
        2: 'bg-color-warning',
        3: 'bg-color-danger'
    }

    const innerStates = state != 2 ? states[state].replace('bg', 'border') : (paid ? 'border-color-success' : 'border-color-danger')

    const ButtonHabitacion = ({ children, color, onClick }) => {
        return <Button
            style={{
                // height: 20,
                // width: 40,
            }}
            color={color}
            onClick={onClick}
            className="waves-effect waves-light me-1 my-2"
        >
            {children}
        </Button>
    }

    return <Card style={{ height: 200 }} className={states[state]}>
        <CardBody>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'middle', paddingBottom: 66, height: '100%' }}>
                <div className={innerStates} style={{
                    height: 95,
                    width: 95,
                    borderRadius: '100%',
                    borderWidth: 10,
                    borderStyle: 'solid',
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ alignSelf: 'center' }}>
                        {number}
                    </h2>
                </div>
            </div>
            <div style={{
                borderBottomLeftRadius: '0.25rem',
                borderBottomRightRadius: '0.25rem',
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 65,
                backgroundColor: 'white',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>
                {
                    state == 1 && <Tooltip id={'cuadricula-' + id + '-add-button'} title="Reservar habitación" center>
                        <ButtonHabitacion onClick={() => onCheckout(id)} color="success">
                            <i className="ri-add-fill"></i>
                        </ButtonHabitacion>
                    </Tooltip>
                }
                {
                    state == 2 && <React.Fragment>
                        <Tooltip id={'cuadricula-' + id + '-edit-button'} title="Editar reserva" center>
                            <ButtonHabitacion color="warning">
                                <i className="ri-pencil-fill"></i>
                            </ButtonHabitacion>
                        </Tooltip>

                        <Tooltip id={'cuadricula-' + id + '-desalojar-button'} title="Desalojar habitación" center>
                            <ButtonHabitacion onClick={() => onDesalojar(servicio)} color="info">
                                <i className="ri-logout-box-r-fill"></i>
                            </ButtonHabitacion>
                        </Tooltip>

                        <Tooltip id={'cuadricula-' + id + '-cancel-button'} title="Cancelar Reserva" center>
                            <ButtonHabitacion onClick={() => onCancel(servicio)} color="danger">
                                <i className="ri-delete-bin-5-fill"></i>
                            </ButtonHabitacion>
                        </Tooltip>
                    </React.Fragment>
                }
                {
                    state == 3 && <Tooltip id={'cuadricula-' + id + '-enable-button'} title="Habilitar habitación" center>
                        <ButtonHabitacion onClick={() => onEnable(id)} color="success">
                            <i className="ri-refresh-fill"></i>
                        </ButtonHabitacion>
                    </Tooltip>
                }
            </div>
        </CardBody>
    </Card>
}