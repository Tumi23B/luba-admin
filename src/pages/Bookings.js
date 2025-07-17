import React from 'react';
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
  Badge,
  Menu,
  MenuItem,
  Divider
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
  ArrowUpward
} from '@mui/icons-material';

const bookings = [
  { 
    id: 501, 
    customer: 'Charlie Brown', 
    status: 'Pending', 
    date: '2023-05-15',
    vehicle: 'Toyota Hilux',
    amount: 'R1,250'
  },
  { 
    id: 502, 
    customer: 'Diana Prince', 
    status: 'Completed', 
    date: '2023-05-14',
    vehicle: 'Ford Ranger',
    amount: 'R980'
  },
  { 
    id: 503, 
    customer: 'Bruce Wayne', 
    status: 'In Transit', 
    date: '2023-05-16',
    vehicle: 'VW Amarok',
    amount: 'R1,520'
  },
  { 
    id: 504, 
    customer: 'Clark Kent', 
    status: 'Cancelled', 
    date: '2023-05-12',
    vehicle: 'Isuzu D-Max',
    amount: 'R1,100'
  },
];

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

export default function Bookings() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sortConfig, setSortConfig] = React.useState({ key: 'id', direction: 'asc' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');
  
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
  
  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const filteredBookings = sortedBookings.filter(booking => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    
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
          Bookings Management
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
            New Booking
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
            {['All', 'Pending', 'In Transit', 'Completed', 'Cancelled'].map(status => (
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
          placeholder="Search bookings..."
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
            All: bookings.length,
            Pending: bookings.filter(b => b.status === 'Pending').length,
            'In Transit': bookings.filter(b => b.status === 'In Transit').length,
            Completed: bookings.filter(b => b.status === 'Completed').length
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
      
      {/* Bookings Table */}
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
                { key: 'id', label: 'Booking ID' },
                { key: 'customer', label: 'Customer' },
                { key: 'date', label: 'Date' },
                { key: 'vehicle', label: 'Vehicle' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
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
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  hover
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(178, 34, 34, 0.1)' 
                    },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ color: 'secondary.main' }}>
                    #{booking.id}
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
                        {booking.customer.charAt(0)}
                      </Avatar>
                      {booking.customer}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {booking.date}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {booking.vehicle}
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }}>
                    {booking.amount}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcons[booking.status]}
                      label={booking.status}
                      color={statusColors[booking.status]}
                      variant="outlined"
                      sx={{ 
                        borderColor: 'primary.main',
                        color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {booking.status === 'Pending' && (
                        <>
                          <Button 
                            variant="contained" 
                            color="secondary" 
                            size="small"
                            startIcon={<CheckCircle />}
                            sx={{ 
                              textTransform: 'none',
                              boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
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
                      {booking.status === 'In Transit' && (
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          startIcon={<CheckCircle />}
                          sx={{ textTransform: 'none' }}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
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
                  No bookings found matching your criteria
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
          Showing {filteredBookings.length} of {bookings.length} bookings
        </Typography>
      </Box>
    </Box>
  );
}