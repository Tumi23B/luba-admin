import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button,
  Divider, Avatar, LinearProgress
} from '@mui/material';
import {
  Assignment, DirectionsCar, Payment, Warning, CheckCircle, People
} from '@mui/icons-material';
import { db } from '../firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newRegistrations, setNewRegistrations] = useState([]);
  const [statsCards, setStatsCards] = useState([
    { title: 'Drivers Pending Approval', value: 0, subtitle: 'Review and approve driver documents', icon: <Assignment /> },
    { title: 'Active Jobs', value: 0, subtitle: 'Track ongoing deliveries', icon: <DirectionsCar /> },
    { title: 'Transactions Today', value: 'R0', subtitle: 'Payments processed', icon: <Payment /> },
    { title: 'Completed Jobs', value: 0, subtitle: 'Successfully delivered', icon: <CheckCircle /> },
    { title: 'Warnings Issued', value: 0, subtitle: 'Driver violations', icon: <Warning /> },
    { title: 'New Registrations', value: 0, subtitle: 'Drivers joined today', icon: <People /> }
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pending drivers
    const driverApplicationsRef = query(
      ref(db, 'driverApplications'),
      orderByChild('status'),
      equalTo('Pending')
    );
    const unsubscribePending = onValue(driverApplicationsRef, (snapshot) => {
      const driversData = [];
      snapshot.forEach((childSnapshot) => {
        const driver = childSnapshot.val();
        const createdAt = new Date(driver.createdAt);
        const now = new Date();
        const diffDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));
        
        driversData.push({
          id: childSnapshot.key,
          name: driver.fullName,
          daysPending: diffDays,
          uid: childSnapshot.key
        });
      });
      setPendingDrivers(driversData);
      updateStatCard('Drivers Pending Approval', driversData.length);
    });

    // Fetch active jobs
    const activeJobsRef = query(
      ref(db, 'jobs'),
      orderByChild('status'),
      equalTo('active')
    );
    const unsubscribeActiveJobs = onValue(activeJobsRef, (snapshot) => {
      const jobsData = [];
      snapshot.forEach((childSnapshot) => {
        const job = childSnapshot.val();
        jobsData.push({
          id: childSnapshot.key,
          ...job,
          progress: calculateJobProgress(job)
        });
      });
      setActiveJobs(jobsData);
      updateStatCard('Active Jobs', jobsData.length);
    });

    // Fetch completed jobs
    const completedJobsRef = query(
      ref(db, 'jobs'),
      orderByChild('status'),
      equalTo('completed')
    );
    const unsubscribeCompletedJobs = onValue(completedJobsRef, (snapshot) => {
      const jobsData = [];
      snapshot.forEach((childSnapshot) => {
        jobsData.push(childSnapshot.val());
      });
      setCompletedJobs(jobsData);
      updateStatCard('Completed Jobs', jobsData.length);
    });

    // Fetch today's transactions
    const today = new Date().toISOString().split('T')[0];
    const transactionsRef = query(
      ref(db, 'transactions'),
      orderByChild('date'),
      equalTo(today)
    );
    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      let total = 0;
      const transactionsData = [];
      snapshot.forEach((childSnapshot) => {
        const transaction = childSnapshot.val();
        total += parseFloat(transaction.amount) || 0;
        transactionsData.push(transaction);
      });
      setTransactions(transactionsData);
      updateStatCard('Transactions Today', `R${total.toLocaleString()}`);
    });

    // Fetch new registrations (approved today)
    const newRegistrationsRef = query(
      ref(db, 'drivers'),
      orderByChild('approvedDate'),
      equalTo(new Date().toISOString().split('T')[0])
    );
    const unsubscribeNewRegistrations = onValue(newRegistrationsRef, (snapshot) => {
      const registrationsData = [];
      snapshot.forEach((childSnapshot) => {
        registrationsData.push(childSnapshot.val());
      });
      setNewRegistrations(registrationsData);
      updateStatCard('New Registrations', registrationsData.length);
    });

    // Cleanup all listeners
    return () => {
      unsubscribePending();
      unsubscribeActiveJobs();
      unsubscribeCompletedJobs();
      unsubscribeTransactions();
      unsubscribeNewRegistrations();
    };
  }, []);

  const calculateJobProgress = (job) => {
    // Implement your progress calculation logic based on job status
    if (job.status === 'completed') return 100;
    if (job.status === 'in-progress') return 50;
    if (job.status === 'assigned') return 20;
    return 0;
  };

  const updateStatCard = (title, value) => {
    setStatsCards(prevStats => 
      prevStats.map(card => 
        card.title === title ? { ...card, value } : card
      )
    );
  };

  const handleReviewClick = (driverUid) => {
    navigate(`/drivers/${driverUid}`);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fefefefe', color: '#c5a34f', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#b00000">
          Welcome to Luba Deliveries Admin
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#c5a34f' }}>
          Manage drivers, monitor jobs, view transactions, and keep your delivery business running smoothly.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between', mb: 5 }}>
        {statsCards.map((card, index) => (
          <Paper key={index} sx={{
            flex: '1 1 calc(33.333% - 24px)', minWidth: 280, p: 3,
            borderRadius: 2, backgroundColor: '#fefefefe',
            color: '#c5a34f', border: '1px solid #c5a34f'
          }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#c5a34f', color: '#000', mr: 2 }}>
                {card.icon}
              </Avatar>
              <Typography variant="h6" color="#c5a34f">{card.title}</Typography>
            </Box>
            <Typography variant="h3" color="#c5a34f" fontWeight="bold">
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#AAAAAA' }}>
              {card.subtitle}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Drivers Pending Approval */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: '#b80000' }} />
          Drivers Pending Approval ({pendingDrivers.length})
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
                    onClick={() => handleReviewClick(driver.uid)}
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

      {/* Active Jobs Status */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DirectionsCar sx={{ mr: 1, color: '#b80000' }} />
          Active Jobs Status ({activeJobs.length})
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f' }} />
        <List>
          {activeJobs.length > 0 ? (
            activeJobs.map(job => (
              <ListItem key={job.id} sx={{
                mb: 2, bgcolor: '#000', borderRadius: 1,
                flexDirection: 'column', background: '#fefefefe',
                alignItems: 'flex-start', border: '1px solid #c5a34f'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#b80000">
                  {job.driverName || 'Unassigned'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  {job.status}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={job.progress}
                  sx={{
                    width: '100%', height: 8, borderRadius: 4, mt: 1,
                    backgroundColor: '#444',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#c5a34f' }
                  }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No active jobs currently."
                primaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Recent Transactions */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Payment sx={{ mr: 1, color: '#b80000' }} />
          Recent Transactions
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f' }} />
        <List>
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((transaction, index) => (
              <ListItem key={index} sx={{
                mb: 1, bgcolor: '#000', borderRadius: 1,
                background: '#fefefefe', border: '1px solid #c5a34f'
              }}>
                <ListItemText
                  primary={`R${transaction.amount} - ${transaction.description}`}
                  secondary={`${transaction.date} • ${transaction.time}`}
                  primaryTypographyProps={{ style: { color: '#b80000' } }}
                  secondaryTypographyProps={{ style: { color: '#AAAAAA' } }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No transactions today."
                primaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* New Registrations */}
      <Paper sx={{ p: 3, bgcolor: '#fefefefe', color: '#b80000', border: '1px solid #c5a34f' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <People sx={{ mr: 1, color: '#b80000' }} />
          New Registrations ({newRegistrations.length})
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#c5a34f' }} />
        <List>
          {newRegistrations.length > 0 ? (
            newRegistrations.slice(0, 5).map((driver, index) => (
              <ListItem key={index} sx={{
                mb: 1, bgcolor: '#000', borderRadius: 1,
                background: '#fefefefe', border: '1px solid #c5a34f'
              }}>
                <ListItemText
                  primary={driver.fullName}
                  secondary={`Joined: ${driver.approvedDate}`}
                  primaryTypographyProps={{ style: { color: '#b80000' } }}
                  secondaryTypographyProps={{ style: { color: '#AAAAAA' } }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No new registrations today."
                primaryTypographyProps={{ style: { color: '#AAAAAA' } }}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}