import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';

import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Jobs from './pages/Jobs';
import Bookings from './pages/Bookings';

export default function App() {
  return (
    <Router>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'secondary.main' }}>
            Luba Admin Panel
          </Typography>
          <Button color="secondary" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="secondary" component={Link} to="/drivers">
            Drivers
          </Button>
          <Button color="secondary" component={Link} to="/jobs">
            Jobs
          </Button>
          <Button color="secondary" component={Link} to="/bookings">
            Bookings
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, color: 'text.primary' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </Container>
    </Router>
  );
}
