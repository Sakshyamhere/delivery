import React from 'react'
import { ColorRing } from 'react-loader-spinner'

function Spinner() {
  return (
    <div>
        <ColorRing
  visible={true}
  height="60"
  width="60"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={[]}
  />
    </div>
  )
}

export default Spinner