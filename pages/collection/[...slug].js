import { useRouter } from 'next/dist/client/router'
import React from 'react'
import ProductCollection from '../../components/single-components/ProductCollection'

export default function Collection() {
    return (
        <React.Fragment>
            <ProductCollection/>
        </React.Fragment>
    )
}
