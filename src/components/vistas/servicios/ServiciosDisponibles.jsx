import React from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import Example from '../Example'
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { esES } from '@mui/material/locale';


const ServiciosDisponibles = () => {
  const theme = useTheme();
  return (
    <>
    <Header/>
    <div>ServiciosDisponibles</div>
    <ThemeProvider theme={createTheme(theme, esES)}>
    <Example></Example>
    </ThemeProvider>
    
    <Footer/>
    </>
  )
}

export default ServiciosDisponibles