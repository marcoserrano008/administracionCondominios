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
import { data, states } from './makeData';

const fetchBuildings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/departamentos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const departamentos = await response.json();
      
      // Mapear los resultados para ajustarlos a la estructura que tu aplicación espera
      return departamentos.map(dep => ({
        id: dep.id,
        numeroDepartamento: dep.numeroDepartamento,
        edificio: dep.edificio,
        estado: dep.estado,
        dormitorios: dep.dormitorios,
        baños: dep.banios, // Asegúrate de usar la misma clave que en tu API
        celular: dep.celular,
        garaje: dep.garaje,
        superficie: dep.superficie,
        telefono: dep.telefono,
      }));
  
    } catch (error) {
      console.error("Error fetching buildings: ", error);
      return []; // Devolver un array vacío o manejar el error como creas conveniente
    }
  };




const TablaDepartamentos = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const departamentos = await fetchBuildings();
            setTableData(departamentos);
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
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/departamentos/${id}`, {
            method: 'PUT', // o 'PATCH' si tu API está configurada para ello
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBuilding),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          return await response.json(); // Si tu API devuelve el objeto actualizado
      
        } catch (error) {
          console.error("Error updating building: ", error);
        }
      };

    

      const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        // Aquí deberías realizar la validación de tus datos o la lógica de negocio correspondiente
        const updatedData = await updateBuilding(row.original.id, values);
        if (updatedData) {
          tableData[row.index] = updatedData; // Si tu API devuelve el objeto actualizado
          setTableData([...tableData]);
          exitEditingMode(); // Salir del modo de edición
        }
      };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };


    //Eliminar datos

    const deleteBuilding = async (id) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/departamentos/${id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          return true; // Devuelve true si la eliminación fue exitosa
      
        } catch (error) {
          console.error("Error deleting building: ", error);
          return false; // Devuelve false si hubo un error
        }
      };


      const handleDeleteRow = useCallback(
        async (row) => {
          if (!confirm(`¿Está seguro de que desea eliminar?`)) {
            return;
          }
          const isSuccess = await deleteBuilding(row.original.id);
          if (isSuccess) {
            tableData.splice(row.index, 1);
            setTableData([...tableData]); // Actualiza los datos de la tabla
          }
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
        'estado',
        'telefono',
        'celular',
        'dormitorios',
        'baños',
        'garaje',
        'superficie',

       ]);
       const doc = new jsPDF({orientation: 'landscape'});
       const tData = tableData?.map((row) => ({
        ...row,
        edificio: String(row.edificio),
        numeroDepartamento: String(row.numeroDepartamento),
        estado: String(row.estado),
        telefono: String(row.telefono),
        celular: String(row.celular),
        dormitorios: String(row.dormitorios),
        baños: String(row.baños),
        garaje: String(row.garaje),
        superficie: String(row.superficie),
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

                    if (cell.column.accessorKey === 'telefono') {
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
                accessorKey: 'estado',
                header: 'Estado',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'telefono',
                header: 'Telefono',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'celular',
                header: 'Celular',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'dormitorios',
                header: 'Dormitorios',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: 'number',
                }),
            },
            {
                accessorKey: 'baños',
                header: 'Baños',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: 'number',
                }),
            },
            {
                accessorKey: 'garaje',
                header: 'Garaje',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'superficie',
                header: 'Superficie [m²]',
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
                    <Button className='bg-slate-100'
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    >Exportar a PDF</Button>
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

//TablaDepartamentos of creating a mui dialog modal for creating new rows
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


export default TablaDepartamentos;
