import React from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import Example from '../Example'
import TablaEdificios from './tablaEdificios'

const VerEdificios = () => {
  return (
    <>
    <Header/>
    <div>Ver Edificios</div>
    <TablaEdificios></TablaEdificios>
    <Footer/>
    </>
  )
}

export default VerEdificios