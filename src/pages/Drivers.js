import React, { useState } from 'react';
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
  Menu,
  MenuItem,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Search,
  FilterList,
  CheckCircle,
  PendingActions,
  Cancel,
  Refresh,
  Add,
  ArrowDownward,
  ArrowUpward,
  Email,
  Phone,
  Person,
  Description,
  Warning
} from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

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

const statusColors = {
  Pending: 'warning',
  Approved: 'success',
  Suspended: 'error',
  Rejected: 'error'
};

const statusIcons = {
  Pending: <PendingActions sx={{ color: '#FFD700' }} />, // gold color icon
  Approved: <CheckCircle sx={{ color: '#FFD700' }} />,
  Suspended: <Warning sx={{ color: '#FFD700' }} />,
  Rejected: <Cancel sx={{ color: '#FFD700' }} />
};

export default function Drivers() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredDrivers = sortedDrivers.filter(driver => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{
      bgcolor: '#000', // black background
      minHeight: '100vh',
      p: 3,
      color: '#FFD700' // gold text default
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
          color: '#FFD700',
          fontWeight: 'bold',
          textShadow: '0 0 10px #FFD700',
        }}>
          Driver Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              boxShadow: '0 0 10px #FFD700',
              bgcolor: '#FFD700',
              color: '#000'
            }}
            startIcon={<Add sx={{ color: '#000' }} />}
          >
            Add New Driver
          </Button>

          <Tooltip title="Refresh">
            <IconButton sx={{ color: '#FFD700' }}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                bgcolor: '#FFD700',
                color: '#000'
              }
            }}
            startIcon={<FilterList />}
            onClick={handleClick}
          >
            Filter
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: '#121212',
                color: '#FFD700',
                border: '1px solid',
                borderColor: '#FFD700'
              }
            }}
          >
            <MenuItem disabled sx={{ color: '#FFD700' }}>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: '#FFD700' }} />
            {['All', 'Pending', 'Approved', 'Suspended', 'Rejected'].map(status => (
              <MenuItem
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  handleClose();
                }}
                sx={{
                  bgcolor: filterStatus === status ? '#FFD700' : 'transparent',
                  color: filterStatus === status ? '#000' : '#FFD700',
                  '&:hover': {
                    bgcolor: filterStatus === status ? '#FFC107' : '#333'
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
        <TextField
          variant="outlined"
          placeholder="Search drivers..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#FFD700' }} />
              </InputAdornment>
            ),
            sx: {
              color: '#FFD700',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700'
              }
            }
          }}
          sx={{
            minWidth: 250,
            '& .MuiInputBase-input': {
              color: '#FFD700'
            }
          }}
        />

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
                borderColor: filterStatus === status ? 'transparent' : '#FFD700',
                color: filterStatus === status ? '#000' : '#FFD700',
                fontWeight: filterStatus === status ? 'bold' : 'normal',
                bgcolor: filterStatus === status ? '#FFD700' : 'transparent',
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
          bgcolor: '#121212',
          border: '1px solid',
          borderColor: '#FFD700',
          borderRadius: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FFD700' }}>
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
                        <ArrowUpward fontSize="small" sx={{ ml: 0.5, color: '#000' }} /> :
                        <ArrowDownward fontSize="small" sx={{ ml: 0.5, color: '#000' }} />
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
                    color: '#FFD700'
                  }}
                >
                  <TableCell sx={{ color: '#FFD700' }}>
                    #{driver.id}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{
                        bgcolor: '#FFD700',
                        color: '#000',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {driver.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                          {driver.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                          Joined: {driver.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" sx={{ color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#FFD700' }}>
                          {driver.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" sx={{ color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#FFD700' }}>
                          {driver.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                      {driver.vehicle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
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
                        borderColor: '#FFD700',
                        color: '#FFD700',
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
                        color: '#FFD700',
                        fontWeight: 'bold'
                      }}>
                        <Description fontSize="small" sx={{ color: '#FFD700' }} />
                        {driver.documents}
                      </Typography>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(driver)}
                          sx={{ color: '#FFD700' }}
                        >
                          <Person />
                        </IconButton>
                      </Tooltip>

                      {driver.status === 'Pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            sx={{
                              textTransform: 'none',
                              boxShadow: '0 0 8px #FFD700'
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            sx={{ textTransform: 'none', color: '#FFD700', borderColor: '#FFD700' }}
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
                          sx={{ textTransform: 'none', color: '#FFD700', borderColor: '#FFD700' }}
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
                          sx={{ textTransform: 'none' }}
                        >
                          Reinstate
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
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

      {/* Pagination info */}
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

      {/* Driver Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: '#121212',
            color: '#FFD700',
            border: '2px solid',
            borderColor: '#FFD700',
            borderRadius: 2,
            minWidth: '500px'
          }
        }}
      >
        {selectedDriver && (
          <>
            <DialogTitle sx={{
              bgcolor: '#FFD700',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Avatar sx={{
                bgcolor: '#000',
                color: '#FFD700',
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
                <Typography variant="h6" gutterBottom sx={{
                  color: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Person /> Driver Information
                </Typography>
                <Divider sx={{ bgcolor: '#FFD700', mb: 2 }} />

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

                <Typography variant="h6" gutterBottom sx={{
                  color: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <DirectionsCarIcon /> Vehicle Information
                </Typography>
                <Divider sx={{ bgcolor: '#FFD700', mb: 2 }} />

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

                <Typography variant="h6" gutterBottom sx={{
                  color: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <Description /> Documents
                </Typography>
                <Divider sx={{ bgcolor: '#FFD700', mb: 2 }} />

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
              <Button
                onClick={handleCloseDialog}
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    bgcolor: '#FFD700',
                    color: '#000'
                  }
                }}
                variant="outlined"
              >
                Close
              </Button>
              {selectedDriver.status === 'Pending' && (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#FFD700',
                    color: '#000',
                    '&:hover': {
                      bgcolor: '#FFC107'
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
