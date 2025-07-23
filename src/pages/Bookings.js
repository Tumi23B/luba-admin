import React, { useState, useEffect } from 'react';
import { 
  Typography, Table, TableHead, TableBody, TableRow, TableCell, 
  TableContainer, Paper, Button, Box, Chip, Avatar, TextField, 
  InputAdornment, IconButton, Tooltip, Menu, MenuItem, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  CircularProgress
} from '@mui/material';
import { 
  Search, FilterList, MoreVert, CheckCircle, PendingActions, 
  LocalShipping, Cancel, Refresh, Add, ArrowDownward, ArrowUpward,
  Person, Email, Phone, LocationOn, DirectionsCar, Payment
} from '@mui/icons-material';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

// Status configurations
const statusColors = {
  Pending: 'warning',
  'In Progress': 'info',
  Completed: 'success',
  Cancelled: 'error'
};

const statusIcons = {
  Pending: <PendingActions />,
  'In Progress': <LocalShipping />,
  Completed: <CheckCircle />,
  Cancelled: <Cancel />
};

export default function Bookings() {
  // State management
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from Firebase
  useEffect(() => {
    const bookingsRef = ref(db, 'trips');
    setIsLoading(true);
    
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        bookingsData.push({
          id: childSnapshot.key,
          customer: booking.passengerName || 'Not specified',
          driver: booking.driverName || 'Not assigned',
          pickup: booking.pickupLocation || 'Location not set',
          destination: booking.destination || 'Destination not set',
          date: booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'Date not available',
          vehicle: booking.vehicleType || 'Any',
          amount: booking.fare ? `R${parseFloat(booking.fare).toFixed(2)}` : 'Not specified',
          status: booking.status || 'Pending',
          phone: booking.passengerPhone || 'Not provided',
          email: booking.passengerEmail || 'Not provided',
          paymentMethod: booking.paymentMethod || 'Not specified',
          notes: booking.notes || 'No additional notes'
        });
      });
      setBookings(bookingsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedBooking) return;
    setLoading(true);
    try {
      await update(ref(db, `trips/${selectedBooking.id}`), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // The onValue listener will automatically refresh the data
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Sorting and filtering
  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBookings = sortedBookings.filter(booking => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#fefefefe'
      }}>
        <CircularProgress sx={{ color: '#c5a34f' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fefefefe', color: '#c5a34f', minHeight: '100vh', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 0 8px rgba(255, 215, 0, 0.3)' }}>
          Bookings Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton sx={{ color: '#b80000' }} onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button 
            variant="outlined" 
            onClick={handleClick} 
            sx={{ 
              borderColor: '#c5a34f', 
              color: '#000', 
              textTransform: 'none', 
              '&:hover': { borderColor: '#e6c200' } 
            }} 
            startIcon={<FilterList />}
          >
            Filter: {filterStatus}
          </Button>

          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleClose} 
            PaperProps={{ sx: { bgcolor: '#fefefefe', color: '#b80000' } }}
          >
            <MenuItem disabled>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#c5a34f' }} />
            {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
              <MenuItem 
                key={status} 
                onClick={() => { setFilterStatus(status); handleClose(); }}
                sx={{ color: filterStatus === status ? '#b80000' : 'inherit' }}
              >
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
          sx: { 
            color: '#c5a34f', 
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c5a34f' } 
          }
        }}
        sx={{ 
          mb: 3, 
          minWidth: 250, 
          '& .MuiInputBase-input': { color: '#c5a34f' } 
        }}
      />

      {/* Bookings Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fefefefe', border: '1px solid #c5a34f' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Booking ID', 'Customer', 'Date', 'Pickup', 'Destination', 'Amount', 'Status', 'Actions'].map((header, index) => (
                <TableCell 
                  key={header} 
                  onClick={() => handleSort(['id', 'customer', 'date', 'pickup', 'destination', 'amount', 'status', 'actions'][index])} 
                  sx={{ 
                    bgcolor: '#c5a34f', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    color: '#000'
                  }}
                >
                  {header}
                  {sortConfig.key === ['id', 'customer', 'date', 'pickup', 'destination', 'amount', 'status', 'actions'][index] && (
                    sortConfig.direction === 'asc' ?
                      <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> :
                      <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ color: '#b80000' }}>#{booking.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#c5a34f', color: '#000' }}>
                        {booking.customer.charAt(0)}
                      </Avatar>
                      {booking.customer}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#928e85' }}>{booking.date}</TableCell>
                  <TableCell sx={{ color: '#928e85' }}>{booking.pickup}</TableCell>
                  <TableCell sx={{ color: '#928e85' }}>{booking.destination}</TableCell>
                  <TableCell sx={{ color: '#c5a34f', fontWeight: 'bold' }}>{booking.amount}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={statusIcons[booking.status]} 
                      label={booking.status} 
                      color={statusColors[booking.status]} 
                      variant="outlined" 
                      sx={{ 
                        borderColor: '#c5a34f', 
                        color: '#c5a34f',
                        minWidth: 120
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewBooking(booking)}
                          sx={{ color: '#c5a34f' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#AAAAAA' }}>
                  {bookings.length === 0 ? 'No bookings found in database' : 'No bookings match your filters'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#b00000', color: '#fefefefe' }}>
          <Box display="flex" alignItems="center">
            <DirectionsCar sx={{ mr: 1 }} /> Booking Details: #{selectedBooking?.id}
          </Box>
        </DialogTitle>
        {selectedBooking && (
          <>
            <DialogContent dividers sx={{ p: 3, bgcolor: '#fefefefe', color: '#b00000' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#b00000' }}>
                Trip Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Passenger:</strong> {selectedBooking.customer}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Phone:</strong> {selectedBooking.phone}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Email:</strong> {selectedBooking.email}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Driver:</strong> {selectedBooking.driver}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Pickup:</strong> {selectedBooking.pickup}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Destination:</strong> {selectedBooking.destination}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <DirectionsCar sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Vehicle Type:</strong> {selectedBooking.vehicle}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Payment sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Payment Method:</strong> {selectedBooking.paymentMethod}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Date Created:</strong> {selectedBooking.date}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Amount:</strong> {selectedBooking.amount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedBooking.status}
                        size="small"
                        sx={{ ml: 1 }}
                        color={statusColors[selectedBooking.status]}
                        icon={statusIcons[selectedBooking.status]}
                      />
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Notes:</strong> {selectedBooking.notes}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              {selectedBooking.status === 'Pending' && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#c5a34f',
                      color: '#000',
                      '&:hover': { bgcolor: '#e6c200' }
                    }}
                    onClick={() => handleStatusChange('In Progress')}
                    disabled={loading}
                    startIcon={<CheckCircle />}
                  >
                    Approve Trip
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange('Cancelled')}
                    disabled={loading}
                    startIcon={<Cancel />}
                  >
                    Reject Trip
                  </Button>
                </>
              )}
              {selectedBooking.status === 'In Progress' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange('Completed')}
                  disabled={loading}
                  startIcon={<CheckCircle />}
                >
                  Mark as Completed
                </Button>
              )}
              <Button 
                variant="outlined" 
                onClick={() => setOpenDialog(false)}
                sx={{ color: '#b00000', borderColor: '#b00000' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}