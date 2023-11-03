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

const fetchPersonal = async () => {
    try {
        // Realizamos la solicitud GET a la API de Laravel
        const response = await fetch('http://127.0.0.1:8000/api/personal');

        if (!response.ok) {
            // Si la respuesta no es 2xx, lanzamos un error
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const personal = await response.json();

        // Mapeamos los datos recibidos al formato deseado
        return personal.map(persona => ({
            nombre: persona.nombre,
            apellidoPaterno: persona.apellidoPaterno,
            apellidoMaterno: persona.apellidoMaterno,
            cargo: persona.cargo,
            horaIngreso: persona.horaIngreso,
            horaSalida: persona.horaSalida,
            diasSemana: persona.diasSemana,
            contacto: persona.contacto,
            id: persona.id
        }));

    } catch (error) {
        console.error("Error al obtener el personal: ", error);
        // Manejar el error como prefieras, por ejemplo, podrías devolver un arreglo vacío o re-lanzar el error
        throw error;
    }
};

const TablaPersonal = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const personal = await fetchPersonal();
            setTableData(personal);
            setIsLoading(false);
    
        };
        fetchData();
    }, []);

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    //Editar los datos

    const updatePersonal = async (id, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/personal/${id}`, {
                method: 'PUT', // Indica el método PUT para la actualización
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí deberías agregar cualquier encabezado adicional necesario, como tokens de autorización
                },
                body: JSON.stringify(updatedData) // Convierte los datos actualizados en una cadena JSON
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return await response.json(); // Devuelve la respuesta parseada como JSON
    
        } catch (error) {
            console.error("Error updating personal: ", error);
            throw error; // Re-lanza el error para manejarlo en otra parte del código
        }
    };

    

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            const updatedRow = await updatePersonal(row.original.id, values);
            tableData[row.index] = updatedRow;
            setTableData([...tableData]);
            exitEditingMode();
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };


    //Eliminar datos

    const deletePersonal = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/personal/${id}`, {
                method: 'DELETE', // Indica el método DELETE para la eliminación
                headers: {
                    // Aquí deberías agregar cualquier encabezado adicional necesario, como tokens de autorización
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return response.status; // Devuelve el estado de la respuesta para confirmar la eliminación
    
        } catch (error) {
            console.error("Error deleting personal: ", error);
            throw error;
        }
    };

    const handleDeleteRow = useCallback(
        async (row) => {
            if (!confirm(`Confirmar para eliminar`)) {
                return;
            }
            await deletePersonal(row.original.id);
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData]
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
        'nombre',
        'apellidoPaterno',
        'apellidoMaterno',
        'cargo',
        'horaIngreso',
        'horaSalida',
        'diasSemana',
        'contato',
        'id',
       ]);
       const doc = new jsPDF({orientation: 'landscape'});
       const tData = tableData?.map((row) => ({
        ...row,

        nombre: String(row.nombre),
        apellidoPaterno: String(row.apellidoPaterno),
        apellidoMaterno: String(row.apellidoMaterno),
        cargo: String(row.cargo),
        horaIngreso: String(row.horaIngreso),
        horaSalida: String(row.horaSalida),
        diasSemana: String(row.diasSemana),
        contato: String(row.contacto),
        id: String(row.id),
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
                accessorKey: 'nombre',
                header: 'Nombre del edificio',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'apellidoPaterno',
                header: 'Apellido Paterno',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'apellidoMaterno',
                header: 'Apellido Materno',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'cargo',
                header: 'Cargo',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'horaIngreso',
                header: 'Hora de Ingreso',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'horaSalida',
                header: 'Hora de Salida',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'contacto',
                header: 'Numero de Contacto',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: 'number',
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
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
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

//Tablapersonal of creating a mui dialog modal for creating new rows
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


export default TablaPersonal