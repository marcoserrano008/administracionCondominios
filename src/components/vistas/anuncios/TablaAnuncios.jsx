import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from '../../../firebase';
//Import Material React Table Translations
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "@/components/ui/button"

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

import {
    Box,
    
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const fetchBuildings = async () => {
    try {
      // Realizar petición GET a tu API de Laravel
      const response = await fetch('http://127.0.0.1:8000/api/anuncios');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parsear la respuesta JSON
      const data = await response.json();
      
      // Mapear los datos recibidos a la estructura que necesita tu aplicación
      return data.map(anuncio => ({
        edificio: anuncio.edificio,
        numeroDepartamento: anuncio.numeroDepartamento,
        tipo: anuncio.tipo,
        precio: anuncio.precio,
        contacto1: anuncio.contacto1,
        contacto2: anuncio.contacto2,
        descripcion: anuncio.descripcion,
        id: anuncio.id
        // Agrega aquí más campos si son necesarios
      }));
    } catch (error) {
      console.error("Error fetching buildings:", error);
      return []; // Retorna un arreglo vacío o maneja el error como prefieras
    }
  };
  

const TablaAnuncios = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const edificios = await fetchBuildings();
            setTableData(edificios);
            setIsLoading(false);
    
        };
        fetchData();
    }, []);

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    //Editar los datos

    const updatePropietario = async (id, updatedBuilding) => {
        const db = getFirestore(app);
        const edificioDoc = doc(db, "anuncios", id);
        await updateDoc(edificioDoc, updatedBuilding);
    };

    

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            await updatePropietario(row.original.id, values);
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };


//Eliminar datos

const deletePropietario = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/anuncios/${id}`, {
        method: 'DELETE',
        // Si tu API requiere un header específico para la autorización o cualquier otro,
        // debes incluirlo en la configuración de la solicitud.
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Ejemplo de como añadir un token de autorización
        },
      });
  
      if (!response.ok) {
        // Si el servidor responde con un error, lanzamos una excepción
        throw new Error(`Error al eliminar: ${response.statusText}`);
      }
      
      // Aquí puedes agregar código adicional si necesitas procesar la respuesta.
  
    } catch (error) {
      console.error("Error al eliminar el propietario:", error);
      // Aquí puedes manejar el error, como mostrar un mensaje al usuario
    }
  };
  
  const handleDeleteRow = useCallback(
    async (row) => {
      if (!confirm(`Confirmar para eliminar`)) {
        return;
      }
      await deletePropietario(row.original.id);
      const updatedTableData = tableData.filter((item) => item.id !== row.original.id);
      setTableData(updatedTableData);
    },
    [tableData],
  );
  
    
    const createHeaders = (keys) => {
        const result = []

        for (let key of keys){
            result.push({
                id: key,
                name: key,
                prompt: key,
            })
        }
        return result;
    }


    const handleExportData = async () => {
       const  headers = createHeaders([
        'edificio',
        'numeroDepartamento',
        'tipo',
        'precio',
        'contacto1',
        'contacto2',
        'descripcion',


       ]);
       const doc = new jsPDF({orientation: 'landscape'});
       const tData = tableData?.map((row) => ({
        ...row,

        edificio: String(row.edificio),
        numeroDepartamento: String(row.numeroDepartamento),
        tipo: String(row.tipo),
        precio: String(row.precio),
        contacto1: String(row.contacto1),
        contacto2: String(row.contacto2),
        descripcion: String(row.descripcion),
       }))

       doc.table(1,1,tData,headers,{autoSize:true})
       doc.save('data.pdf')
        console.log('sss')
      };

    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    let isValid = validateRequired(event.target.value);

                    // if (cell.column.accessorKey === 'correo') {
                    //     isValid = validateEmail(event.target.value);
                    // } else 
                    if (cell.column.accessorKey === 'contacto') {
                        isValid = validatePhoneNumber(event.target.value); // Asumo que tienes una función de validación para teléfonos, si no la tienes, puedes usar validateRequired o crear una.
                    }

                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.header} es obligatorio`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'edificio',
                header: 'Nombre del edificio',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'numeroDepartamento',
                header: 'Numero de Departamento',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'tipo',
                header: 'Tipo Publicación',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'precio',
                header: 'Precio [$us]',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'contacto1',
                header: 'Contacto 1',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'contacto2',
                header: 'Contacto 2',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),

                }),
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripcion',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),

                }),
            },

        ],
        [getCommonEditTextFieldProps],
    );

    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                columns={columns}
                data={tableData}
                editingMode="modal" //default

                localization={MRT_Localization_ES}
                state={{ isLoading: isLoading }}
                enableRowNumbers
                rowNumberMode="original" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>

                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <>
                    <div>
                      <Button className='bg-slate-100 ml-5'
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={handleExportData}
                      >Exportar a PDF</Button>
                    </div>
                  </>   
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            /> 
        </>
    );
};

//TablaEdificios of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Account
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
const validateAge = (age) => age >= 18 && age <= 50;

const validatePhoneNumber = (phoneNumber) =>
    !!phoneNumber.length &&
    !!phoneNumber.match(/^\d{1,15}$/);




export default TablaAnuncios