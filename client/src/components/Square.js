import React from 'react'

const Square = ({chooseSquare,val}) => {
  return (
    <div className='square' style={val==="X"?{color: 'rgb(0, 153, 255)'}:{color:'red'}} onClick={chooseSquare}>
    {val}
    </div>
  )
}

export default Square