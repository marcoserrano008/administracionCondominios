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
    const db = getFirestore(app);
    const edificiosCol = collection(db, "ingresos");
    const edificioSnapshot = await getDocs(edificiosCol);
    return edificioSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            edificio: data.edificio,
            numeroDepartamento: data.numeroDepartamento,
            nombreCompleto: data.nombreCompleto,
            registroSalida: data.registroSalida,
            motivoVisita: data.motivoVisita,
            tipoVisitante: data.tipoVisitante,
            
            // fechaHoraIngreso: data.fechaHoraIngreso,

            id: doc.id
        };
    });
};



const TablaIngresosSalidas = () => {
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
        const edificioDoc = doc(db, "ingresos", id);
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
        const db = getFirestore(app);
        const edificioDoc = doc(db, "ingresos", id);
        await deleteDoc(edificioDoc);
    };


    const handleDeleteRow = useCallback(
        async (row) => {
            if (!confirm(`Are you sure you want to delete ${row.getValue('edificio')}`)) {
                return;
            }
            await deletePropietario(row.original.id);
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
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
            'edificio',
            'numeroDepartamento',
            'nombreCompleto',
            'registroSalida',
            'motivoVisita',
            'tipoVisitante',
        ]);
        const doc = new jsPDF({ orientation: 'landscape' });
        const tData = tableData?.map((row) => ({
            ...row,

            nombre: String(row.nombre),
            cargo: String(row.cargo),
            fechaHoraIngreso: String(row.fechaHoraIngreso),
            fechaHoraSalida: String(row.fechaHoraSalida),
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
                header: 'Edificio',
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
                accessorKey: 'nombreCompleto',
                header: 'Nombre Completo del Vistante',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                
                }),
            },
            {
                accessorKey: 'registroSalida',
                header: 'Registró su salida',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                 
                }),
            },
            {
                accessorKey: 'motivoVisita',
                header: 'Motivo de la Visita',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
               
                }),
            },
            {
                accessorKey: 'tipoVisitante',
                header: 'Tipo de Visitante',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
             
                }),
            },
            {
                accessorKey: 'fechaHoraIngreso',
                header: 'Fecha y Hora de Ingreso',
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




export default TablaIngresosSalidas