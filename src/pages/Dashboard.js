// React and Material UI component imports for layout and styling
import React, { useState, useEffect } from 'react'; // Added useEffect
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button,
  Divider, Avatar, LinearProgress
} from '@mui/material';

// Icon imports for visual representation in cards and headers
import {
  Assignment, DirectionsCar, Payment, Warning, CheckCircle
} from '@mui/icons-material';

import { db } from '../firebase'; // Import Firebase Realtime Database instance
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database'; // Import database functions

import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation

// Dashboard Component Start
export default function Dashboard() {
  const [pendingDrivers, setPendingDrivers] = useState([]); // State for pending drivers
  const [activeJobs, setActiveJobs] = useState([]); // State for active jobs (assuming they come from Firebase eventually)
  const navigate = useNavigate(); // Initialize navigate hook
  const [showAcceptMessage, setShowAcceptMessage] = useState(false);


  useEffect(() => {
    // Fetch pending drivers from Firebase
    const driverApplicationsRef = query(
      ref(db, 'driverApplications'),
      orderByChild('status'),
      equalTo('Pending')
    );

    const unsubscribe = onValue(driverApplicationsRef, (snapshot) => {
      const driversData = [];
      snapshot.forEach((childSnapshot) => {
        const driver = childSnapshot.val();
        // Calculate days pending (assuming createdAt is ISO string)
        const createdAt = new Date(driver.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        driversData.push({
          id: childSnapshot.key, // Firebase UID as ID
          name: driver.fullName,
          daysPending: diffDays,
          uid: childSnapshot.key // Store UID for navigation
        });
      });
      setPendingDrivers(driversData);

      // Update 'Drivers Pending Approval' stat card
      setStatsCards(prevStats => prevStats.map(card =>
        card.title === 'Drivers Pending Approval' ? { ...card, value: driversData.length } : card
      ));
    }, (error) => {
      console.error("Failed to fetch pending drivers:", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Sample jobs with progress status (will be replaced by Firebase data eventually)
  const recentJobs = [
    { id: 1, driver: 'Sam Wilson', status: 'In Transit', progress: 65 },
    { id: 2, driver: 'Alex Morgan', status: 'Pickup', progress: 20 },
    { id: 3, driver: 'Taylor Swift', status: 'Delivered', progress: 100 }
  ];

  // Statistical data for dashboard cards (using useState to allow updates)
  const [statsCards, setStatsCards] = useState([ // Changed to useState
    {
      title: 'Drivers Pending Approval',
      value: 0, // Initial value will be updated by Firebase data
      subtitle: 'Review and approve driver documents',
      icon: <Assignment />
    },
    {
      title: 'Active Jobs',
      value: 12, // This could also come from Firebase
      subtitle: 'Track ongoing deliveries',
      icon: <DirectionsCar />
    },
    {
      title: 'Transactions Today',
      value: 'R24,500', // This could also come from Firebase
      subtitle: 'Payments processed',
      icon: <Payment />
    },
    {
      title: 'Completed Jobs',
      value: 45, // This could also come from Firebase
      subtitle: 'Successfully delivered',
      icon: <CheckCircle />
    },
    {
      title: 'Warnings Issued',
      value: 3, // This could also come from Firebase
      subtitle: 'Driver violations',
      icon: <Warning />
    },
    {
      title: 'New Registrations',
      value: 7, // This could also come from Firebase
      subtitle: 'Drivers joined today',
      icon: <Assignment />
    }
  ]);

  // Handle "Review" button click to navigate to Drivers.js with driver UID
  const handleReviewClick = (driverUid) => {
    navigate(`/drivers/${driverUid}`); // Navigate to Drivers.js with the specific driver's UID
  };

  // Main Container + Header
  return (
    <Box sx={{ p: 3, bgcolor: '#fefefefe', color: '#c5a34f', minHeight: '100vh' }}>
      {/* Header and intro message for the dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#b00000">
          Welcome to Luba Deliveries Admin
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#c5a34f' }}>
          Manage drivers, monitor jobs, view transactions, and keep your delivery business running smoothly.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      {/* Cards showing overall statistics in a flex layout */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        justifyContent: 'space-between', mb: 5
      }}>
        {statsCards.map((card, index) => (
          <Paper key={index} sx={{
            flex: '1 1 calc(33.333% - 24px)', minWidth: 280, p: 3,
            borderRadius: 2, backgroundColor: '#fefefefe',
            color: '#c5a34f', border: '1px solid #c5a34f'
          }}>
            {/* Card header with icon and title */}
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#c5a34f', color: '#000', mr: 2 }}>
                {card.icon}
              </Avatar>
              <Typography variant="h6" color="#c5a34f">{card.title}</Typography>
            </Box>
            {/* Card value and description */}
            <Typography variant="h3" color="#c5a34f" fontWeight="bold">
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#AAAAAA' }}>
              {card.subtitle}
            </Typography>
          </Paper>
        ))}
      </Box>
      {/* Drivers Pending Approval Section */}
      {/* List of drivers awaiting manual review */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: '#b80000' }} />
          Drivers Pending Approval
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#b80000' }} />
        <List>
          {pendingDrivers.length > 0 ? (
            pendingDrivers.map(driver => (
              <ListItem key={driver.id} sx={{
                mb: 1, bgcolor: '#000', borderRadius: 1,
                background: '#fefefefe', border: '1px solid #c5a34f'
              }}
                secondaryAction={
                  <Button size="small" variant="outlined" sx={{
                    color: '#c5a34f', borderColor: '#b80000',
                    background: '#fefefefe'
                  }}
                    onClick={() => handleReviewClick(driver.uid)} // Pass UID to handler
                  >
                    Review
                  </Button>
                }>
                <ListItemText
                  primary={driver.name}
                  secondary={`Pending for ${driver.daysPending} day(s)`}
                  primaryTypographyProps={{ style: { color: '#b80000' } }}
                  secondaryTypographyProps={{ style: { color: '#AAAAAA' } }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No drivers currently pending approval."
                primaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Active Jobs Status Section */}
      {/* List of ongoing deliveries with progress bars */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DirectionsCar sx={{ mr: 1, color: '#b80000' }} />
          Active Jobs Status
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f' }} />
        <List>
          {recentJobs.map(job => (
            <ListItem key={job.id} sx={{
              mb: 2, bgcolor: '#000', borderRadius: 1,
              flexDirection: 'column', background: '#fefefefe',
              alignItems: 'flex-start', border: '1px solid #c5a34f'
            }}>
              {/* Driver name and job status */}
              <Typography variant="body1" fontWeight="bold" color="#b80000">
                {job.driver}
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                {job.status}
              </Typography>
              {/* Job progress bar */}
              <LinearProgress
                variant="determinate"
                value={job.progress}
                sx={{
                  width: '100%', height: 8, borderRadius: 4, mt: 1,
                  backgroundColor: '#444',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#c5a34f' }
                }}
              />
              {/* Optional label for completed jobs */}
              {job.progress === 100 && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CheckCircle sx={{ fontSize: 16, mr: 1, color: 'green' }} />
                  <Typography variant="caption" color="green">Delivery completed</Typography>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* Recent Transactions Section */}
      {/* Placeholder for transaction summaries or graphs */}
      <Paper sx={{ p: 3, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Payment sx={{ mr: 1, color: '#b80000' }} />
          Recent Transactions
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f' }} />
        <Typography sx={{ color: '#AAAAAA' }}>
          Transaction data visualization would appear here
        </Typography>
      </Paper>
    </Box>
  );
}