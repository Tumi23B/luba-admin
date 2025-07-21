import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  OfflineBolt as OnlineIcon,
  DirectionsCar as VehicleIcon,
  Star as StarIcon,
  Assignment as JobIcon,
  Description as DocumentIcon,
  Phone as PhoneIcon,
  Home as AddressIcon,
  CalendarToday as JoinDateIcon,
  GpsFixed as LocationIcon,
  Work as WorkIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';

const statusConfig = {
  Verified: { icon: <VerifiedIcon />, color: 'success' },
  'Pending Verification': { icon: <VerifiedIcon />, color: 'warning' },
  Suspended: { icon: <VerifiedIcon />, color: 'error' },
};

const driversData = [
  {
    id: 1,
    name: 'John Smith',
    phone: '+27 234342345',
    status: 'Verified',
    address: '123 Main St, Anytown, SA',
    isOnline: true,
    joinDate: '2023-01-15',
    rating: 4.8,
    vehicle: 'Toyota Hilux',
    registration: 'JJ 10 NZ GP',
    currentJob: {
      description: 'Office relocation to Sandton'
    },
    documents: [
      { name: 'Driver License', url: '#' },
      { name: 'Vehicle Insurance', url: '#' }
    ]
  },
  {
    id: 2,
    name: 'Maria Bodesta',
    phone: '+277363523',
    status: 'Verified',
    address: '456 Oak Avenue, Thokoza, SA',
    isOnline: false,
    joinDate: '2023-02-20',
    rating: 4.9,
    vehicle: 'Vw Transporter',
    registration: 'CK 40 KK GP',
    currentJob: null,
    documents: [
      { name: 'Driver License', url: '#' },
      { name: 'Vehicle Registration', url: '#' }
    ]
  },
  {
    id: 3,
    name: 'David Johnson',
    phone: '0894567845',
    status: 'Pending Verification',
    address: '789 Pine Road, Cape Town, SA',
    isOnline: true,
    joinDate: '2023-03-10',
    rating: 4.5,
    vehicle: 'Ford Transit',
    registration: 'CAA 23453',
    currentJob: {
      description: 'Corporate event shuttle service downtown'
    },
    documents: [
      { name: 'Driver License', url: '#' }
    ]
  },
  {
    id: 4,
    name: 'Sarah Williams',
    phone: '0834567890',
    status: 'Verified',
    address: '321 Elm Street, Durban, SA',
    isOnline: true,
    joinDate: '2023-04-05',
    rating: 4.7,
    vehicle: 'Mercedes Benz Sprinter',
    registration: 'ND 54345',
    currentJob: {
      description: 'Family Trip'
    },
    documents: [
      { name: 'Driver License', url: '#' },
      { name: 'Commercial Permit', url: '#' }
    ]
  },
  {
    id: 5,
    name: 'Michael Brown',
    phone: '0834568765',
    status: 'Suspended',
    address: '654 Maple Lane, Umhlanga, SA',
    isOnline: false,
    joinDate: '2023-01-30',
    rating: 3.9,
    vehicle: 'Ford Ranger',
    registration: 'NU 12345',
    currentJob: null,
    documents: [
      { name: 'Driver License', url: '#' }
    ]
  }
];

const DriverCard = ({ driver, onClick }) => {
  const status = statusConfig[driver.status];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        },
      }}
      onClick={onClick}
      elevation={1}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#c5a34f',
              color: '#fefefefe',
              mr: 2,
            }}
          >
            {driver.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {driver.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Chip
                icon={status.icon}
                label={driver.status}
                size="small"
                color={status.color}
                sx={{ mr: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: '#b80000', fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2">{driver.rating}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mb: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OnlineIcon
              sx={{
                color: driver.isOnline ? 'success.main' : 'text.disabled',
                mr: 1,
                fontSize: '1rem',
              }}
            />
            <Typography variant="body2">
              {driver.isOnline ? 'Online now' : 'Offline'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VehicleIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2">
              {driver.vehicle} ({driver.registration})
            </Typography>
          </Box>
        </Stack>

        {driver.currentJob ? (
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: 'action.hover',
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
              Active Job
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {driver.currentJob.description.length > 50
                ? `${driver.currentJob.description.substring(0, 50)}...`
                : driver.currentJob.description}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={70}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: 'action.hover',
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              Available for assignments
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

const DriverDetails = ({ driver, onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Driver Details
        <Chip
          icon={statusConfig[driver.status].icon}
          label={driver.status}
          color={statusConfig[driver.status].color}
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#c5a34f',
              color: 'white',
              mr: 3,
              fontSize: '1.5rem',
            }}
          >
            {driver.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {driver.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <StarIcon sx={{ color: '#b80000', mr: 0.5 }} />
              <Typography>{driver.rating}</Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                Joined {driver.joinDate}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PhoneIcon color="#b80000" />
                </ListItemIcon>
                <ListItemText primary={driver.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AddressIcon color="#b80000" />
                </ListItemIcon>
                <ListItemText primary={driver.address} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Vehicle Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <VehicleIcon color="#b80000" />
                </ListItemIcon>
                <ListItemText primary={driver.vehicle} />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocationIcon color="#b80000" />
                </ListItemIcon>
                <ListItemText primary={driver.registration} />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Documents
        </Typography>
        <Stack spacing={1}>
          {driver.documents.map((doc, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={<DocumentIcon />}
              fullWidth
              sx={{ justifyContent: 'flex-start', color: '#b80000', borderColor: '#c5a34' }}
              onClick={() => window.open(doc.url, '_blank')}
            >
              {doc.name}
            </Button>
          ))}
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DriverManagement = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Job Management
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
        mt: 3
      }}>
        {driversData.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onClick={() => setSelectedDriver(driver)}
          />
        ))}
      </Box>

      {selectedDriver && (
        <DriverDetails
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
    </Box>
  );
};

export default DriverManagement;