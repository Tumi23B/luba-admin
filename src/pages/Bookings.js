import React, { useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Box, Chip, Avatar, TextField, InputAdornment, IconButton, Tooltip, Badge, Menu, MenuItem, Divider } from '@mui/material';
import { Search, FilterList, MoreVert, CheckCircle, PendingActions, LocalShipping, Cancel, Refresh, Add, ArrowDownward, ArrowUpward } from '@mui/icons-material';

// Static Data Section
// This section defines the initial array of booking objects.
const bookings = [
  { id: 501, customer: 'Charlie Brown', status: 'Pending', date: '2023-05-15', vehicle: 'Toyota Hilux', amount: 'R1,250' },
  { id: 502, customer: 'Diana Prince', status: 'Completed', date: '2023-05-14', vehicle: 'Ford Ranger', amount: 'R980' },
  { id: 503, customer: 'Bruce Wayne', status: 'In Transit', date: '2023-05-16', vehicle: 'VW Amarok', amount: 'R1,520' },
  { id: 504, customer: 'Clark Kent', status: 'Cancelled', date: '2023-05-12', vehicle: 'Isuzu D-Max', amount: 'R1,100' },
];

// Constants and Mappings Section
// This section defines color and icon mappings for booking statuses.
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

// This is the main React functional component for the Bookings management page.
export default function Bookings() {

  // This section defines all the state variables used in the component.
  const [anchorEl, setAnchorEl] = useState(null); // State for filter menu anchor
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // State for table sorting
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filterStatus, setFilterStatus] = useState('All'); // State for status filter

  const open = Boolean(anchorEl); // Derived state for filter menu open status

  // Event Handlers Section contains functions that handle user interactions and state updates.
  const handleClick = (event) => setAnchorEl(event.currentTarget); // Handles opening the filter menu.
  // Handles closing the filter menu.
  const handleClose = () => setAnchorEl(null);
  // Handles sorting of the booking table.
  const handleSort = (key) => {
    let direction = 'asc';
    // If the current sort key is the same, toggle direction; otherwise, set to ascending.
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // This section contains logic for sorting and filtering the booking data. Sorts the bookings based on the current sort configuration.
  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filters the sorted bookings based on the search term and status filter.
  const filteredBookings = sortedBookings.filter(booking => {
    // Checks if the booking matches the search term in customer, ID, or vehicle.
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    // Checks if the booking matches the selected status filter.
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    // Returns true if both search and status filters are matched.
    return matchesSearch && matchesStatus;
  });

  // Render Section
  // This section defines the JSX structure of the component.
  return (
    <Box sx={{ bgcolor: '#fefefefe', color: '#c5a34f', minHeight: '100vh', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 0 8px rgba(255, 215, 0, 0.3)' }}>
          Bookings Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* New Booking Button */}
          <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#c5a34f', color: '#000', textTransform: 'none', '&:hover': { bgcolor: '#e6c200' } }}>
            New Booking
          </Button>

          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton sx={{ color: '#b80000' }}>
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Filter Button */}
          <Button variant="outlined" onClick={handleClick} sx={{ borderColor: '#c5a34f', color: '#000', textTransform: 'none', '&:hover': { borderColor: '#e6c200' } }} startIcon={<FilterList />}>
            Filter
          </Button>

          {/* Filter Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#fefefefe', color: '#b80000' } }}>
            <MenuItem disabled>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#c5a34f' }} />
            {['All', 'Pending', 'In Transit', 'Completed', 'Cancelled'].map(status => (
              <MenuItem key={status} onClick={() => { setFilterStatus(status); handleClose(); }}>
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Search Text Field */}
      <TextField
        variant="outlined"
        placeholder="Search bookings..."
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#c5a34f' }} />
            </InputAdornment>
          ),
          sx: { color: '#c5a34f', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c5a34f' } }
        }}
        sx={{ mb: 3, minWidth: 250, '& .MuiInputBase-input': { color: '#c5a34f' } }}
      />

      {/* Bookings Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fefefefe', border: '1px solid #c5a34f' }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Table Headers with Sorting */}
              {['Booking ID', 'Customer', 'Date', 'Vehicle', 'Amount', 'Status', 'Actions'].map((header, index) => (
                <TableCell key={header} onClick={() => handleSort(['id', 'customer', 'date', 'vehicle', 'amount', 'status', 'actions'][index])} sx={{ bgcolor: '#c5a34f', fontWeight: 'bold', cursor: 'pointer' }}>
                  {header}
                  {/* Sort icon based on current sort configuration */}
                  {sortConfig.key === ['id', 'customer', 'date', 'vehicle', 'amount', 'status', 'actions'][index] && (
                    sortConfig.direction === 'asc' ?
                      <ArrowUpward fontSize="small" sx={{ ml: 0.5, color: '#000' }} /> :
                      <ArrowDownward fontSize="small" sx={{ ml: 0.5, color: '#000' }} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell sx={{ color: '#b80000' }}>#{booking.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#c5a34f', color: '#000' }}>{booking.customer.charAt(0)}</Avatar>
                    {booking.customer}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#928e85' }}>{booking.date}</TableCell>
                <TableCell sx={{ color: '#928e85' }}>{booking.vehicle}</TableCell>
                <TableCell sx={{ color: '#c5a34f', fontWeight: 'bold' }}>{booking.amount}</TableCell>
                <TableCell>
                  {/* Status Chip with Icon and Color */}
                  <Chip icon={statusIcons[booking.status]} label={booking.status} color={statusColors[booking.status]} variant="outlined" sx={{ borderColor: '#c5a34f', color: '#c5a34f' }} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Action Buttons based on Booking Status */}
                    {booking.status === 'Pending' && (
                      <>
                        <Button variant="contained" size="small" startIcon={<CheckCircle />} sx={{ bgcolor: '#c5a34f', color: '#000', textTransform: 'none' }}>
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
                      <MoreVert sx={{ color: '#c5a34f' }} />
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