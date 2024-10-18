import React from 'react';
import { Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const UserDetailsForm = ({ userDetails, editedDetails, handleInputChange, isEditing }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <DetailItem>
          <Label>Name</Label>
          {isEditing ? (
            <StyledTextField
              value={editedDetails.name}
              onChange={handleInputChange('name')}
              fullWidth
              variant="outlined"
            />
          ) : (
            <Value>{userDetails.user.name || 'N/A'}</Value>
          )}
        </DetailItem>

        <DetailItem>
          <Label>Email</Label>
          <Value>{userDetails.user.email || 'N/A'}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Phone Number</Label>
          <Value>{userDetails.user.phoneNumber || 'N/A'}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Gender</Label>
          {isEditing ? (
            <StyledTextField
              value={editedDetails.gender}
              onChange={handleInputChange('gender')}
              fullWidth
              variant="outlined"
            />
          ) : (
            <Value>{userDetails.user.gender || 'N/A'}</Value>
          )}
        </DetailItem>
      </Grid>

      <Grid item xs={12} md={6}>
        <DetailItem>
          <Label>Address</Label>
          {isEditing ? (
            <StyledTextField
              value={editedDetails.address}
              onChange={handleInputChange('address')}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
            />
          ) : (
            <Value>{userDetails.user.address || 'N/A'}</Value>
          )}
        </DetailItem>

        <DetailItem>
          <Label>Skills</Label>
          {isEditing ? (
            <StyledTextField
              value={editedDetails.headline}
              onChange={handleInputChange('headline')}
              fullWidth
              variant="outlined"
            />
          ) : (
            <Value>{userDetails.user.headline || 'N/A'}</Value>
          )}
        </DetailItem>

        <DetailItem>
          <Label>Summary</Label>
          {isEditing ? (
            <StyledTextField
              value={editedDetails.summary}
              onChange={handleInputChange('summary')}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          ) : (
            <Value>{userDetails.user.summary || 'N/A'}</Value>
          )}
        </DetailItem>
      </Grid>
    </Grid>
  );
};

export default UserDetailsForm;

// Styled components
const DetailItem = styled('div')({
  marginBottom: '20px',
});

const Label = styled('span')({
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#21CBF3',
  fontSize: '16px',
  textTransform: 'uppercase',
});

const Value = styled('span')({
  color: '#E1E9EE',
  fontSize: '18px',
  display: 'block',
  padding: '5px 0',
  borderBottom: '1px solid rgba(225, 233, 238, 0.2)',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#E1E9EE',
    '& fieldset': {
      borderColor: 'rgba(225, 233, 238, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#21CBF3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#21CBF3',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#21CBF3',
  },
});
