import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Skeleton } from '@mui/material';
import img from '../assets/government.png'; // Adjust this path if necessary

const ViewLiveResultPage = () => {
  const [parties, setParties] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('https://vs-backend-fh1x.onrender.com/parties/ViewResults');
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
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
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
        backgroundImage: `url(${img})`, // Replace with your image path
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
            {loading ? (
              // Display Skeletons while loading
              <>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              parties.map((party) => (
                <TableRow key={party._id}>
                  <TableCell style={{ textAlign: 'center' }}>{party.partyName}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{party.partySymbol}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{party.VoteCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default ViewLiveResultPage;
