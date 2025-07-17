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
  Notifications,
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
    <Box sx={{ p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome to Luba Deliveries Admin
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
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
              flex: '1 1 calc(33.333% - 24px)', // 3 per row with spacing
              minWidth: 280,
              p: 3,
              borderRadius: 2,
              boxSizing: 'border-box'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {card.icon}
              </Avatar>
              <Box>
                <Typography variant="h6">{card.title}</Typography>
              </Box>
            </Box>
            <Typography variant="h3" color="secondary.main">
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {card.subtitle}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Drivers Pending Approval */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Warning color="primary" sx={{ mr: 1 }} />
          Drivers Pending Approval
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {pendingDrivers.map(driver => (
            <ListItem
              key={driver.id}
              sx={{
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1
              }}
              secondaryAction={
                <Button size="small" variant="outlined" color="secondary">
                  Review
                </Button>
              }
            >
              <ListItemText
                primary={driver.name}
                secondary={`Pending for ${driver.daysPending} day(s)`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Active Jobs */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DirectionsCar color="primary" sx={{ mr: 1 }} />
          Active Jobs Status
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {recentJobs.map(job => (
            <ListItem
              key={job.id}
              sx={{
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography variant="body1" fontWeight="bold" color="secondary.main">
                {job.driver}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.status}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={job.progress}
                sx={{ width: '100%', height: 8, borderRadius: 4, mt: 1 }}
              />
              {job.progress === 100 && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CheckCircle color="success" sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="caption" color="success.main">Delivery completed</Typography>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Recent Transactions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Payment color="primary" sx={{ mr: 1 }} />
          Recent Transactions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography color="text.secondary">
          Transaction data visualization would appear here
        </Typography>
      </Paper>
    </Box>
  );
}
