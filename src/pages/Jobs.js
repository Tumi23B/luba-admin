import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Button, Box, Chip, TextField, InputAdornment, Avatar,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Tooltip
} from '@mui/material';
import {
  Search, CheckCircle, People as PeopleIcon,
  Email, Phone, Person, DirectionsCar as DirectionsCarIcon,
  RadioButtonChecked, Warning, Timer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

export default function ActiveDrivers() {
  const navigate = useNavigate();

  // State management
  const [drivers, setDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [driverStatus, setDriverStatus] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  // Fetch active drivers data from Firebase
  useEffect(() => {
    // First fetch all approved drivers with their details
    const driversRef = ref(db, 'drivers');
    const unsubscribeDrivers = onValue(driversRef, (snapshot) => {
      const driversData = [];
      snapshot.forEach((childSnapshot) => {
        const driverId = childSnapshot.key;
        const driver = childSnapshot.val();
        
        if (driver.status === 'Approved') {
          driversData.push({
            id: driverId,
            name: driver.fullName || 'N/A',
            email: driver.email || 'N/A',
            phone: driver.phoneNumber || 'N/A',
            status: driver.status || 'Approved',
            idNumber: driver.idNumber || 'N/A',
            address: driver.address || 'N/A',
            vehicle: driver.vehicleType || 'N/A',
            registration: driver.registration || 'N/A',
            helperCount: driver.helperCount || 0,
            profileImage: driver.profileImage || null,
            joinDate: driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'N/A',
            images: driver.images || {}
          });
        }
      });
      setDrivers(driversData);
    });

    // Then fetch active status from driverStatus
    const activeDriversRef = ref(db, 'driverStatus');
    const unsubscribeStatus = onValue(activeDriversRef, (snapshot) => {
      const statusData = {};
      const activeDriversData = [];
      
      snapshot.forEach((childSnapshot) => {
        const driverId = childSnapshot.key;
        const status = childSnapshot.val();
        statusData[driverId] = status;
        
        // Check if driver has been online for more than 20 hours
        if (status.isOnline) {
          const now = new Date().getTime();
          const lastStatusChange = status.lastStatusChange || now;
          const hoursOnline = (now - lastStatusChange) / (1000 * 60 * 60);
          
          if (hoursOnline > 20) {
            // Force driver offline
            update(ref(db, `driverStatus/${driverId}`), {
              isOnline: false,
              lastStatusChange: now,
              forcedOffline: true,
              forcedOfflineReason: 'Exceeded 20 hours of continuous driving'
            });
          } else {
            activeDriversData.push(driverId);
          }
        }
      });
      
      setDriverStatus(statusData);
      setActiveDrivers(activeDriversData);
    });

    // Cleanup function
    return () => {
      unsubscribeDrivers();
      unsubscribeStatus();
    };
  }, []);

  // Calculate hours online for a driver
  const getHoursOnline = (driverId) => {
    const status = driverStatus[driverId];
    if (!status || !status.isOnline) return 0;
    
    const now = new Date().getTime();
    const lastStatusChange = status.lastStatusChange || now;
    return (now - lastStatusChange) / (1000 * 60 * 60);
  };

  // Filter drivers to only those who are active (approved and online)
  const filteredActiveDrivers = useMemo(() => {
    return drivers
      .filter(driver => activeDrivers.includes(driver.id))
      .map(driver => ({
        ...driver,
        hoursOnline: getHoursOnline(driver.id),
        approachingLimit: getHoursOnline(driver.id) > 18
      }));
  }, [drivers, activeDrivers, driverStatus]);

  // Sorting handler
  const handleRequestSort = (property) => {
    const isAsc = sortConfig.key === property && sortConfig.direction === 'ascending';
    setSortConfig({ 
      key: property, 
      direction: isAsc ? 'descending' : 'ascending' 
    });
  };

  // Memoized sorted and searched drivers
  const sortedDrivers = useMemo(() => {
    return [...filteredActiveDrivers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredActiveDrivers, sortConfig]);

  const searchedDrivers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return sortedDrivers.filter(driver => {
      return (
        driver.name.toLowerCase().includes(searchLower) ||
        driver.email.toLowerCase().includes(searchLower) ||
        driver.phone.toLowerCase().includes(searchLower) ||
        driver.vehicle.toLowerCase().includes(searchLower) ||
        driver.registration.toLowerCase().includes(searchLower)
      );
    });
  }, [sortedDrivers, searchTerm]);

  // Dialog handlers
  const handleOpenDialog = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Force a driver offline manually
  const handleForceOffline = (driverId) => {
    update(ref(db, `driverStatus/${driverId}`), {
      isOnline: false,
      lastStatusChange: new Date().getTime(),
      forcedOffline: true,
      forcedOfflineReason: 'Manually taken offline by admin'
    });
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fefefefe', minHeight: '100vh', color: '#c5a34f' }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#b00000' }}>
        Currently Active Drivers
      </Typography>

      {/* Search Controls */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Active Drivers"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', sm: '48%', md: '30%' },
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
                { key: 'name', label: 'Driver' },
                { key: 'vehicle', label: 'Vehicle' },
                { key: 'helperCount', label: 'Helpers' },
                { key: 'hoursOnline', label: 'Driving Time' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions' }
              ].map((headCell) => (
                <TableCell
                  key={headCell.key}
                  sx={{ color: '#c5a34f', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => headCell.key !== 'actions' && handleRequestSort(headCell.key)}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {searchedDrivers.length > 0 ? (
              searchedDrivers.map((driver) => (
                <TableRow key={driver.id} hover sx={{ 
                  bgcolor: driver.approachingLimit ? 'rgba(255, 165, 0, 0.1)' : 'inherit'
                }}>
                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      {driver.profileImage ? (
                        <Avatar 
                          src={driver.profileImage} 
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar sx={{ mr: 2, width: 40, height: 40 }}>
                          <Person />
                        </Avatar>
                      )}
                      <Box>
                        <Typography fontWeight="bold">{driver.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {driver.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon sx={{ mr: 1, color: '#c5a34f' }} />
                      {driver.vehicle} ({driver.registration})
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <PeopleIcon sx={{ mr: 1, color: '#c5a34f' }} />
                      {driver.helperCount} {driver.helperCount === 1 ? 'Helper' : 'Helpers'}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#b00000' }}>
                    <Box display="flex" alignItems="center">
                      <Timer sx={{ mr: 1, color: driver.approachingLimit ? 'orange' : '#c5a34f' }} />
                      {driver.hoursOnline.toFixed(1)} hours
                      {driver.approachingLimit && (
                        <Tooltip title="Approaching 20-hour driving limit">
                          <Warning color="warning" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label="Active"
                      size="small"
                      icon={<RadioButtonChecked fontSize="small" />}
                      color={driver.approachingLimit ? 'warning' : 'success'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#c5a34f', 
                          color: '#c5a34f',
                          '&:hover': { borderColor: '#b00000', color: '#b00000' }
                        }}
                        onClick={() => handleOpenDialog(driver)}
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleForceOffline(driver.id)}
                      >
                        Force Offline
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#AAAAAA' }}>
                  No active drivers found.
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
                {selectedDriver.profileImage && (
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Profile Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <Avatar 
                        src={selectedDriver.profileImage} 
                        sx={{ width: 150, height: 150 }}
                      />
                    </Paper>
                  </Grid>
                )}
                
                {selectedDriver.images?.license && (
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      License Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.license}
                        alt="License"
                        style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
                
                {selectedDriver.images?.car && (
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#c5a34f' }}>
                      Vehicle Photo:
                    </Typography>
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={selectedDriver.images.car}
                        alt="Vehicle"
                        style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#b00000' }}>
                Driver Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Full Name:</strong> {selectedDriver.name}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Email:</strong> {selectedDriver.email}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Phone:</strong> {selectedDriver.phone}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Vehicle:</strong> {selectedDriver.vehicle} ({selectedDriver.registration})
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <PeopleIcon sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Helpers:</strong> {selectedDriver.helperCount} {selectedDriver.helperCount === 1 ? 'Helper' : 'Helpers'}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <Box display="flex" alignItems="center">
                      <Timer sx={{ mr: 1, color: '#c5a34f' }} />
                      <strong>Driving Time:</strong> {selectedDriver.hoursOnline?.toFixed(1) || '0'} hours
                      {selectedDriver.approachingLimit && (
                        <Tooltip title="Approaching 20-hour driving limit">
                          <Warning color="warning" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCloseDialog}
                sx={{ color: '#b00000', borderColor: '#b00000' }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => {
                  handleForceOffline(selectedDriver.id);
                  handleCloseDialog();
                }}
              >
                Force Offline
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}