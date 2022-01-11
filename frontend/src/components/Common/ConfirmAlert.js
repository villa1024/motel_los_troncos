import { useState } from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import {
    Button
} from 'reactstrap'

export default ({ children, buttonColor = "link", onConfirm, title }) => {
    const [show, setShow] = useState(false)

    return <>
        {show && <SweetAlert
            showCancel
            type="info"
            title={title}
            cancelBtnBsStyle="danger"
            confirmBtnBsStyle="success"
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            onConfirm={async () => {
                await onConfirm()
                setShow(false)
            }}
            onCancel={() => setShow(false)}
        />}
        {children && <Button onClick={() => setShow(true)} color={buttonColor}>
            {children}
        </Button>}
    </>
}