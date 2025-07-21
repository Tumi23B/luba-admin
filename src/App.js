// This file is part of the Luba contians logic and stylyng for the Dashboard navigation
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  CssBaseline,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  styled,
  Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BookIcon from '@mui/icons-material/Book';

import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Jobs from './pages/Jobs';
import Bookings from './pages/Bookings';

// Custom styled components for consistent theming
const GoldButton = styled(Button)(({ theme }) => ({
  color: '#c5a34f',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  '&.Mui-selected': {
    fontWeight: 'bold',
    borderBottom: '2px solid #c5a34f'
  }
}));

// Navigation icon and its colors
const navItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon sx={{ color: '#b80000' }} /> },
  { name: 'Drivers', path: '/drivers', icon: <PeopleIcon sx={{ color: '#b80000' }} /> },
  { name: 'Jobs', path: '/jobs', icon: <WorkIcon sx={{ color: '#b80000' }} /> },
  { name: 'Bookings', path: '/bookings', icon: <BookIcon sx={{ color: '#b80000' }} /> },
];

function NavBar() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box 
      onClick={handleDrawerToggle}
      sx={{ 
        background: '#fefefefe',
        height: '100%',
        color: '#c5a34f'
      }}
    >
      <Typography variant="h6" sx={{ my: 2, p: 2, color: '#b80000' }}>
        Luba Admin
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.5)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                color: '#c5a34f',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  fontWeight: 'bold'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.3)'
                }
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: '#fefefefe',
          borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: '#c5a34f' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              letterSpacing: 1,
              color: '#c5a34f',
            }}
          >
            Luba Admin Panel
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <GoldButton
                  key={item.name}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid #c5a34f' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    },
                  }}
                >
                  {item.name}
                </GoldButton>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              background: '#fefefefe',
              color: '#c5a34f'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: '#fefefefe',
        color: '#c5a34f'
      }}>
        <NavBar />
        <Toolbar /> {/* Spacer for app bar */}
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            mt: 3,
            mb: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            color: '#FFFFFF'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            {/* New route for specific driver details */}
            <Route path="/drivers/:driverId" element={<Drivers />} /> 
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}