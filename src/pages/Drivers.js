import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Box, Chip, Avatar, TextField, InputAdornment, IconButton, Tooltip, Menu, MenuItem, Divider, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { Search, FilterList, CheckCircle, PendingActions, Cancel, Refresh, Add, ArrowDownward, ArrowUpward, Email, Phone, Person, Description, Warning, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';

import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { db } from '../firebase'; // Import Firebase Realtime Database instance
import { ref, onValue, update, remove } from 'firebase/database'; // Import database functions (update and remove added)

export default function Drivers() {
  const { driverId } = useParams(); // Get driverId from URL parameters
  const navigate = useNavigate(); // Initialize navigate hook

  const [drivers, setDrivers] = useState([]); // State for all drivers (might fetch all or filter)
  const [selectedDriver, setSelectedDriver] = useState(null); // State for the driver being reviewed
  const [openDialog, setOpenDialog] = useState(false); // Dialog open/close state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [filterStatus, setFilterStatus] = useState('All'); // Filter status state
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for filter menu
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' }); // Sorting configuration

  useEffect(() => {
    // If a driverId is present in the URL, fetch that specific driver's details
    if (driverId) {
      const driverApplicationRef = ref(db, `driverApplications/${driverId}`);
      onValue(driverApplicationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSelectedDriver({
            id: driverId, // Use the UID as the ID
            name: data.fullName,
            email: 'N/A', // Email might not be stored in driverApplications
            phone: 'N/A', // Phone might not be stored in driverApplications
            status: data.status,
            documents: 'View Photos', // Indicates that images are available
            vehicle: data.vehicleType,
            registration: 'N/A', // Registration might not be stored here
            rating: 'N/A', // Rating not applicable for pending
            joinDate: new Date(data.createdAt).toLocaleDateString(),
            address: data.address,
            idNumber: data.idNumber,
            images: data.images // Pass images for display
          });
          setOpenDialog(true); // Open the dialog automatically if a driver ID is present
        } else {
          console.warn(`Driver with ID ${driverId} not found in driverApplications.`);
          setSelectedDriver(null);
          setOpenDialog(false); // Close dialog if driver not found
          // Optionally, navigate back to the drivers list or show an error
          // navigate('/drivers'); 
        }
      }, (error) => {
        console.error("Error fetching specific driver:", error);
        setSelectedDriver(null);
        setOpenDialog(false);
      });
    }

    // Fetch all drivers for the table (you might want to fetch based on status or paginate later)
    const allDriversRef = ref(db, 'drivers'); // Assuming 'drivers' node has general driver info
    onValue(allDriversRef, (snapshot) => {
      const allDriversData = [];
      snapshot.forEach((childSnapshot) => {
        const driver = childSnapshot.val();
        allDriversData.push({
          id: childSnapshot.key,
          name: driver.fullName || 'N/A',
          email: driver.email || 'N/A', // Assuming email might be here or fetched separately
          phone: driver.phone || 'N/A', // Assuming phone might be here or fetched separately
          status: driver.status || 'Unknown',
          documents: driver.profileImage ? 'Verified' : 'Pending', // Simple check if profile image exists
          vehicle: driver.vehicleType || 'N/A',
          registration: driver.registration || 'N/A',
          rating: driver.rating || 0,
          joinDate: driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A',
          uid: childSnapshot.key // Store UID for consistency
        });
      });
      setDrivers(allDriversData);
    }, (error) => {
      console.error("Error fetching all drivers:", error);
    });

  }, [driverId]); // Rerun useEffect if driverId changes

  // Function to handle opening the dialog with driver details
  const handleOpenDialog = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDriver(null);
    // If we navigated here via URL, going back to /drivers after closing the dialog
    if (driverId) {
      navigate('/dashboard'); // Or '/drivers' if you have a general drivers list
    }
  };

  // Function to handle approving a driver
  const handleApprove = async () => {
    if (!selectedDriver || selectedDriver.status !== 'Pending') return;

    try {
      // Update status in driverApplications
      await update(ref(db, `driverApplications/${selectedDriver.id}`), {
        status: 'Approved'
      });

      // Update status in drivers (main driver profile)
      await update(ref(db, `drivers/${selectedDriver.id}`), {
        status: 'Approved', // Set status to Approved
        rating: 5, // Optionally set a default rating for new approved drivers
        tripsCompleted: 0 // Reset or ensure trips are 0 for new approved drivers
      });

      alert(`Driver ${selectedDriver.name} approved successfully!`);
      handleCloseDialog();
    } catch (error) {
      console.error("Error approving driver:", error);
      alert("Failed to approve driver. Please try again.");
    }
  };

  // Function to handle rejecting a driver
  const handleReject = async () => {
    if (!selectedDriver || selectedDriver.status !== 'Pending') return;

    try {
      // Update status in driverApplications
      await update(ref(db, `driverApplications/${selectedDriver.id}`), {
        status: 'Rejected'
      });

      // Optionally, you might want to remove the driver from the 'drivers' node
      // or set their status to 'Rejected' there as well.
      // For now, let's just update the status in 'drivers'
      await update(ref(db, `drivers/${selectedDriver.id}`), {
        status: 'Rejected'
      });

      alert(`Driver ${selectedDriver.name} rejected.`);
      handleCloseDialog();
    } catch (error) {
      console.error("Error rejecting driver:", error);
      alert("Failed to reject driver. Please try again.");
    }
  };

  // Filter and sort logic for the table (existing logic)
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status) => {
    setAnchorEl(null);
    if (status) {
      setFilterStatus(status);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = sortConfig.key === property && sortConfig.direction === 'ascending';
    setSortConfig({ key: property, direction: isAsc ? 'descending' : 'ascending' });
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredDrivers = sortedDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3, bgcolor: '#fefefefe', minHeight: '100vh', color: '#c5a34f' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#b00000' }}>
        Driver Management
      </Typography>

      {/* Control Bar (Search, Filter, Add Driver) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap' }}>
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
            <MenuItem onClick={() => handleFilterClose('Active')}>Active</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Inactive')}>Inactive</MenuItem>
          </Menu>

          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#c5a34f', color: '#000',
              '&:hover': { bgcolor: '#b00000' }
            }}
            // You might want to add a function to open an "Add Driver" form
          >
            Add Driver
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
              {[
                { key: 'name', label: 'Driver Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'status', label: 'Status' },
                { key: 'documents', label: 'Documents' },
                { key: 'vehicle', label: 'Vehicle' },
                { key: 'rating', label: 'Rating' },
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
                    sortConfig.direction === 'ascending' ? <ArrowUpward sx={{ ml: 0.5, fontSize: 16 }} /> : <ArrowDownward sx={{ ml: 0.5, fontSize: 16 }} />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell sx={{ color: '#b00000' }}>{driver.name}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.email}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.phone}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>
                    <Chip
                      label={driver.status}
                      size="small"
                      icon={
                        driver.status === 'Approved' ? <CheckCircle /> :
                        driver.status === 'Pending' ? <PendingActions /> :
                        driver.status === 'Rejected' ? <Cancel /> :
                        null
                      }
                      color={
                        driver.status === 'Approved' ? 'success' :
                        driver.status === 'Pending' ? 'warning' :
                        driver.status === 'Rejected' ? 'error' :
                        'default'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.documents}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.vehicle}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.rating}</TableCell>
                  <TableCell sx={{ color: '#b00000' }}>{driver.joinDate}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 1, borderColor: '#c5a34f', color: '#c5a34f',
                        '&:hover': { borderColor: '#b00000', color: '#b00000' }
                      }}
                      onClick={() => handleOpenDialog(driver)} // Open dialog with driver details
                    >
                      View
                    </Button>
                    {driver.status === 'Pending' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mr: 1, bgcolor: 'success.main', color: '#fff',
                            '&:hover': { bgcolor: 'success.dark' }
                          }}
                          onClick={() => handleApprove(driver)} // Call approve function directly from table
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
                          onClick={() => handleReject(driver)} // Call reject function directly from table
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
              <Grid container spacing={3}>
                {/* Driver Profile Photo */}
                {selectedDriver.images?.driver && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Driver Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img src={selectedDriver.images.driver} alt="Driver" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                    </Paper>
                  </Grid>
                )}
                {/* Driver License Photo */}
                {selectedDriver.images?.license && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Driver License Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img src={selectedDriver.images.license} alt="License" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                    </Paper>
                  </Grid>
                )}
                {/* Vehicle Photo */}
                {selectedDriver.images?.car && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Vehicle Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img src={selectedDriver.images.car} alt="Car" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                    </Paper>
                  </Grid>
                )}
                {/* ID Photo */}
                {selectedDriver.images?.id && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      ID Document Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img src={selectedDriver.images.id} alt="ID" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                    </Paper>
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ my: 3, bgcolor: '#c5a34f' }} />
              <Typography variant="h6" sx={{ mb: 2, color: '#b00000' }}>Application Details</Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <Email sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                Email: <Typography component="span" sx={{ fontWeight: 'bold' }}>{selectedDriver.email}</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <Phone sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                Phone: <Typography component="span" sx={{ fontWeight: 'bold' }}>{selectedDriver.phone}</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <Person sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                ID Number: <Typography component="span" sx={{ fontWeight: 'bold' }}>{selectedDriver.idNumber}</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <Description sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                Address: <Typography component="span" sx={{ fontWeight: 'bold' }}>{selectedDriver.address}</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <DirectionsCarIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                Vehicle Type: <Typography component="span" sx={{ fontWeight: 'bold' }}>{selectedDriver.vehicle}</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#b00000' }}>
                <CheckCircle sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                Current Status:{' '}
                <Chip
                  label={selectedDriver.status}
                  size="small"
                  icon={
                    selectedDriver.status === 'Approved' ? <CheckCircle /> :
                    selectedDriver.status === 'Pending' ? <PendingActions /> :
                    selectedDriver.status === 'Rejected' ? <Cancel /> :
                    null
                  }
                  color={
                    selectedDriver.status === 'Approved' ? 'success' :
                    selectedDriver.status === 'Pending' ? 'warning' :
                    selectedDriver.status === 'Rejected' ? 'error' :
                    'default'
                  }
                  sx={{ fontWeight: 'bold', ml: 1 }}
                />
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ color: '#b00000' }}>
                  <Badge
                    color={selectedDriver.documents === 'Verified' ? 'success' : 'warning'}
                    variant="dot"
                    sx={{ mr: 1 }}
                  >
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                      {selectedDriver.documents}
                    </Typography>
                  </Badge>
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              {/* Close Dialog Button */}
              <Button
                onClick={handleCloseDialog}
                sx={{
                  borderColor: '#c5a34f',
                  color: '#c5a34f',
                  '&:hover': {
                    bgcolor: '#c5a34f',
                    color: '#000'
                  }
                }}
                variant="outlined"
              >
                Close
              </Button>
              {/* Approve Driver Button (conditionally rendered) */}
              {selectedDriver.status === 'Pending' && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'success.main',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                      ml: 1 // Add margin to separate from Close button
                    }}
                    startIcon={<CheckCircle />}
                    onClick={handleApprove} // Call approve function
                  >
                    Approve Driver
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'error.main',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: 'error.dark',
                      },
                      ml: 1 // Add margin to separate from Approve button
                    }}
                    startIcon={<Cancel />}
                    onClick={handleReject} // Call reject function
                  >
                    Reject Driver
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}