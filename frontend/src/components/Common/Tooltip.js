import { Fragment, useState } from 'react'
import { Tooltip } from 'reactstrap'

export default ({ id, title, placement = 'top', center, children }) => {
    const [open, setOpen] = useState(false)
    return <Fragment>
        <Tooltip placement={placement} toggle={() => setOpen(!open)} isOpen={open} target={id}>{title}</Tooltip>
        <div id={id} className={center ? 'my-auto' : ''}>
            {children}
        </div>
    </Fragment>
}