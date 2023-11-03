import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { getFirestore, collection, getDocs, getDoc } from "firebase/firestore";
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
import { Link, useNavigation } from 'react-router-dom';
import { db } from "../../../firebase";
const fetchBuildings = async () => {
    try {
        // Realizar la solicitud a tu API
        const response = await fetch('http://127.0.0.1:8000/api/pago-servicios');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const pagoServicios = await response.json();

        // Mapear los datos recibidos al formato deseado
        const results = pagoServicios.map((item) => {
            // Convertir la fecha de string a Date y luego a una representación legible
            const date = new Date(item.fechaHoraPago);
            const formattedDate = date.toLocaleDateString(); //+ ' ' + date.toLocaleTimeString();

            return {
                serviceName: item.servicio, // Asumiendo que servicio contiene el nombre o puedes hacer una solicitud adicional para conseguir el nombre si es necesario
                idServicio: item.id, // O cualquier otro identificador si 'servicio' no es el ID
                edificio: item.edificio,
                departamento: item.numeroDepartamento,
                costo: item.costo,
                cobro: item.cobro,
                fechaHoraPago: formattedDate,
                id: item.id
            };
        });

        return results;

    } catch (error) {
        console.error("Error fetching payment services: ", error);
        // Manejar el error adecuadamente en tu UI
    }
};

const getServiceName = async (idServicio) => {
    const db = getFirestore(app);
    const serviceRef = doc(db, "servicios", idServicio);
    const serviceSnap = await getDoc(serviceRef);
    
    if (serviceSnap.exists()) {
        return serviceSnap.data().nombre;
    } else {
        return null; // o cualquier valor predeterminado que quieras retornar en caso de que el documento no exista
    }
};


const TablaPagos = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const cobroServicio = await fetchBuildings();
            setTableData(cobroServicio);
            setIsLoading(false);

        };
        fetchData();
    }, []);

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    //Editar los datos

    const updateBuilding = async (id, updatedBuilding) => {
        const db = getFirestore(app);
        const cobroServicioDoc = doc(db, "pagoServicios", id);
        await updateDoc(cobroServicioDoc, updatedBuilding);
    };


    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            await updateBuilding(row.original.id, values);
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
    const deleteBuilding = async (id) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/pago-servicios/${id}`, {
            method: 'DELETE', // Método HTTP para la operación DELETE
            // Aquí podrías añadir headers si tu API requiere, como tokens de autenticación
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          console.log("Building deleted successfully");
        } catch (error) {
          console.error("Error deleting building: ", error);
          // Manejar el error adecuadamente en tu UI
        }
      };
      
      const handleDeleteRow = useCallback(
        async (row) => {
          if (!window.confirm(`Confirmar para eliminar`)) {
            return;
          }
          await deleteBuilding(row.original.id);
          // Filtrar el dato eliminado en lugar de usar splice, para evitar mutar el estado directamente
          const newData = tableData.filter((item) => item.id !== row.original.id);
          setTableData(newData);
        },
        [tableData, setTableData], // Añade setTableData como dependencia si estás usando React 18+
      );
      


    const createHeaders = (keys) => {
        const result = []

        for (let key of keys) {
            result.push({
                id: key,
                name: key,
                prompt: key,
            })
        }
        return result;
    }


    const handleExportData = async () => {
        const headers = createHeaders([
            'nombre',
            'costo',
            'cobro',
            'contacto',
            'encargado',
        ]);
        const doc = new jsPDF({ orientation: 'landscape' });
        const tData = tableData?.map((row) => ({
            ...row,
            nombre: String(row.nombre),
            costo: String(row.costo),
            cobro: String(row.cobro),
            contacto: String(row.contacto),
            encargado: String(row.encargado),
        }))

        doc.table(1, 1, tData, headers, { autoSize: true })
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
                accessorKey: 'serviceName',
                header: 'Nombre del servicio',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'edificio',
                header: 'Edificio',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'departamento',
                header: 'Numero de Departamento',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'costo',
                header: 'Costo del servicio',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'cobro',
                header: 'Monto pagado',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'fechaHoraPago',
                header: 'Fecha Pagada',
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
                initialState={{ columnVisibility: { baños: false, garaje: false } }}
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

//TablacobroServicio of creating a mui dialog modal for creating new rows
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

export default TablaPagos