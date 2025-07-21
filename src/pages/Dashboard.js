// React and Material UI component imports for layout and styling
import React from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button,
  Divider, Avatar, LinearProgress
} from '@mui/material';

// Icon imports for visual representation in cards and headers
import {
  Assignment, DirectionsCar, Payment, Warning, CheckCircle
} from '@mui/icons-material';

// Dashboard Component Start
export default function Dashboard() {
    // Simulated drivers awaiting approval
  const pendingDrivers = [
    { id: 1, name: 'John Doe', daysPending: 2 },
    { id: 2, name: 'Jane Smith', daysPending: 1 },
    { id: 3, name: 'Mike Johnson', daysPending: 3 }
  ];

  // Sample jobs with progress status
  const recentJobs = [
    { id: 1, driver: 'Sam Wilson', status: 'In Transit', progress: 65 },
    { id: 2, driver: 'Alex Morgan', status: 'Pickup', progress: 20 },
    { id: 3, driver: 'Taylor Swift', status: 'Delivered', progress: 100 }
  ];

  // Statistical data for dashboard cards
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
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f'}} />
        <List>
          {pendingDrivers.map(driver => (
            <ListItem key={driver.id} sx={{
              mb: 1, bgcolor: '#000', borderRadius: 1,
              background: '#fefefefe', border: '1px solid #c5a34f'
            }}
              secondaryAction={
                <Button size="small" variant="outlined" sx={{
                  color: '#c5a34f', borderColor: '#c5a34f',
                  background: '#fefefefe'
                }}>
                  Review
                </Button>
              }>
              <ListItemText
                primary={driver.name}
                secondary={`Pending for ${driver.daysPending} day(s)`}
                primaryTypographyProps={{ style: { color: '#c5a34f' } }}
                secondaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          ))}
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
              <Typography variant="body1" fontWeight="bold" color="#c5a34f">
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
