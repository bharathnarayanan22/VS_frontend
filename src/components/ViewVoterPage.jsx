import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography, IconButton, Box, Skeleton } from '@mui/material';

const ViewVoterPage = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await fetch('https://vs-backend-fh1x.onrender.com/voters');
      if (response.ok) {
        const data = await response.json();
        setVoters(data.voters);
      } else {
        console.error('Failed to fetch voters:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching voters:', error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const handleDeleteVoter = async (voterId) => {
    try {
      const response = await fetch(`https://vs-backend-fh1x.onrender.com/voters/${voterId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted voter from the state
        setVoters(voters.filter(voter => voter._id !== voterId));
        console.log('Voter deleted successfully');
      } else {
        console.error('Failed to delete voter:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting voter:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ color: '#121481', fontWeight: 'bold' }}>
        Voters Registered
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="voters table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#138808' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Voter</TableCell>
              <TableCell align='right' style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Display Skeletons while loading
              <>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              voters.map((voter) => (
                <TableRow key={voter._id}>
                  <TableCell component="th" scope="row">
                    {voter.label}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDeleteVoter(voter._id)} style={{ color: '#FF9933' }} 
                      sx={{ '&:hover': { color: 'blue' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewVoterPage;
