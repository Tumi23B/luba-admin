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
  LinearProgress,
  Grid
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
  ArrowUpward,
  LocationOn,
  Person,
  Schedule,
  Payment,
  DirectionsCar,
  Map,
  Assignment,
  Edit
} from '@mui/icons-material';

const jobs = [
  { 
    id: 101, 
    customer: 'Alice Johnson', 
    status: 'In Transit', 
    address: '12 King St, Johannesburg',
    driver: 'John Doe',
    vehicle: 'Toyota Hilux (CA 123-456)',
    progress: 65,
    pickupTime: '2023-05-15 09:30',
    deliveryTime: '2023-05-15 11:45',
    amount: 'R1,250',
    items: '3 packages'
  },
  { 
    id: 102, 
    customer: 'Bob Williams', 
    status: 'Pending', 
    address: '34 Queen Rd, Pretoria',
    driver: 'Jane Smith',
    vehicle: 'Ford Ranger (GP 987-654)',
    progress: 0,
    pickupTime: '2023-05-16 10:00',
    deliveryTime: 'Estimated 13:00',
    amount: 'R980',
    items: '1 large package'
  },
  { 
    id: 103, 
    customer: 'Charlie Brown', 
    status: 'Delivered', 
    address: '56 Main Ave, Cape Town',
    driver: 'Mike Johnson',
    vehicle: 'VW Amarok (EC 456-789)',
    progress: 100,
    pickupTime: '2023-05-14 08:15',
    deliveryTime: '2023-05-14 10:30',
    amount: 'R1,520',
    items: '5 packages'
  },
];

const statusColors = {
  Pending: 'warning',
  'In Transit': 'info',
  Delivered: 'success',
  Cancelled: 'error'
};

const statusIcons = {
  Pending: <PendingActions />,
  'In Transit': <LocalShipping />,
  Delivered: <CheckCircle />,
  Cancelled: <Cancel />
};

export default function Jobs() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
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
  
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const filteredJobs = sortedJobs.filter(job => {
    const matchesSearch = 
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toString().includes(searchTerm) ||
      job.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    
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
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          color: 'secondary.main',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
        }}>
          Job Management
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
            Create New Job
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
            {['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'].map(status => (
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
          placeholder="Search jobs..."
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
            All: jobs.length,
            Pending: jobs.filter(j => j.status === 'Pending').length,
            'In Transit': jobs.filter(j => j.status === 'In Transit').length,
            Delivered: jobs.filter(j => j.status === 'Delivered').length
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
      
      {/* Jobs Table */}
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
                { key: 'id', label: 'Job ID' },
                { key: 'customer', label: 'Customer' },
                { key: 'address', label: 'Delivery Address' },
                { key: 'status', label: 'Status' },
                { key: 'progress', label: 'Progress' },
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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(178, 34, 34, 0.1)' 
                    },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ color: 'secondary.main' }}>
                    #{job.id}
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
                        {job.customer.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {job.customer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.items}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn color="secondary" fontSize="small" />
                      <Typography>
                        {job.address}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcons[job.status]}
                      label={job.status}
                      color={statusColors[job.status]}
                      variant="outlined"
                      sx={{ 
                        borderColor: 'primary.main',
                        color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={job.progress} 
                        sx={{ 
                          height: 8,
                          width: '100%',
                          borderRadius: 4,
                          backgroundColor: 'background.default',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: job.status === 'Delivered' ? 
                              'success.main' : 'secondary.main'
                          }
                        }}
                      />
                      <Typography variant="body2">
                        {job.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        startIcon={<Assignment />}
                        onClick={() => handleViewDetails(job)}
                        sx={{ 
                          textTransform: 'none',
                          boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                        }}
                      >
                        Details
                      </Button>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ 
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary'
                }}>
                  No jobs found matching your criteria
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
          Showing {filteredJobs.length} of {jobs.length} jobs
        </Typography>
      </Box>
      
      {/* Job Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2
          }
        }}
      >
        {selectedJob && (
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
                {selectedJob.customer.charAt(0)}
              </Avatar>
              Job #{selectedJob.id} - {selectedJob.customer}
              <Chip
                label={selectedJob.status}
                color={statusColors[selectedJob.status]}
                variant="filled"
                sx={{ ml: 'auto' }}
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  {/* Customer and Delivery Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Person /> Customer & Delivery Information
                    </Typography>
                    <Divider sx={{ bgcolor: 'primary.main', mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Customer:
                        </Typography>
                        <Typography>{selectedJob.customer}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Items:
                        </Typography>
                        <Typography>{selectedJob.items}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Delivery Address:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn color="secondary" />
                          <Typography>{selectedJob.address}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Pickup Time:
                        </Typography>
                        <Typography>{selectedJob.pickupTime}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Delivery Time:
                        </Typography>
                        <Typography>{selectedJob.deliveryTime}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Amount:
                        </Typography>
                        <Typography sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                          {selectedJob.amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Driver and Progress Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <DirectionsCar /> Driver & Progress
                    </Typography>
                    <Divider sx={{ bgcolor: 'primary.main', mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Assigned Driver:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'secondary.main',
                            width: 32, 
                            height: 32
                          }}>
                            {selectedJob.driver.charAt(0)}
                          </Avatar>
                          <Typography>{selectedJob.driver}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Vehicle:
                        </Typography>
                        <Typography>{selectedJob.vehicle}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Delivery Progress:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedJob.progress} 
                            sx={{ 
                              height: 10,
                              width: '100%',
                              borderRadius: 4,
                              backgroundColor: 'background.default',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: selectedJob.status === 'Delivered' ? 
                                  'success.main' : 'secondary.main'
                              }
                            }}
                          />
                          <Typography variant="body2">
                            {selectedJob.progress}%
                          </Typography>
                        </Box>
                      </Grid>
                      {selectedJob.status === 'In Transit' && (
                        <Grid item xs={12}>
                          <Button 
                            variant="contained" 
                            color="success"
                            fullWidth
                            startIcon={<Map />}
                          >
                            Track Delivery
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
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
              {selectedJob.status === 'Pending' && (
                <Button 
                  variant="contained" 
                  color="secondary"
                  startIcon={<Edit />}
                >
                  Edit Job
                </Button>
              )}
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Assignment />}
              >
                Print Job Sheet
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}