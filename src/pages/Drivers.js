import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Button, Box, Chip, TextField, InputAdornment, Menu, MenuItem,
  Divider, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import {
  Search, FilterList, CheckCircle, PendingActions, Cancel,
  Add, ArrowDownward, ArrowUpward, Email, Phone, Person, Description, DirectionsCar as DirectionsCarIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { ref, onValue, update, push } from 'firebase/database';

/**
 * Drivers Component - Main component for managing driver applications and approvals
 * Features:
 * - View all driver applications
 * - Filter and search drivers
 * - Approve/Reject applications
 * - Add new drivers manually
 * - View driver details
 */
export default function Drivers() {
  // Router hooks for navigation and params
  const { driverId } = useParams(); // Get driver ID from URL if present
  const navigate = useNavigate(); // Navigation function
  console.log('Navigating to Dashboard...');


  // State management
  const [drivers, setDrivers] = useState([]); // List of all drivers
  const [selectedDriver, setSelectedDriver] = useState(null); // Currently selected driver
  const [openDialog, setOpenDialog] = useState(false); // Controls detail dialog visibility
  const [openAddDialog, setOpenAddDialog] = useState(false); // Controls add driver dialog visibility
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [filterStatus, setFilterStatus] = useState('All'); // Current status filter
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for filter menu
  const [sortConfig, setSortConfig] = useState({ // Current sort configuration
    key: 'name',
    direction: 'ascending'
  });
  const [loadingAction, setLoadingAction] = useState(false); // Loading state for actions
  const [newDriver, setNewDriver] = useState({ // State for new driver form
    fullName: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    address: '',
    vehicleType: '',
    registration: '',
    status: 'Approved'
  });
  const [showClearDialog, setShowClearDialog] = useState(false);


  // Fetch drivers data from Firebase
  useEffect(() => {
  // If driverId is in URL, fetch that specific driver
  if (driverId) {
    const driverRef = ref(db, `driverApplications/${driverId}`);
    onValue(driverRef, (snapshot) => {
      const data = snapshot.val();
      const userRef = ref(db, `users/${driverId}`);
      onValue(userRef, (userSnap) => {
        const userInfo = userSnap.val() || {};

        if (data) {
          setSelectedDriver({
            id: driverId,
            name: data.fullName || 'N/A',
            email: userInfo.email || data.email || 'N/A',
            phone: userInfo.phoneNumber || data.phoneNumber || 'N/A',
            status: data.status || 'Pending',
            idNumber: data.idNumber || 'N/A',
            address: data.address || 'N/A',
            vehicle: data.vehicleType || 'N/A',
            registration: data.registration || 'N/A',
            joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
            images: data.images || {}
          });
          setOpenDialog(true);
        }
      });
    });
  }

  // Fetch all driver applications
  const driversRef = ref(db, 'driverApplications');
  onValue(driversRef, (snapshot) => {
    const driversData = [];

    snapshot.forEach((childSnapshot) => {
      const driverId = childSnapshot.key;
      const driver = childSnapshot.val();

      const userRef = ref(db, `users/${driverId}`);
      onValue(userRef, (userSnap) => {
        const userInfo = userSnap.val() || {};

        driversData.push({
          id: driverId,
          name: driver.fullName || 'N/A',
          email: userInfo.email || driver.email || 'N/A',
          phone: userInfo.phoneNumber || driver.phoneNumber || 'N/A',
          status: driver.status || 'Pending',
          idNumber: driver.idNumber || 'N/A',
          address: driver.address || 'N/A',
          vehicle: driver.vehicleType || 'N/A',
          registration: driver.registration || 'N/A',
          joinDate: driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A',
          images: driver.images || {}
        });

        // Refresh list after each entry
        setDrivers([...driversData]);
      });
    });
  });
}, [driverId]);

  // Dialog handlers
  const handleOpenDialog = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

 const handleCloseDialog = () => {
  setOpenDialog(false); // Just close the dialog, stay on the same screen
};

  /**
   * Approve a driver application
   * - Updates status in driverApplications
   * - Creates entry in approved drivers collection
   */
  const handleApprove = async () => {
  if (!selectedDriver) return;
  setLoadingAction(true);
  try {
    await update(ref(db, `driverApplications/${selectedDriver.id}`), { status: 'Approved' });
    await update(ref(db, `drivers/${selectedDriver.id}`), {
      fullName: selectedDriver.name,
      email: selectedDriver.email,
      phoneNumber: selectedDriver.phone,
      idNumber: selectedDriver.idNumber,
      address: selectedDriver.address,
      status: 'Approved',
      vehicleType: selectedDriver.vehicle,
      registration: selectedDriver.registration,
      createdAt: new Date().toISOString()
    });

    alert('Application approved!');
    navigate('/dashboard');
  } finally {
    setLoadingAction(false);
  }
};

  /**
   * Reject a driver application
   * - Updates status in driverApplications
   */
  const handleReject = async () => {
  if (!selectedDriver) return;
  setLoadingAction(true);
  try {
    await update(ref(db, `driverApplications/${selectedDriver.id}`), { status: 'Rejected' });

    alert('Application rejected!');
    navigate('/dashboard');
  } finally {
    setLoadingAction(false);
  }
};


  // Search and filter handlers
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = (status) => {
    setAnchorEl(null);
    if (status) setFilterStatus(status); // Update filter if status was selected
  };

  // Sorting handler
  const handleRequestSort = (property) => {
    const isAsc = sortConfig.key === property && sortConfig.direction === 'ascending';
    setSortConfig({ 
      key: property, 
      direction: isAsc ? 'descending' : 'ascending' 
    });
  };

  // Add new driver handlers
  const handleAddDriver = () => {
    setOpenAddDialog(true);
  };

  const handleNewDriverChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all drivers handler
  const handleClearAllDrivers = async () => {
  setLoadingAction(true);
  try {
    await update(ref(db), { driverApplications: null }); // Clear entire node
    setDrivers([]); // Clear UI table
    setShowClearDialog(false);
  } catch (error) {
    console.error('Error clearing driverApplications:', error);
  } finally {
    setLoadingAction(false);
  }
};


  /**
   * Save new driver to database
   * - Validates all required fields
   * - Adds to both driverApplications and drivers collections
   */
  const handleSaveNewDriver = async () => {
    // Validate all fields
    if (!newDriver.fullName || !newDriver.email || !newDriver.phoneNumber || 
        !newDriver.idNumber || !newDriver.address || !newDriver.vehicleType || 
        !newDriver.registration) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoadingAction(true);
      const newDriverRef = ref(db, 'driverApplications');
      const newDriverKey = push(newDriverRef).key;
      
      // Add to applications
      await update(ref(db, `driverApplications/${newDriverKey}`), {
        ...newDriver,
        createdAt: new Date().toISOString()
      });
      
      // Also add to approved drivers
      await update(ref(db, `drivers/${newDriverKey}`), {
        ...newDriver,
        createdAt: new Date().toISOString()
      });
      
      // Reset form and close dialog
      setOpenAddDialog(false);
      setNewDriver({
        fullName: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        address: '',
        vehicleType: '',
        registration: '',
        status: 'Approved'
      });
    } catch (error) {
      console.error('Error adding driver:', error);
    } finally {
      setLoadingAction(false);
    }
  };

  // Memoized sorted and filtered drivers for performance optimization
  const sortedDrivers = useMemo(() => {
    return [...drivers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [drivers, sortConfig]);

  const filteredDrivers = useMemo(() => {
    return sortedDrivers.filter(driver => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        driver.name.toLowerCase().includes(searchLower) ||
        driver.email.toLowerCase().includes(searchLower) ||
        driver.phone.toLowerCase().includes(searchLower) ||
        driver.idNumber.toLowerCase().includes(searchLower) ||
        driver.address.toLowerCase().includes(searchLower);
      
      const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sortedDrivers, searchTerm, filterStatus]);

  return (
    <Box sx={{ p: 3, bgcolor: '#fefefefe', minHeight: '100vh', color: '#c5a34f' }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#b00000' }}>
        Driver Management
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap' }}>
        {/* Search Input */}
        <TextField
          label="Search Drivers"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: { xs: '100%', sm: '48%', md: '30%' },
            mb: { xs: 2, sm: 0 },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#c5a34f' },
              '&:hover fieldset': { borderColor: '#b00000' },
              '&.Mui-focused fieldset': { borderColor: '#c5a34f' },
              color: '#c5a34f'
            },
            '& .MuiInputLabel-root': { color: '#c5a34f' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#b00000' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          {/* Status Filter Dropdown */}
          <Button
            variant="outlined"
            onClick={handleFilterClick}
            startIcon={<FilterList />}
            sx={{
              mr: 2, borderColor: '#c5a34f', color: '#c5a34f',
              '&:hover': { borderColor: '#b00000', color: '#b00000' }
            }}
          >
            Filter: {filterStatus}
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleFilterClose(null)}
          >
            <MenuItem onClick={() => handleFilterClose('All')}>All</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Approved')}>Approved</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Pending')}>Pending</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Rejected')}>Rejected</MenuItem>
          </Menu>

          {/* Add New Driver Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddDriver}
            sx={{
              bgcolor: '#c5a34f', color: '#000',
              '&:hover': { bgcolor: '#b00000' }
            }}
          >
            Add Driver
          </Button>
          <Button
              variant="outlined"
              color="error"
              onClick={() => setShowClearDialog(true)}
              sx={{
                ml: 2,
                borderColor: '#b00000',
                color: '#b00000',
                '&:hover': { bgcolor: '#b00000', color: '#fff' }
              }}
            >
              Clear Table
            </Button>
        </Box>
      </Box>

      {/* Drivers Table */}
      <TableContainer component={Paper} sx={{
        borderRadius: 2, border: '1px solid #c5a34f',
        backgroundColor: '#fefefefe'
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#000000' }}>
              {/* Table Headers with sort indicators */}
              {[
                { key: 'name', label: 'Driver Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'idNumber', label: 'ID Number' },
                { key: 'address', label: 'Address' },
                { key: 'status', label: 'Status' },
                { key: 'vehicle', label: 'Vehicle' },
                { key: 'joinDate', label: 'Join Date' },
                { key: 'actions', label: 'Actions' }
              ].map((headCell) => (
                <TableCell
                  key={headCell.key}
                  sx={{ color: '#c5a34f', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => headCell.key !== 'actions' && handleRequestSort(headCell.key)}
                >
                  {headCell.label}
                  {sortConfig.key === headCell.key ? (
                    sortConfig.direction === 'ascending'
                      ? <ArrowUpward sx={{ ml: 0.5, fontSize: 16 }} />
                      : <ArrowDownward sx={{ ml: 0.5, fontSize: 16 }} />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          {/* Table Body with driver data */}
          <TableBody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id} hover>
                  <TableCell sx={{ color: '#b00000' }}>{driver.name}</TableCell>

                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 1, fontSize: '1rem', color: '#c5a34f' }} />
                      {driver.email !== 'N/A' ? driver.email : <em style={{ color: '#888' }}>Not provided</em>}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, fontSize: '1rem', color: '#c5a34f' }} />
                      {driver.phone !== 'N/A' ? driver.phone : <em style={{ color: '#888' }}>Not provided</em>}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#b00000' }}>{driver.idNumber}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={driver.status}
                      size="small"
                      icon={
                        driver.status === 'Approved' ? <CheckCircle fontSize="small" /> :
                        driver.status === 'Pending' ? <PendingActions fontSize="small" /> :
                        driver.status === 'Rejected' ? <Cancel fontSize="small" /> : null
                      }
                      color={
                        driver.status === 'Approved' ? 'success' :
                        driver.status === 'Pending' ? 'warning' :
                        driver.status === 'Rejected' ? 'error' : 'default'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon sx={{ mr: 1, fontSize: '1rem', color: '#c5a34f' }} />
                      {driver.vehicle}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.joinDate}</TableCell>
                  <TableCell>
                    {/* Action Buttons */}
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 1, borderColor: '#c5a34f', color: '#c5a34f',
                        '&:hover': { borderColor: '#b00000', color: '#b00000' }
                      }}
                      onClick={() => handleOpenDialog(driver)}
                    >
                      View
                    </Button>
                    
                    {/* Show Approve/Reject only for pending applications */}
                    {driver.status === 'Pending' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mr: 1, bgcolor: 'success.main', color: '#fff',
                            '&:hover': { bgcolor: 'success.dark' }
                          }}
                          onClick={() => handleApprove(driver)}
                          disabled={loadingAction}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            bgcolor: 'error.main', color: '#fff',
                            '&:hover': { bgcolor: 'error.dark' }
                          }}
                          onClick={() => handleReject(driver)}
                          disabled={loadingAction}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ color: '#AAAAAA' }}>
                  No drivers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Driver Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#b00000', color: '#fefefefe' }}>
          <Box display="flex" alignItems="center">
            <Person sx={{ mr: 1 }} /> Driver Details: {selectedDriver?.name}
          </Box>
        </DialogTitle>
        
        {selectedDriver && (
          <>
            <DialogContent dividers sx={{ p: 3, bgcolor: '#fefefefe', color: '#b00000' }}>
              {/* Display driver images if available */}
              <Grid container spacing={3}>
                {selectedDriver.images?.driver && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Driver Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.driver}
                        alt="Driver"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
                
                {selectedDriver.images?.license && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      License Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.license}
                        alt="License"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
                
                {selectedDriver.images?.car && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Vehicle Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.car}
                        alt="Vehicle"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
                
                {selectedDriver.images?.id && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      ID Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.id}
                        alt="ID"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Driver Information Section */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#b00000' }}>
                Driver Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Full Name:</strong> {selectedDriver.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Email:</strong> {selectedDriver.email !== 'N/A' ? selectedDriver.email : <em style={{ color: '#888' }}>Not provided</em>}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Phone:</strong> {selectedDriver.phone !== 'N/A' ? selectedDriver.phone : <em style={{ color: '#888' }}>Not provided</em>}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Description sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>ID Number:</strong> {selectedDriver.idNumber}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Address:</strong> {selectedDriver.address}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Vehicle Type:</strong> {selectedDriver.vehicle}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Registration:</strong> {selectedDriver.registration}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Join Date:</strong> {selectedDriver.joinDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedDriver.status}
                        size="small"
                        sx={{ ml: 1 }}
                        color={
                          selectedDriver.status === 'Approved' ? 'success' :
                          selectedDriver.status === 'Pending' ? 'warning' :
                          selectedDriver.status === 'Rejected' ? 'error' : 'default'
                        }
                      />
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            {/* Dialog Action Buttons */}
            <DialogActions sx={{ p: 2 }}>
              {selectedDriver.status === 'Pending' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApprove}
                    disabled={loadingAction}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleReject}
                    disabled={loadingAction}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button variant="outlined" onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add New Driver Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#b00000', color: '#fefefefe' }}>
          <Box display="flex" alignItems="center">
            <Person sx={{ mr: 1 }} /> Add New Driver
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: '#fefefefe' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name *"
                name="fullName"
                value={newDriver.fullName}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={newDriver.email}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phoneNumber"
                value={newDriver.phoneNumber}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Number *"
                name="idNumber"
                value={newDriver.idNumber}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                name="address"
                value={newDriver.address}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Type *"
                name="vehicleType"
                value={newDriver.vehicleType}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration *"
                name="registration"
                value={newDriver.registration}
                onChange={handleNewDriverChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setOpenAddDialog(false)}
            sx={{ color: '#b00000', borderColor: '#b00000' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveNewDriver}
            disabled={loadingAction}
            sx={{ bgcolor: '#c5a34f', color: '#000', '&:hover': { bgcolor: '#b00000' } }}
          >
            {loadingAction ? 'Saving...' : 'Save Driver'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Clear Table Confirmation Dialog */}
        <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
          <DialogTitle sx={{ bgcolor: '#b00000', color: '#fff' }}>
            Confirm Clear Table
          </DialogTitle>
          <DialogContent sx={{ color: '#c5a34f' }}>
            Are you sure you want to permanently delete <strong>all driver applications</strong> from the database?
            This will also clear the entire table view. This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleClearAllDrivers}
              disabled={loadingAction}
            >
              {loadingAction ? 'Clearing...' : 'Confirm Clear'}
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}