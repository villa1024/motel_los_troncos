export default ({ onConfirm, onCancel, confirmBtnText, type = 'submit' }) => {

    return <p style={{ display: 'flex', zIndex: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '1.25em auto 0px' }}>
        <button onClick={onCancel} className="btn btn-lg btn-danger" style={{ marginRight: '8px' }} >Cancelar</button>
        <button onClick={onConfirm} className="btn btn-lg btn-success" style={{ marginRight: '8px', borderColor: 'rgb(76, 174, 76)', boxShadow: 'rgba(0, 0, 0, 0.075) 0px 1px 1px inset, rgba(76, 174, 76, 0.6) 0px 0px 8px' }} type={type}>{confirmBtnText}</button>
    </p>
}