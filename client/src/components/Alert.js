import React from 'react'

const Alert = (props) => {
  return (
  props.alert &&<div className="alertBox" >
  <div className={`alert alert-${props.alert.type}`} role="alert">
  <strong>{props.alert.msg}</strong>
</div>
</div> 
  )
}

export default Alert