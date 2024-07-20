import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPartyForm from './EditPartyForm';

const ViewPartyPage = () => {
  const [parties, setParties] = useState([]);
  const [editingParty, setEditingParty] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

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
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const handleEditParty = (party) => {
    setEditingParty(party);
  };

  const handleDeleteParty = async (partyId) => {
    try {
      const response = await fetch(`https://vs-backend-fh1x.onrender.com/parties/${partyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setParties(parties.filter(party => party._id !== partyId));
        console.log('Party deleted successfully');
      } else {
        console.error('Failed to delete party:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting party:', error);
    }
  };

  const handleUpdateParty = (updatedParty) => {
    setParties(parties.map(party => party._id === updatedParty._id ? updatedParty : party));
    setEditingParty(null); // Close the edit form
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom style={{ color: '#121481', fontWeight: 'bold' }}>
        Parties Registered
      </Typography>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#138808' }}>
            <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Name</TableCell>
            <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Leader</TableCell>
            <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Symbol</TableCell>
            <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            // Display Skeletons while loading
            <>
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton variant="rectangular" width="100%" height={50} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton variant="rectangular" width="100%" height={50} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton variant="rectangular" width="100%" height={50} />
                </TableCell>
              </TableRow>
            </>
          ) : (
            parties.map((party) => (
              <TableRow key={party._id}>
                <TableCell>{party.partyName}</TableCell>
                <TableCell>{party.partyLeader}</TableCell>
                <TableCell>{party.partySymbol}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditParty(party)} style={{ color: '#FF9933' }} 
                    sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteParty(party._id)} style={{ color: '#FF9933' }} 
                    sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {editingParty && <EditPartyForm party={editingParty} onUpdate={handleUpdateParty} />}
    </div>
  );
};

export default ViewPartyPage;
