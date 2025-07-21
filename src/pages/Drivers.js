import React, { useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Box, Chip, Avatar, TextField, InputAdornment, IconButton, Tooltip, Menu, MenuItem, Divider, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { Search, FilterList, CheckCircle, PendingActions, Cancel, Refresh, Add, ArrowDownward, ArrowUpward, Email, Phone, Person, Description, Warning, DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';

// Static Data Section
// This section defines the initial array of driver objects.
const drivers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+27 12 345 6789',
    status: 'Pending',
    documents: 'Uploaded',
    vehicle: 'Toyota Hilux',
    registration: 'CA 123-456',
    rating: 4.5,
    joinDate: '2023-05-10'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+27 98 765 4321',
    status: 'Approved',
    documents: 'Verified',
    vehicle: 'Ford Ranger',
    registration: 'GP 987-654',
    rating: 4.8,
    joinDate: '2023-04-15'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+27 11 222 3333',
    status: 'Suspended',
    documents: 'Expired',
    vehicle: 'VW Amarok',
    registration: 'EC 456-789',
    rating: 3.9,
    joinDate: '2023-03-20'
  },
];

// Constants and Mappings Section
// This section defines color and icon mappings for driver statuses.
const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Suspended: 'error',
  Rejected: 'error'
};

const statusIcons = {
  Pending: <PendingActions sx={{ color: '#c5a34f' }} />, // gold color icon
  Approved: <CheckCircle sx={{ color: '#c5a34f' }} />,
  Suspended: <Warning sx={{ color: '#c5a34f' }} />,
  Rejected: <Cancel sx={{ color: '#b80000' }} />
};

