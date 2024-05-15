import { useRouter } from 'next/router'
import React from 'react'

function Products() {
    const router=useRouter()
  return (
    <div>{router.query.slug}</div>
  )
}

export default Products