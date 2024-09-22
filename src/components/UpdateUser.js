import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import AvatarEditor from 'react-avatar-editor';
import config, { SECRET_KEY } from './config';
import { styled } from '@mui/material/styles';
import {
  CircularProgress,
  Snackbar,
  Button,
  TextField,
  Box,
  Grid,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from '@mui/material';
import ShapesBackground from './ShapesBackground';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    gender: 'Male', // Default value set to Male
    address: '',
    headline: '',
    summary: '',
    profilePictureType: '',
  });

  const [editorOpen, setEditorOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [ , setAvatarImage] = useState('');
  const [zoom, setZoom] = useState(1);
  const avatarEditorRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setSnackbarMessage('Logged out successfully');
    setSnackbarOpen(true);
    navigate('/register');  // Adjust this path as needed
  };

  const predefinedSkills = [
    'Dialogue Writer',
    'Director',
    'Cinematography',
    'Film Editing',
    'Sound Design',
    'Acting',
    'Singer',
    'Producing',
    'VFX (Visual Effects)',
    'SFX (Special Effects)',
    'Music Composition',
    'Post-Production',
  ];

  const fetchUserDetails = useCallback(async () => {
    try {
      const encryptedData = localStorage.getItem('user');
      if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const userId = decryptedData.id;

        const response = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.status === 200) {
          setUserDetails(response.data);
          setEditedDetails({
            name: response.data.user.name || '',
            gender: response.data.user.gender || 'Male', // Default to Male if gender is not available
            address: response.data.user.address || '',
            headline: response.data.user.headline || '',
            summary: response.data.user.summary || '',
            profilePictureType: response.data.user.profilePictureType || '',
          });
        } else {
          throw new Error('Failed to fetch user details');
        }
      } else {
        throw new Error('No user data found. Please log in.');
      }
    } catch (error) {
      setError(error.message || 'Error loading user data. Please try logging in again.');
      setSnackbarMessage('Error fetching user details');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const encryptedData = localStorage.getItem('user');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        fetchUserDetails();
      } catch (error) {
        setError('Error loading user data. Please try logging in again.');
        setSnackbarMessage('Error loading user data');
        setSnackbarOpen(true);
        setLoading(false);
      }
    } else {
      setError('No user data found. Please log in.');
      setSnackbarMessage('No user data found');
      setSnackbarOpen(true);
      setLoading(false);
    }
  }, [fetchUserDetails]);

  const handleUpdateUser = async () => {
    try {
      setIsSaving(true); // Set saving state to true when save starts
      const encryptedData = localStorage.getItem('user');
      if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const userId = decryptedData.id;

        const response = await axios.put(`${config.BACKEND_URL}/api/users/${userId}`, editedDetails, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setSnackbarMessage('User details updated successfully');
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            user: {
              ...prevDetails.user,
              ...editedDetails,
            },
          }));
          setIsEditing(false); // Exit editing mode
        } else {
          throw new Error('Failed to update user details');
        }
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setSnackbarMessage(`Error updating user details: ${error.response?.data?.message || error.message}`);
    } finally {
      setSnackbarOpen(true);
      setIsSaving(false); // Stop saving state after operation completes
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (field) => (event) => {
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: event.target.value,
    }));
  };

  const handleOpenEditor = () => {
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
  };

  const handleSaveAvatar = () => {
    if (avatarEditorRef.current) {
      const canvas = avatarEditorRef.current.getImageScaledToCanvas().toDataURL();
      setAvatarImage(canvas);
      setAvatarChanged(true);
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        profilePictureType: canvas,
      }));
    }
    setEditorOpen(false);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setAvatarChanged(true);
    }
  };

  return (
    <>
      <ShapesBackground />
      <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)', backgroundColor: 'transparent' }}>
        <Container>
          <ConcisePaper elevation={3}>
            <Header>{userDetails?.user?.username}
            </Header>
            {loading ? (
              <LoadingContainer>
                <CircularProgress sx={{ color: '#21CBF3' }} />
                <LoadingText>Loading user details...</LoadingText>
              </LoadingContainer>
            ) : error ? (
              <ErrorText>{error}</ErrorText>
            ) : userDetails ? (
              <>
                {editedDetails.profilePictureType && (
                  <Grid container justifyContent="center">
                    <img
                      src={editedDetails.profilePictureType}
                      alt="User Avatar"
                      style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
                    />
                  </Grid>
                )}
                <Grid container justifyContent="center" sx={{ mb: 4 }}>
                  <Button variant="outlined" component="label" onClick={handleOpenEditor}>
                    Upload Avatar
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                </Grid>
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
                        <Select
                          value={editedDetails.gender}
                          onChange={handleInputChange('gender')}
                          fullWidth
                          sx={{
                            color: '#E1E9EE',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(225, 233, 238, 0.3)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21CBF3',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21CBF3',
                            },
                            '.MuiSvgIcon-root': {
                              color: '#E1E9EE',
                            },
                            '.MuiSelect-select': {
                              color: '#E1E9EE',
                            },
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      ) : (
                        <Value>{userDetails.user.gender || 'Male'}</Value>
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
                        <Select
                        value={editedDetails.headline}
                        onChange={handleInputChange('headline')}
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: '#E1E9EE',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(225, 233, 238, 0.3)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#21CBF3',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#21CBF3',
                          },
                          '.MuiSvgIcon-root': {
                            color: '#E1E9EE',
                          },
                          '.MuiSelect-select': {
                            color: '#E1E9EE',
                          },
                        }}
                      >
                        {predefinedSkills.map((skill) => (
                          <MenuItem key={skill} value={skill}>
                            {skill}
                          </MenuItem>
                        ))}
                      </Select>
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
              </>
            ) : (
              <ErrorText>No user details available.</ErrorText>
            )}
            <ButtonContainer>
              {isEditing || avatarChanged ? (
                <>
                  {!isSaving && (
                    <>
                      <StyledButton onClick={handleUpdateUser} variant="contained" color="primary">
                        Save Changes
                      </StyledButton>
                      <StyledButton
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarChanged(false);
                        }}
                        variant="outlined"
                        color="secondary"
                      >
                        Cancel
                      </StyledButton>
                    </>
                  )}
                </>
              ) : (
                <StyledButton onClick={() => setIsEditing(true)} variant="contained" color="primary">
                  Edit Profile
                </StyledButton>
              )}
            </ButtonContainer>
            <LogoutButtonContainer>
              <LogoutButton onClick={handleLogout} variant="outlined">
                <CiLogout size={20} />
                Logout
              </LogoutButton>
            </LogoutButtonContainer>
          </ConcisePaper>
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} message={snackbarMessage} />

      {/* Avatar Editor Dialog */}
      <Dialog open={editorOpen} onClose={handleCloseEditor}>
        <DialogTitle>Edit Avatar</DialogTitle>
        <DialogContent>
          {image && (
            <AvatarEditor
              ref={avatarEditorRef}
              image={image}
              width={200}
              height={200}
              border={50}
              borderRadius={100}
              scale={zoom}
              rotate={0}
            />
          )}
          <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, value) => setZoom(value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveAvatar} color="primary">
            Save Avatar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const LogoutButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
});

