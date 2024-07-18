import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Box } from '@mui/material';
import img from '../assets/government.png'; 
const ViewVoterPage = () => {
  const [parties, setParties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('https://vs-backend-fh1x.onrender.com/parties');
      if (response.ok) {
        const data = await response.json();
        setParties(data.parties);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const handleVote = async (partyId) => {
    try {
      const response = await fetch(`https://vs-backend-fh1x.onrender.com/voters/vote/${partyId}`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedParty = await response.json();
        console.log('Voted successfully', updatedParty);

        // Update state with the new vote count
        setParties((prevParties) =>
          prevParties.map((party) =>
            party._id === partyId ? { ...party, VoteCount: updatedParty.VoteCount } : party
          )
        );

        navigate('/voterVerification');
      } else {
        console.error('Failed to vote:', response.statusText);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      // alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      backgroundImage: `linear-gradient(to bottom, #ff9933, #ffffff, #138808)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        height: '80%',
        backgroundImage: `url(${img})`, // Replace with your image path
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.2, // Adjust opacity as needed
        zIndex: 1,
      }} />
      <Box sx={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, padding: 3, maxWidth: '80%', marginLeft: '9%', marginRight: '9%'}}>
        <Typography variant="h4" gutterBottom style={{ color: '#000080', fontWeight: 'bold', textAlign: 'center' }}>
          Vote for Your Preferred Party
        </Typography>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ff9933' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party._id}>
                <TableCell style={{ textAlign: 'center' }}>{party.partyName}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{party.partySymbol}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ff9933',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#138808',
                      },
                    }}
                    onClick={() => handleVote(party._id)}
                  >
                    Vote
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default ViewVoterPage;