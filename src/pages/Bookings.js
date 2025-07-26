import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, Table, TableHead, TableBody, TableRow, TableCell, 
  TableContainer, Paper, Button, Box, Chip, TextField, 
  InputAdornment, IconButton, Tooltip, Menu, MenuItem, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { 
  Search, FilterList, MoreVert, CheckCircle, PendingActions, 
  Cancel, Refresh, DirectionsCar, GpsFixed,
  LocationOn, Person, AccessTime, Directions, ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

// Status configurations
const statusColors = {
  pending: 'warning',
  accepted: 'primary',
  'on_the_way': 'secondary',
  arrived: 'info',
  completed: 'success',
  cancelled: 'error'
};

const statusIcons = {
  pending: <PendingActions />,
  accepted: <CheckCircle color="primary" />,
  on_the_way: <DirectionsCar />,
  arrived: <LocationOn />,
  completed: <CheckCircle />,
  cancelled: <Cancel />
};

// Dark red color
const darkRed = '#8B0000';

export default function Rides() {
  // State management
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch rides from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const ridesRef = ref(db, 'rides');
        
        const unsubscribe = onValue(ridesRef, (snapshot) => {
          const ridesData = [];
          
          snapshot.forEach((childSnapshot) => {
            const ride = childSnapshot.val();
            
            if (ride) {
              ridesData.push({
                id: childSnapshot.key,
                customerId: ride.customerId || 'Not specified',
                dropoff: ride.dropoff || 'Not specified',
                pickup: ride.pickup || 'Not specified',
                pickupCoords: ride.pickupCoords || null,
                status: ride.status || 'pending',
                timestamp: ride.timestamp ? new Date(ride.timestamp).toLocaleString() : 'Date not available',
                dropoffCoords: ride.dropoffCoords || null
              });
            }
          });

          setRides(ridesData);
          setIsLoading(false);
        }, (error) => {
          console.error("Error fetching rides:", error);
          setError("Failed to load rides. Please refresh.");
          setSnackbarOpen(true);
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize. Please refresh.");
        setSnackbarOpen(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Track ride on Google Maps
  const trackRide = (ride) => {
    if (ride.pickupCoords && ride.dropoffCoords) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${ride.pickupCoords.latitude},${ride.pickupCoords.longitude}&destination=${ride.dropoffCoords.latitude},${ride.dropoffCoords.longitude}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
    } else {
      setError("Location coordinates not available for tracking");
      setSnackbarOpen(true);
    }
  };

  // Menu handlers
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  // Sorting handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // View ride details
  const handleViewRide = (ride) => {
    setSelectedRide(ride);
    setOpenDialog(true);
  };

  // Update ride status
  const handleStatusChange = async (newStatus) => {
    if (!selectedRide) return;
    
    setLoading(true);
    try {
      await update(ref(db, `rides/${selectedRide.id}`), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === selectedRide.id 
            ? { ...ride, status: newStatus } 
            : ride
        )
      );
      
      setOpenDialog(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setRides([]);
  };

  // Apply sorting to rides
  const sortedRides = useMemo(() => {
    const sortableRides = [...rides];
    return sortableRides.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rides, sortConfig]);

  // Apply filters
  const filteredRides = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return sortedRides.filter(ride => {
      const id = ride.id || '';
      const pickup = ride.pickup || '';
      const dropoff = ride.dropoff || '';
      const status = ride.status || '';
      
      const matchesSearch = 
        id.toLowerCase().includes(searchTermLower) ||
        pickup.toLowerCase().includes(searchTermLower) ||
        dropoff.toLowerCase().includes(searchTermLower);
      
      const matchesStatus = filterStatus === 'All' || status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [sortedRides, searchTerm, filterStatus]);

  // Loading state UI
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
      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Operation successful'}
        </Alert>
      </Snackbar>

      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkRed }}>
          Bookings Management
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton sx={{ color: darkRed }} onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Status filter dropdown 
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
*/}
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleClose} 
            PaperProps={{ sx: { bgcolor: '#fefefefe', color: darkRed } }}
          >
            <MenuItem disabled>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#c5a34f' }} />
            {['All', 'pending', 'accepted', 'on_the_way', 'arrived', 'completed', 'cancelled'].map(status => (
              <MenuItem 
                key={status} 
                onClick={() => { 
                  setFilterStatus(status); 
                  handleClose(); 
                }}
                sx={{ color: filterStatus === status ? darkRed : 'inherit' }}
              >
                {status.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Search input */}
      <TextField
        variant="outlined"
        placeholder="Search rides..."
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

      {/* Rides Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fefefefe', border: '1px solid #c5a34f' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Ride ID', 'Customer ID', 'Pickup', 'Dropoff', 'Status', 'Actions'].map((header, index) => (
                <TableCell 
                  key={header} 
                  onClick={() => handleSort(['id', 'customerId', 'pickup', 'dropoff', 'status', 'actions'][index])} 
                  sx={{ 
                    bgcolor: '#000000', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    color: '#c5a34f'
                  }}
                >
                  {header}
                  {sortConfig.key === ['id', 'customerId', 'pickup', 'dropoff', 'status', 'actions'][index] && (
                    sortConfig.direction === 'asc' ?
                      <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> :
                      <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={{ color: darkRed }}>#{ride.id.slice(0, 8)}...</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{ride.customerId}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{ride.pickup}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{ride.dropoff}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={statusIcons[ride.status]} 
                      label={ride.status.replace(/_/g, ' ')} 
                      color={statusColors[ride.status]} 
                      variant="outlined" 
                      sx={{ 
                        borderColor: '#c5a34f', 
                        color: '#b00000',
                        minWidth: 120
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewRide(ride)}
                          sx={{ color: '#c5a34f' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Track Ride">
                        <IconButton 
                          size="small" 
                          onClick={() => trackRide(ride)}
                          sx={{ color: '#1976d2' }}
                          disabled={!ride.pickupCoords || !ride.dropoffCoords}
                        >
                          <GpsFixed />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#AAAAAA' }}>
                  {rides.length === 0 ? 'No rides found' : 'No rides match your filters'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ride Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#fefefefe' } }}
      >
        <DialogTitle sx={{ bgcolor: darkRed, color: '#fefefefe' }}>
          <Box display="flex" alignItems="center">
            <DirectionsCar sx={{ mr: 1 }} /> Ride Details: #{selectedRide?.id}
          </Box>
        </DialogTitle>
        {selectedRide && (
          <>
            <DialogContent dividers sx={{ p: 3, bgcolor: '#fefefefe', color: darkRed }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: darkRed }}>
                Ride Information
              </Typography>
              
              {/* Google Maps Navigation */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Directions />}
                  onClick={() => trackRide(selectedRide)}
                  sx={{ 
                    bgcolor: '#1976d2', 
                    color: '#fff',
                    '&:hover': { bgcolor: '#1565c0' }
                  }}
                  disabled={!selectedRide.pickupCoords || !selectedRide.dropoffCoords}
                >
                  Track Ride on Google Maps
                </Button>
                {selectedRide.pickupCoords && selectedRide.dropoffCoords && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                    Coordinates: From ({selectedRide.pickupCoords.latitude}, {selectedRide.pickupCoords.longitude}) 
                    to ({selectedRide.dropoffCoords.latitude}, {selectedRide.dropoffCoords.longitude})
                  </Typography>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* Customer Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: darkRed }}>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} /> Customer Details
                  </Typography>
                  <Typography>
                    <strong>Customer ID:</strong> {selectedRide.customerId}
                  </Typography>
                </Grid>

                {/* Ride Locations */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: darkRed }}>
                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} /> Locations
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Pickup:</strong> {selectedRide.pickup}
                  </Typography>
                  {selectedRide.pickupCoords && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Coordinates: {selectedRide.pickupCoords.latitude}, {selectedRide.pickupCoords.longitude}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Dropoff:</strong> {selectedRide.dropoff}
                  </Typography>
                  {selectedRide.dropoffCoords && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Coordinates: {selectedRide.dropoffCoords.latitude}, {selectedRide.dropoffCoords.longitude}
                    </Typography>
                  )}
                </Grid>

                {/* Timing Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: darkRed }}>
                    <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} /> Timing
                  </Typography>
                  <Typography>
                    <strong>Timestamp:</strong> {selectedRide.timestamp}
                  </Typography>
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: darkRed }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedRide.status.replace(/_/g, ' ')}
                    size="medium"
                    color={statusColors[selectedRide.status]}
                    icon={statusIcons[selectedRide.status]}
                    sx={{ 
                      borderColor: '#c5a34f',
                      color: '#c5a34f'
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            {/* Dialog action buttons */}
            <DialogActions sx={{ p: 2 }}>
              {selectedRide.status === 'pending' && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#c5a34f',
                      color: '#000',
                      '&:hover': { bgcolor: '#e6c200' }
                    }}
                    onClick={() => handleStatusChange('accepted')}
                    disabled={loading}
                    startIcon={<CheckCircle />}
                  >
                    Accept Ride
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={loading}
                    startIcon={<Cancel />}
                  >
                    Reject Ride
                  </Button>
                </>
              )}

              {selectedRide.status === 'accepted' && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#c5a34f',
                      color: '#000',
                      '&:hover': { bgcolor: '#e6c200' }
                    }}
                    onClick={() => handleStatusChange('on_the_way')}
                    disabled={loading}
                    startIcon={<DirectionsCar />}
                  >
                    Start Ride
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={loading}
                    startIcon={<Cancel />}
                  >
                    Cancel Ride
                  </Button>
                </>
              )}
              
              {selectedRide.status === 'on_the_way' && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleStatusChange('arrived')}
                  disabled={loading}
                  startIcon={<LocationOn />}
                >
                  Mark as Arrived
                </Button>
              )}
              
              {selectedRide.status === 'arrived' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                  startIcon={<CheckCircle />}
                >
                  Complete Ride
                </Button>
              )}
              
              <Button 
                variant="outlined" 
                onClick={() => setOpenDialog(false)}
                sx={{ color: darkRed, borderColor: darkRed }}
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