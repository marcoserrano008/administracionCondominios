import React from 'react'
import Header from '../../reusables/Header'
import TablaAsistenciaEmpleados from './TablaAsistenciaEmpleados'
import Footer from '../../reusables/Footer'

const ReporteIngresoSalida = () => {
  return (
    <>
    <Header/>
    <div>ReporteIngresoSalida</div>
    <TablaAsistenciaEmpleados></TablaAsistenciaEmpleados>
    <Footer/>
    </>
  )
}

export default ReporteIngresoSalida