// Main Component Section
// This is the main React functional component for the Drivers management page.
export default function Drivers() {
  // State Variables
  const [anchorEl, setAnchorEl] = useState(null); // State for filter menu anchor
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // State for table sorting
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filterStatus, setFilterStatus] = useState('All'); // State for status filter
  const [selectedDriver, setSelectedDriver] = useState(null); // State for selected driver in dialog
  const [openDialog, setOpenDialog] = useState(false); // State for opening/closing driver details dialog

  const open = Boolean(anchorEl); // Derived state for filter menu open status

  // Event Handlers Section
  // Handles opening the filter menu.
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handles closing the filter menu.
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handles sorting of the driver table.
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handles opening the driver details dialog and setting the selected driver.
  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  // Handles closing the driver details dialog.
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Data Processing Section
  // Sorts the drivers based on the current sort configuration.
  const sortedDrivers = [...drivers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filters the sorted drivers based on the search term and status filter.
  const filteredDrivers = sortedDrivers.filter(driver => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Render Section
  // This section defines the JSX structure of the component.
  return (
    <Box sx={{
      bgcolor: '#fefefefe', // black background
      minHeight: '100vh',
      p: 3,
      color: '#c5a34f' // gold text default
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{
          color: '#c5a34f',
          fontWeight: 'bold',
    
        }}>
          Driver Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Add New Driver Button */}
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#c5a34f',
              color: '#000'
            }}
            startIcon={<Add sx={{ color: '#000' }} />}
          >
            Add New Driver
          </Button>

          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton sx={{ color: '#b80000' }}>
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Filter Button */}
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#c5a34f',
              color: '#000',
              '&:hover': {
                bgcolor: '#c5a34f',
                color: '#3f3d37ff'
              }
            }}
            startIcon={<FilterList />}
            onClick={handleClick}
          >
            Filter
          </Button>

          {/* Filter Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: '#fefefefe',
                color: '#c5a34f',
                border: '1px solid',
                borderColor: '#c5a34f'
              }
            }}
          >
            <MenuItem disabled sx={{ color: '#928E85' }}>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#c5a34f' }} />
            {['All', 'Pending', 'Approved', 'Suspended', 'Rejected'].map(status => (
              <MenuItem
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  handleClose();
                }}
                sx={{
                  bgcolor: filterStatus === status ? '#c5a34f' : 'transparent',
                  color: filterStatus === status ? '#000' : '#c5a34f',
                  '&:hover': {
                    bgcolor: filterStatus === status ? '#c5a34f' : '#333'
                  }
                }}
              >
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Search and Stats Bar */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        {/* Search Text Field */}
        <TextField
          variant="outlined"
          placeholder="Search drivers..."
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#c5a34f'
              }
            }
          }}
          sx={{
            minWidth: 250,
            '& .MuiInputBase-input': {
              color: '#c5a34f'
            }
          }}
        />

        {/* Status Filter Chips */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Object.entries({
            All: drivers.length,
            Pending: drivers.filter(d => d.status === 'Pending').length,
            Approved: drivers.filter(d => d.status === 'Approved').length,
            Suspended: drivers.filter(d => d.status === 'Suspended').length
          }).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              variant={filterStatus === status ? 'filled' : 'outlined'}
              color={statusColors[status] || 'default'}
              onClick={() => setFilterStatus(status)}
              sx={{
                cursor: 'pointer',
                borderColor: filterStatus === status ? 'transparent' : '#b80000',
                color: filterStatus === status ? '#000' : '#c5a34f',
                fontWeight: filterStatus === status ? 'bold' : 'normal',
                bgcolor: filterStatus === status ? '#c5a34f' : 'transparent',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Drivers Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          bgcolor: '#fefefe',
          border: '1px solid',
          borderColor: '#c5a34f',
          borderRadius: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#c5a34f' }}>
              {[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Driver' },
                { key: 'contact', label: 'Contact' },
                { key: 'vehicle', label: 'Vehicle' },
                { key: 'status', label: 'Status' },
                { key: 'documents', label: 'Documents' },
                { key: 'actions', label: 'Actions' }
              ].map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    color: '#000',
                    fontWeight: 'bold',
                    cursor: column.key !== 'actions' ? 'pointer' : 'default'
                  }}
                  onClick={column.key !== 'actions' ? () => handleSort(column.key) : null}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ?
                        <ArrowUpward fontSize="small" sx={{ ml: 0.5, color: '#fefefefe' }} /> :
                        <ArrowDownward fontSize="small" sx={{ ml: 0.5, color: '#fefefefe' }} />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255, 215, 0, 0.15)'
                    },
                    '&:last-child td': { borderBottom: 0 },
                    color: '#c5a34f'
                  }}
                >
                  <TableCell sx={{ color: '#b80000' }}>
                    #{driver.id}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{
                        bgcolor: '#c5a34f',
                        color: '#000',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {driver.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#c5a34f' }}>
                          {driver.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#928e85' }}>
                          Joined: {driver.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" sx={{ color: '#c5a34f' }} />
                        <Typography variant="body2" sx={{ color: '#c5a34f' }}>
                          {driver.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" sx={{ color: '#928e85' }} />
                        <Typography variant="body2" sx={{ color: '#928e85' }}>
                          {driver.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold', color: '#c5a34f' }}>
                      {driver.vehicle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#928e85' }}>
                      {driver.registration}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcons[driver.status]}
                      label={driver.status}
                      color={statusColors[driver.status]}
                      variant="outlined"
                      sx={{
                        borderColor: '#c5a34f',
                        color: '#c5a34f',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={driver.documents === 'Verified' ? 'success' :
                        driver.documents === 'Uploaded' ? 'warning' : 'error'}
                      variant="dot"
                      sx={{ mr: 1 }}
                    >
                      <Typography sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#c5a34f',
                        fontWeight: 'bold'
                      }}>
                        <Description fontSize="small" sx={{ color: '#c5a34f' }} />
                        {driver.documents}
                      </Typography>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* View Details Button */}
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(driver)}
                          sx={{ color: '#b80000' }}
                        >
                          <Person />
                        </IconButton>
                      </Tooltip>

                      {/* Action Buttons based on Driver Status */}
                      {driver.status === 'Pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            sx={{
                              textTransform: 'none',
                              boxShadow: '0 0 8px #c5a34f'
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            sx={{ textTransform: 'none', color: '#b80000', borderColor: '#c5a34f', boxShadow: '0 0 8px #c5a34f' }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {driver.status === 'Approved' && (
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<Warning />}
                          sx={{ textTransform: 'none', color: '#928E85', borderColor: '#c5a34f' , boxShadow: '0 0 8px #c5a34f' }}
                        >
                          Suspend
                        </Button>
                      )}
                      {driver.status === 'Suspended' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<CheckCircle />}
                          sx={{ textTransform: 'none' , boxShadow: '0 0 8px #c5a34f'}}
                        >
                          Reinstate
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Message when no drivers are found
              <TableRow>
                <TableCell colSpan={7} sx={{
                  textAlign: 'center',
                  py: 4,
                  color: '#999'
                }}>
                  No drivers found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Info Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mt: 2,
        color: '#999'
      }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Showing {filteredDrivers.length} of {drivers.length} drivers
        </Typography>
      </Box>

      {/* Driver Details Dialog Section */}
      {/* This section defines the modal dialog for displaying detailed driver information. */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: '#c5a34f',
            color: '#c5a34f',
            border: '2px solid',
            borderColor: '#c5a34f',
            borderRadius: 2,
            minWidth: '500px'
          }
        }}
      >
        {selectedDriver && (
          <>
            <DialogTitle sx={{
              bgcolor: '#c5a34f',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Avatar sx={{
                bgcolor: '#000',
                color: '#b80000',
                width: 40,
                height: 40
              }}>
                {selectedDriver.name.charAt(0)}
              </Avatar>
              {selectedDriver.name}
              <Chip
                label={selectedDriver.status}
                color={statusColors[selectedDriver.status]}
                variant="filled"
                sx={{ ml: 'auto', color: '#000' }}
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 3 }}>
                {/* Driver Information Sub-section */}
                <Typography variant="h6" gutterBottom sx={{
                  color: '#c5a34f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Person /> Driver Information
                </Typography>
                <Divider sx={{ bgcolor: '#c5a34f', mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Email:
                    </Typography>
                    <Typography>{selectedDriver.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Phone:
                    </Typography>
                    <Typography>{selectedDriver.phone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Join Date:
                    </Typography>
                    <Typography>{selectedDriver.joinDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Rating:
                    </Typography>
                    <Typography>{selectedDriver.rating}/5.0</Typography>
                  </Grid>
                </Grid>

                {/* Vehicle Information Sub-section */}
                <Typography variant="h6" gutterBottom sx={{
                  color: '#c5a34f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <DirectionsCarIcon /> Vehicle Information
                </Typography>
                <Divider sx={{ bgcolor: '#b80000', mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Vehicle:
                    </Typography>
                    <Typography>{selectedDriver.vehicle}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Registration:
                    </Typography>
                    <Typography>{selectedDriver.registration}</Typography>
                  </Grid>
                </Grid>

                {/* Documents Sub-section */}
                <Typography variant="h6" gutterBottom sx={{
                  color: '#b80000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <Description /> Documents
                </Typography>
                <Divider sx={{ bgcolor: '#b80000', mb: 2 }} />

                <Typography>
                  Status: <Badge
                    color={selectedDriver.documents === 'Verified' ? 'success' :
                      selectedDriver.documents === 'Uploaded' ? 'warning' : 'error'}
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
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#c5a34f',
                    color: '#000',
                    '&:hover': {
                      bgcolor: '#c5a34f',
                    }
                  }}
                  startIcon={<CheckCircle />}
                >
                  Approve Driver
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}