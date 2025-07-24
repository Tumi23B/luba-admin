import React, { useState, useEffect } from 'react';
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
  Grid,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Email as EmailIcon,
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
  LocationOn as MapIcon
} from '@mui/icons-material';
import { db } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo, limitToLast } from 'firebase/database';




// Configuration for driver status display (icons, colors, labels)
const statusConfig = {
  verified: { icon: <VerifiedIcon />, color: 'success', label: 'Verified' },
  pending: { icon: <VerifiedIcon />, color: 'warning', label: 'Pending Verification' },
  suspended: { icon: <VerifiedIcon />, color: 'error', label: 'Suspended' },
  active: { icon: <VerifiedIcon />, color: 'success', label: 'Active' },
  inactive: { icon: <VerifiedIcon />, color: 'default', label: 'Inactive' }
};

// Configuration for job status display
const jobStatusConfig = {
  pending: { color: 'warning', label: 'Pending' },
  in_progress: { color: 'info', label: 'In Progress' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' }
};

/**
 * DriverCard component - Displays a summary card for a driver
 * @param {Object} driver - Driver data object
 * @param {Function} onClick - Click handler for the card
 */
const DriverCard = ({ driver, onClick }) => {
  // Get status configuration based on driver's status
  const status = statusConfig[driver.status] || statusConfig.pending;
  // Get current job status if driver has a current job
  const currentJobStatus = driver.currentJob ? 
    jobStatusConfig[driver.currentJob.status] || { color: 'default', label: 'Unknown' } 
    : null;

  return (
    <Card onClick={onClick} sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3,
        cursor: 'pointer'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Driver profile section with avatar and basic info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={driver.photoURL} sx={{ 
            width: 56, 
            height: 56, 
            bgcolor: '#c5a34f',
            mr: 2 
          }}>
            {driver.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {driver.fullname || 'No name'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Chip
                icon={status.icon}
                label={status.label}
                size="small"
                color={status.color}
                sx={{ mr: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: '#b80000', fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2">{driver.rating?.toFixed(1) || 'N/A'}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Driver contact and vehicle information */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2">
              {driver.email || 'No email'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2">
              {driver.phoneNumber || 'No phone'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MapIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2" noWrap>
              {driver.address || 'No address'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VehicleIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2">
              {driver.vehicleType || 'No vehicle'} ({driver.vehicleRegistration || 'N/A'})
            </Typography>
          </Box>
        </Stack>

        {/* Current job information section */}
        {driver.currentJob ? (
          <Paper elevation={0} sx={{ 
            p: 1.5, 
            backgroundColor: 'action.hover',
            borderRadius: 1,
            borderLeft: `4px solid ${currentJobStatus.color === 'default' ? '#c5a34f' : ''}`
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Current Job
              </Typography>
              <Chip 
                label={currentJobStatus.label} 
                size="small" 
                color={currentJobStatus.color}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {driver.currentJob.description || 'No description'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">
                {driver.currentJob.client || 'No client'}
              </Typography>
              <Typography variant="caption">
                {driver.currentJob.location || 'No location'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={driver.currentJob.progress || 0}
              sx={{ height: 6, borderRadius: 3, mt: 1.5 }}
              color={currentJobStatus.color === 'default' ? 'primary' : currentJobStatus.color}
            />
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ 
            p: 1.5, 
            backgroundColor: 'action.hover',
            borderRadius: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              No current job assignment
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * DriverDetails component - Displays detailed information about a driver in a dialog
 * @param {Object} driver - Driver data object
 * @param {Function} onClose - Function to close the dialog
 */
const DriverDetails = ({ driver, onClose }) => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch recent jobs for the driver when component mounts or driver changes
  useEffect(() => {
    if (!driver?.id) return;

    const jobsRef = query(
      ref(db, 'jobs'),
      orderByChild('driverId'),
      equalTo(driver.id),
      limitToLast(5)
    );

    const unsubscribe = onValue(jobsRef, (snapshot) => {
      const jobs = [];
      snapshot.forEach((child) => {
        jobs.push({
          id: child.key,
          ...child.val()
        });
      });
      setRecentJobs(jobs.sort((a, b) => b.timestamp - a.timestamp));
      setLoadingJobs(false);
    });

    return () => unsubscribe();
  }, [driver?.id]);

  // Filter jobs based on search term
  const filteredJobs = recentJobs.filter(job =>
    job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const status = statusConfig[driver.status] || statusConfig.pending;

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          Driver Details
          <Chip
            icon={status.icon}
            label={status.label}
            color={status.color}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <Button onClick={onClose}>Close</Button>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left column - Driver profile and contact info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={driver.photoURL}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: '#c5a34f',
                  fontSize: '2.5rem'
                }}
              >
                {driver.name?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {driver.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {driver.driverId || 'ID: N/A'}
              </Typography>
            </Box>

            {/* Contact information section */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.email || 'No email'} 
                    secondary="Email" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.phoneNumber || 'No phone'} 
                    secondary="Phone" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AddressIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.address || 'No address'} 
                    secondary="Address" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.city ? `${driver.city}, ${driver.country}` : 'No location'} 
                    secondary="Location" 
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Vehicle information section */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Vehicle Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <VehicleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.vehicleType || 'No vehicle'} 
                    secondary="Vehicle Type" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DocumentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={driver.vehicleRegistration || 'N/A'} 
                    secondary="Registration" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right column - Job information */}
          <Grid item xs={12} md={8}>
            {/* Current job details section */}
            {driver.currentJob && (
              <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Current Job Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Job Description
                    </Typography>
                    <Typography variant="body1">
                      {driver.currentJob.description || 'No description'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Client
                    </Typography>
                    <Typography variant="body1">
                      {driver.currentJob.client || 'No client'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {driver.currentJob.location || 'No location'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={jobStatusConfig[driver.currentJob.status]?.label || 'Unknown'} 
                      color={jobStatusConfig[driver.currentJob.status]?.color || 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={driver.currentJob.progress || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={jobStatusConfig[driver.currentJob.status]?.color || 'primary'}
                    />
                    <Typography variant="caption" display="block" textAlign="right">
                      {driver.currentJob.progress || 0}% complete
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Recent job history section with search */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Recent Job History
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>

              {loadingJobs ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredJobs.length > 0 ? (
                <List dense>
                  {filteredJobs.map((job) => {
                    const jobStatus = jobStatusConfig[job.status] || { color: 'default', label: 'Unknown' };
                    return (
                      <ListItem key={job.id} divider>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <WorkIcon color={jobStatus.color} />
                        </ListItemIcon>
                        <ListItemText
                          primary={job.description || 'No description'}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {job.client || 'No client'}
                              </Typography>
                              {` — ${jobStatus.label} • ${new Date(job.timestamp).toLocaleDateString()}`}
                            </>
                          }
                        />
                        <Chip
                          label={`${job.progress || 0}%`}
                          size="small"
                          color={jobStatus.color}
                          variant="outlined"
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  {searchTerm ? 'No matching jobs found' : 'No job history available'}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

/**
 * DriverManagement component - Main component for managing and displaying drivers
 */
const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActiveVehicles, setShowActiveVehicles] = useState(true);


  // Fetch drivers data from Firebase when component mounts
  useEffect(() => {
    const driversRef = ref(db, 'drivers');
    
    const unsubscribe = onValue(driversRef, (snapshot) => {
      try {
        const driversData = [];
        const promises = [];

        snapshot.forEach((child) => {
          const driver = {
            id: child.key,
            ...child.val()
          };

          // Fetch current job if exists
          if (driver.currentJobId) {
            const promise = new Promise((resolve) => {
              const jobRef = ref(db, `jobs/${driver.currentJobId}`);
              onValue(jobRef, (jobSnapshot) => {
                driver.currentJob = jobSnapshot.val();
                resolve();
              }, { onlyOnce: true });
            });
            promises.push(promise);
          }

          driversData.push(driver);
        });

        // Wait for all job data to be fetched before updating state
        Promise.all(promises).then(() => {
          setDrivers(driversData);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error processing data:', err);
        setError('Failed to process driver data');
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Main render
  return (
    <Box sx={{ p: 3 }}>
  {/* Header with Clear button */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Driver Job Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage driver assignments and job status
      </Typography>
    </Box>
    <Button
      variant="outlined"
      color="error"
      onClick={() => setShowActiveVehicles(false)}
      sx={{ height: 'fit-content' }}
    >
      Clear Active Vehicles
    </Button>
  </Box>

  {/* Display drivers list or empty state */}
  {drivers.length === 0 ? (
  <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" gutterBottom>
      No drivers found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Currently there are no drivers registered in the system
    </Typography>
  </Paper>
) : !showActiveVehicles ? (
  <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Active vehicles view cleared
    </Typography>
    <Button variant="contained" onClick={() => setShowActiveVehicles(true)}>
      Restore View
    </Button>
  </Paper>
) : (
  <Grid container spacing={3}>
    {drivers.map((driver) => (
      <Grid item key={driver.id} xs={12} sm={6} md={4} lg={3}>
        <DriverCard 
          driver={driver} 
          onClick={() => setSelectedDriver(driver)} 
        />
      </Grid>
    ))}
  </Grid>
)}

  {/* Driver details dialog when a driver is selected */}
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