import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

// MUI
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// mock
import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';

import {
    useTable,
    getComparator,
    TableNoData,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';

// ❌ REMOVE API
// import { useGetUBOs } from 'src/api/merchantKyc';
import { useBoolean } from 'src/hooks/use-boolean';
import SignatoriesTableRow from '../signatories-table-row';
import KYCAddSignatoriesForm from '../kyc-add-signatories-form';


// ----------------------------------
// ✅ DUMMY DATA
// ----------------------------------

const dummySignatories = [
    {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        ownershipPercentage: 40,
        designationValue: 'Director',
        status: 'active',
    },
    {
        id: '2',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9123456780',
        ownershipPercentage: 60,
        designationValue: 'Partner',
        status: 'active',
    },
];

// ----------------------------------

const defaultFilters = {
    name: '',
    role: [],
    status: 'all',
};

export default function SignatoriesListView({
    percent,
    setActiveStepId,
}) {
    const table = useTable();
    const settings = useSettingsContext();
    const router = useRouter();

    const confirm = useBoolean();

    const [open, setOpen] = useState(false);
    const [selectedUBO, setSelectedUBO] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // ❌ REMOVE API
    // const { ubos = [], refreshUbos, loading } = useGetUBOs();

    // ✅ USE DUMMY DATA
    const [tableData, setTableData] = useState(dummySignatories);

    const [filters, setFilters] = useState(defaultFilters);

    // ----------------------------------
    // ✅ FORCE STEP COMPLETE
    // ----------------------------------
    useEffect(() => {
        percent(100);
    }, [percent]);

    // ----------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const canReset = !isEqual(defaultFilters, filters);

    const handleFilters = useCallback(
        (name, value) => {
            table.onResetPage();
            setFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [table]
    );

    const handleDeleteRow = useCallback(
        (id) => {
            const deleteRow = tableData.filter((row) => row.id !== id);
            setTableData(deleteRow);
        },
        [tableData]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
        setTableData(deleteRows);
    }, [table, tableData]);

    const handleAdd = () => {
        setSelectedUBO(null);
        setOpen(true);
    };

    const handleView = (row) => {
        setSelectedUBO(row);
        setViewMode(true);
        setOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedUBO(row);
        setEditMode(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUBO(null);
        setViewMode(false);
        setEditMode(false);
    };

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    // ----------------------------------
    // ✅ NEXT BUTTON FREE FLOW
    // ----------------------------------
    const handleNext = () => {
        console.log('UBO STEP DONE');

        percent(100);
        setActiveStepId();
    };

    const notFound = !dataFiltered.length;

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography variant="h3" color="primary" fontWeight={700}>
                        Ultimate Beneficial Owners
                    </Typography>

                    <Typography variant="h5">
                        Add all UBO details for KYC
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h4">Add UBO</Typography>

                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        New Signatories
                    </Button>
                </Stack>

                <Card>
                    {/* <UboTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_roles}
          />

          {canReset && (
            <UboTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5 }}
            />
          )} */}

                    <TableContainer>
                        <Scrollbar>
                            <Table sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={[
                                        { id: 'fullName', label: 'Name' },
                                        { id: 'email', label: 'Email' },
                                        { id: 'phone', label: 'Phone' },
                                        // { id: 'ownershipPercentage', label: '%' },
                                        { id: 'designationValue', label: 'Designation' },
                                        { id: 'status', label: 'Status' },
                                        { id: '', label: 'Action' },
                                    ]}
                                />

                                <TableBody>
                                    {dataFiltered.map((row) => (
                                        <SignatoriesTableRow
                                            key={row.id}
                                            row={row}
                                            onDeleteRow={() => handleDeleteRow(row.id)}
                                            onEditRow={() => handleEdit(row)}
                                            handleView={handleView}
                                        />
                                    ))}

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>

                {/* ✅ ALWAYS ENABLED */}
                <Box sx={{ textAlign: 'right', mt: 3 }}>
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                </Box>
            </Container>

            <KYCAddSignatoriesForm open={open} onClose={handleClose} />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure?"
                action={
                    <Button color="error" onClick={handleDeleteRows}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

SignatoriesListView.propTypes = {
    percent: PropTypes.func.isRequired,
    setActiveStepId: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
    const { name, status, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter((user) =>
            user.fullName?.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (status !== 'all') {
        inputData = inputData.filter((user) => user.status === status);
    }

    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.designationValue));
    }

    return inputData;
}
