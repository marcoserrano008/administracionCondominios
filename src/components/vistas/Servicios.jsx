import React from 'react'

import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const Servicios = () => {
    return (
        <>

            <div >Servicios</div>
            <Link to={'/'} >
                <Button variant="secondary">
                    Inicio
                </Button>
            </Link>
        </>
    )
}

export default Servicios