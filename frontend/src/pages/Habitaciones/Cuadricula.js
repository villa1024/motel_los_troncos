import {
    Row,
    Col
} from 'reactstrap'
import img1 from "../../assets/images/small/img-1.jpg";

import CardHabitacion from '../../components/Common/CardHabitacion'

export default ({ rooms, onCheckout, onEnable, onCancel, onEdit, onDesalojar }) => {
    return <Row>
        {rooms.map((room) => <Col mg={3} xl={2} key={`habitación-cuadricula-${room.id}`}>
            <CardHabitacion
                img={img1}
                room={room}
                onCheckout={onCheckout}
                onCancel={onCancel}
                onEnable={onEnable}
                onEdit={onEdit}
                onDesalojar={onDesalojar}
            />
        </Col>)}
    </Row>
}