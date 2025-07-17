import React from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Box,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  PendingActions,
  LocalShipping,
  Cancel,
  Refresh,
  Add,
  ArrowDownward,
  ArrowUpward
} from '@mui/icons-material';

const bookings = [
  { id: 501, customer: 'Charlie Brown', status: 'Pending', date: '2023-05-15', vehicle: 'Toyota Hilux', amount: 'R1,250' },
  { id: 502, customer: 'Diana Prince', status: 'Completed', date: '2023-05-14', vehicle: 'Ford Ranger', amount: 'R980' },
  { id: 503, customer: 'Bruce Wayne', status: 'In Transit', date: '2023-05-16', vehicle: 'VW Amarok', amount: 'R1,520' },
  { id: 504, customer: 'Clark Kent', status: 'Cancelled', date: '2023-05-12', vehicle: 'Isuzu D-Max', amount: 'R1,100' },
];

const statusColors = {
  Pending: 'warning',
  Completed: 'success',
  'In Transit': 'info',
  Cancelled: 'error'
};

const statusIcons = {
  Pending: <PendingActions />,
  Completed: <CheckCircle />,
  'In Transit': <LocalShipping />,
  Cancelled: <Cancel />
};

export default function Bookings() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sortConfig, setSortConfig] = React.useState({ key: 'id', direction: 'asc' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBookings = sortedBookings.filter(booking => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ bgcolor: '#000', color: '#FFD700', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 0 8px rgba(255, 215, 0, 0.3)' }}>
          Bookings Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#FFD700', color: '#000', textTransform: 'none', '&:hover': { bgcolor: '#e6c200' } }}>
            New Booking
          </Button>

          <Tooltip title="Refresh">
            <IconButton sx={{ color: '#FFD700' }}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button variant="outlined" onClick={handleClick} sx={{ borderColor: '#FFD700', color: '#FFD700', textTransform: 'none', '&:hover': { borderColor: '#e6c200' } }} startIcon={<FilterList />}>
            Filter
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#1a1a1a', color: '#FFD700' } }}>
            <MenuItem disabled>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#FFD700' }} />
            {['All', 'Pending', 'In Transit', 'Completed', 'Cancelled'].map(status => (
              <MenuItem key={status} onClick={() => { setFilterStatus(status); handleClose(); }}>
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Search bookings..."
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#FFD700' }} />
            </InputAdornment>
          ),
          sx: { color: '#FFD700', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' } }
        }}
        sx={{ mb: 3, minWidth: 250, '& .MuiInputBase-input': { color: '#FFD700' } }}
      />

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', border: '1px solid #FFD700' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Booking ID', 'Customer', 'Date', 'Vehicle', 'Amount', 'Status', 'Actions'].map((header, index) => (
                <TableCell key={header} onClick={() => handleSort(['id', 'customer', 'date', 'vehicle', 'amount', 'status', 'actions'][index])} sx={{ color: '#FFD700', fontWeight: 'bold', cursor: 'pointer' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell sx={{ color: '#FFD700' }}>#{booking.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#FFD700', color: '#000' }}>{booking.customer.charAt(0)}</Avatar>
                    {booking.customer}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#aaa' }}>{booking.date}</TableCell>
                <TableCell sx={{ color: '#aaa' }}>{booking.vehicle}</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>{booking.amount}</TableCell>
                <TableCell>
                  <Chip icon={statusIcons[booking.status]} label={booking.status} color={statusColors[booking.status]} variant="outlined" sx={{ borderColor: '#FFD700', color: '#FFD700' }} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {booking.status === 'Pending' && (
                      <>
                        <Button variant="contained" size="small" startIcon={<CheckCircle />} sx={{ bgcolor: '#FFD700', color: '#000', textTransform: 'none' }}>
                          Approve
                        </Button>
                        <Button variant="outlined" color="error" size="small" startIcon={<Cancel />} sx={{ textTransform: 'none' }}>
                          Reject
                        </Button>
                      </>
                    )}
                    {booking.status === 'In Transit' && (
                      <Button variant="contained" color="success" size="small" startIcon={<CheckCircle />} sx={{ textTransform: 'none' }}>
                        Mark Complete
                      </Button>
                    )}
                    <IconButton size="small">
                      <MoreVert sx={{ color: '#FFD700' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