const LogoutButton = styled(Button)({
  color: '#ff6b6b',
  borderColor: '#ff6b6b',
  backgroundColor: 'transparent',
  borderRadius: '20px',
  padding: '8px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#ff6b6b',
  },
});

const Container = styled(Box)({
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
});

const ConcisePaper = styled(Box)({
  padding: '30px',
  backgroundColor: '#121212',
  borderRadius: '15px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
});

const Header = styled('h2')({
  color: 'white',
  textAlign: 'center',
  marginBottom: '30px',
  fontSize: '28px',
  fontWeight: 'bold',
  textShadow: '0 0 5px rgba(33, 203, 243, 0.5)',
});

const LoadingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '400px',
});

const LoadingText = styled('p')({
  color: '#21CBF3',
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '18px',
});

const ErrorText = styled('p')({
  color: '#ff6b6b',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '18px',
});

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

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '30px',
  gap: '15px',
});

const StyledButton = styled(Button)({
  padding: '10px 25px',
  fontSize: '14px',
  borderRadius: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  transition: 'all 0.3s ease',
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#21CBF3',
    '&:hover': {
      backgroundColor: '#1da7e3',
      boxShadow: '0 0 10px rgba(33, 203, 243, 0.4)',
    },
  },
  '&.MuiButton-outlinedSecondary': {
    borderColor: '#21CBF3',
    color: '#21CBF3',
    '&:hover': {
      backgroundColor: 'rgba(33, 203, 243, 0.1)',
    },
  },
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

export default UpdateUser;
