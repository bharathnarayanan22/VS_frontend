import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const EditPartyForm = ({ party, onUpdate }) => {
  const [partyName, setPartyName] = useState(party.partyName);
  const [partyLeader, setPartyLeader] = useState(party.partyLeader);
  const [partySymbol, setPartySymbol] = useState(party.partySymbol);

  const handleUpdateParty = async () => {
    try {
      const response = await fetch(`https://vs-backend-fh1x.onrender.com/parties/${party._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partyName,
          partyLeader,
          partySymbol,
        }),
      });

      if (response.ok) {
        const updatedParty = await response.json();
        onUpdate(updatedParty);
        console.log('Party updated successfully');
      } else {
        console.error('Failed to update party:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h5" gutterBottom>
        Edit Party
      </Typography>
      <TextField
        label="Party Name"
        variant="outlined"
        fullWidth
        value={partyName}
        onChange={(e) => setPartyName(e.target.value)}
        margin="normal"
        required={true}
      />
      <TextField
        label="Party Leader"
        variant="outlined"
        fullWidth
        value={partyLeader}
        onChange={(e) => setPartyLeader(e.target.value)}
        margin="normal"
        required={true}
      />
      <TextField
        label="Party Symbol"
        variant="outlined"
        fullWidth
        value={partySymbol}
        onChange={(e) => setPartySymbol(e.target.value)}
        margin="normal"
        required={true}
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdateParty}>
          Update Party
        </Button>
      </Box>
    </Box>
  );
};

export default EditPartyForm;
