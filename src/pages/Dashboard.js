import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Assignment,
  DirectionsCar,
  Payment,
  Warning,
  CheckCircle
} from '@mui/icons-material';

export default function Dashboard() {
  const pendingDrivers = [
    { id: 1, name: 'John Doe', daysPending: 2 },
    { id: 2, name: 'Jane Smith', daysPending: 1 },
    { id: 3, name: 'Mike Johnson', daysPending: 3 }
  ];

  const recentJobs = [
    { id: 1, driver: 'Sam Wilson', status: 'In Transit', progress: 65 },
    { id: 2, driver: 'Alex Morgan', status: 'Pickup', progress: 20 },
    { id: 3, driver: 'Taylor Swift', status: 'Delivered', progress: 100 }
  ];

  const statsCards = [
    {
      title: 'Drivers Pending Approval',
      value: 5,
      subtitle: 'Review and approve driver documents',
      icon: <Assignment />
    },
    {
      title: 'Active Jobs',
      value: 12,
      subtitle: 'Track ongoing deliveries',
      icon: <DirectionsCar />
    },
    {
      title: 'Transactions Today',
      value: 'R24,500',
      subtitle: 'Payments processed',
      icon: <Payment />
    },
    {
      title: 'Completed Jobs',
      value: 45,
      subtitle: 'Successfully delivered',
      icon: <CheckCircle />
    },
    {
      title: 'Warnings Issued',
      value: 3,
      subtitle: 'Driver violations',
      icon: <Warning />
    },
    {
      title: 'New Registrations',
      value: 7,
      subtitle: 'Drivers joined today',
      icon: <Assignment />
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#000000', color: '#FFD700', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#FFD700">
          Welcome to Luba Deliveries Admin
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#AAAAAA' }}>
          Manage drivers, monitor jobs, view transactions, and keep your delivery business running smoothly.
        </Typography>
      </Box>

      {/* Stats Cards - Flexbox Layout */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'space-between',
          mb: 5
        }}
      >
        {statsCards.map((card, index) => (
          <Paper
            key={index}
            sx={{
              flex: '1 1 calc(33.333% - 24px)',
              minWidth: 280,
              p: 3,
              borderRadius: 2,
              backgroundColor: '#1a1a1a',
              color: '#FFD700',
              border: '1px solid #FFD700'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#FFD700', color: '#000', mr: 2 }}>
                {card.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" color="#FFD700">{card.title}</Typography>
              </Box>
            </Box>
            <Typography variant="h3" color="#FFD700">
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#AAAAAA' }}>
              {card.subtitle}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Drivers Pending Approval */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: '#FFD700' }} />
          Drivers Pending Approval
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#FFD700' }} />
        <List>
          {pendingDrivers.map(driver => (
            <ListItem
              key={driver.id}
              sx={{
                mb: 1,
                bgcolor: '#000',
                borderRadius: 1
              }}
              secondaryAction={
                <Button size="small" variant="outlined" sx={{ color: '#FFD700', borderColor: '#FFD700' }}>
                  Review
                </Button>
              }
            >
              <ListItemText
                primary={driver.name}
                secondary={`Pending for ${driver.daysPending} day(s)`}
                primaryTypographyProps={{ style: { color: '#FFD700' } }}
                secondaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Active Jobs */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DirectionsCar sx={{ mr: 1, color: '#FFD700' }} />
          Active Jobs Status
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#FFD700' }} />
        <List>
          {recentJobs.map(job => (
            <ListItem
              key={job.id}
              sx={{
                mb: 2,
                bgcolor: '#000',
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography variant="body1" fontWeight="bold" color="#FFD700">
                {job.driver}
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                {job.status}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={job.progress}
                sx={{ width: '100%', height: 8, borderRadius: 4, mt: 1, backgroundColor: '#444', '& .MuiLinearProgress-bar': { backgroundColor: '#FFD700' } }}
              />
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

      {/* Recent Transactions */}
      <Paper sx={{ p: 3, bgcolor: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Payment sx={{ mr: 1, color: '#FFD700' }} />
          Recent Transactions
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#FFD700' }} />
        <Typography sx={{ color: '#AAAAAA' }}>
          Transaction data visualization would appear here
        </Typography>
      </Paper>
    </Box>
  );
}
