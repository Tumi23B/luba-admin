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
  DialogActions
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
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
import { Grid } from '@mui/material';
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
  Pending: <PendingActions />,
  Approved: <CheckCircle />,
  Suspended: <Warning />,
  Rejected: <Cancel />
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
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      p: 3,
      color: 'text.primary'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'black',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          color: 'secondary.main',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(129, 116, 43, 0.3)'
        }}>
          Driver Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<Add />}
            sx={{ 
              textTransform: 'none',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}
          >
            Add New Driver
          </Button>
          
          <Tooltip title="Refresh">
            <IconButton sx={{ color: 'secondary.main' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FilterList />}
            onClick={handleClick}
            sx={{ textTransform: 'none' }}
          >
            Filter
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'primary.main'
              }
            }}
          >
            <MenuItem disabled>Filter by Status</MenuItem>
            <Divider sx={{ bgcolor: 'primary.main' }} />
            {['All', 'Pending', 'Approved', 'Suspended', 'Rejected'].map(status => (
              <MenuItem 
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  handleClose();
                }}
                sx={{
                  bgcolor: filterStatus === status ? 'primary.main' : 'transparent',
                  '&:hover': {
                    bgcolor: filterStatus === status ? 'primary.dark' : 'action.hover'
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
                <Search color="secondary" />
              </InputAdornment>
            ),
            sx: {
              color: 'text.primary',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main'
              }
            }
            
          }}
          sx={{ 
            minWidth: 250,
            '& .MuiInputBase-input': {
              color: 'text.primary'
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
                borderColor: filterStatus === status ? 'transparent' : 'primary.main',
                color: filterStatus === status ? 'text.primary' : 'text.secondary'
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Drivers Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: '0 0 20px rgba(178, 34, 34, 0.2)',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
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
                    color: 'secondary.main',
                    fontWeight: 'bold',
                    cursor: column.key !== 'actions' ? 'pointer' : 'default'
                  }}
                  onClick={column.key !== 'actions' ? () => handleSort(column.key) : null}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? 
                        <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
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
                      bgcolor: 'rgba(178, 34, 34, 0.1)' 
                    },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ color: 'secondary.main' }}>
                    #{driver.id}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'secondary.main',
                        width: 32, 
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {driver.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {driver.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Joined: {driver.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="secondary" />
                        <Typography variant="body2">
                          {driver.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" color="secondary" />
                        <Typography variant="body2">
                          {driver.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {driver.vehicle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
                        borderColor: 'primary.main',
                        color: 'text.primary'
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
                        gap: 0.5
                      }}>
                        <Description fontSize="small" />
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
                          sx={{ color: 'secondary.main' }}
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
                              boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)'
                            }}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            startIcon={<Cancel />}
                            sx={{ textTransform: 'none' }}
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
                          sx={{ textTransform: 'none' }}
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
                  color: 'text.secondary'
                }}>
                  No drivers found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination would go here */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 2,
        color: 'text.secondary'
      }}>
        <Typography variant="body2">
          Showing {filteredDrivers.length} of {drivers.length} drivers
        </Typography>
      </Box>
      
      {/* Driver Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            minWidth: '500px'
          }
        }}
      >
        {selectedDriver && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main',
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Avatar sx={{ 
                bgcolor: 'secondary.main', 
                color: 'primary.main',
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
                sx={{ ml: 'auto' }}
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Person /> Driver Information
                </Typography>
                <Divider sx={{ bgcolor: 'primary.main', mb: 2 }} />
                
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
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <DirectionsCarIcon /> Vehicle Information
                </Typography>
                <Divider sx={{ bgcolor: 'primary.main', mb: 2 }} />
                
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
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 3
                }}>
                  <Description /> Documents
                </Typography>
                <Divider sx={{ bgcolor: 'primary.main', mb: 2 }} />
                
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
                color="secondary"
                variant="outlined"
              >
                Close
              </Button>
              {selectedDriver.status === 'Pending' && (
                <Button 
                  variant="contained" 
                  color="success"
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