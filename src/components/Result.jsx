import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';

const ViewLiveResultPage = () => {
  const [parties, setParties] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('http://localhost:5000/parties/ViewResults');
      if (response.ok) {
        const data = await response.json();
        setParties(data.parties);
        // Calculate the total vote count
        const totalVotesCount = data.parties.reduce((acc, party) => acc + party.VoteCount, 0);
        setTotalVotes(totalVotesCount);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 2,
      backgroundImage:`linear-gradient(to bottom, #ff9933, #ffffff, #138808)`,
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
        backgroundImage: `url('src/assets/government.png')`, // Replace with your image path
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.2, // Adjust opacity as needed
        zIndex: 1,
      }} />
      <Box sx={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, padding: 3, maxWidth: 1200, marginLeft: '9%', marginRight: '9%' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#000080', fontWeight: 'bold', textAlign: 'center' }}>
          Overall Vote Count: {totalVotes}
        </Typography>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ff9933' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Vote Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party._id}>
                <TableCell style={{ textAlign: 'center' }}>{party.partyName}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{party.partySymbol}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{party.VoteCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default ViewLiveResultPage;