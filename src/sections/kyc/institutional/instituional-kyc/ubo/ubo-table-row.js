import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
// import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

const getStatusMeta = (status) => {
  if (status === 1) return { color: 'success', label: 'Verified' };
  if (status === 2) return { color: 'error', label: 'Rejected' };
  return { color: 'warning', label: 'Pending' };
};

export default function UboTableRow({
  row,
  selected,
  handleView,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { fullName, email, phone, ownershipPercentage, designationValue, status } = row;

  const { color, label } = getStatusMeta(row.status);

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fullName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{ownershipPercentage}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{designationValue}</TableCell>

        <TableCell>
          <Label color={color}>{label}</Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={() => handleView(row)}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit" placement="top" arrow>
            <IconButton onClick={() => onEditRow(row)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

UboTableRow.propTypes = {
  handleView: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
