import React, { useState, Suspense, lazy, useEffect, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useTrie } from '../lib/useTrie';

import { Helmet } from 'react-helmet';
import config from './config';

const MdSearch = lazy(() => import('react-icons/md').then((module) => ({ default: module.MdSearch })));
const MdEditNote = lazy(() => import('react-icons/md').then((module) => ({ default: module.MdEditNote })));
const IoSettingsOutline = lazy(() => import('react-icons/io5').then((module) => ({ default: module.IoSettingsOutline })));
const AiFillHome = lazy(() => import('react-icons/ai').then((module) => ({ default: module.AiFillHome })));
const FaUser = lazy(() => import('react-icons/fa').then((module) => ({ default: module.FaUser })));

const UpdateUser = lazy(() => import('./UpdateUser'));
const MyPosts = lazy(() => import('./MyPosts'));
const CollabHomeComponent = lazy(() => import('./CollabHomeComponent'));
const CollabCultUsersList = lazy(() => import('./CollabCultUsersList'));
const UserDrawer = lazy(() => import('./UserDrawer'));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: 300,
  [theme.breakpoints.down('sm')]: {
    width : 80, 
  },
  [theme.breakpoints.between('sm', 'md')]: {
    maxWidth: '350px', 
  },
  '& .MuiInputBase-root': {
    color: '#ffffff',
    '&::before': {
      borderBottomColor: 'rgba(255, 255, 255, 0.7)',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottomColor: '#ffffff',
    },
    '&::after': {
      borderBottomColor: '#21CBF3',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: 'black',
  },
  '& .MuiAutocomplete-clearIndicator': {
    color: '#ffffff',
  },
  '& .MuiAutocomplete-popper': {
    backgroundColor: 'black',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
}));

const CustomListItem = styled('li')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '8px',
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiAvatar-root': {
    marginRight: '12px',
  },
  '& strong': {
    color: 'black',
    fontWeight: 500,
    fontSize: '0.9em',
    fontStyle: 'normal',
  },
  '& div': {
    color: 'black',
    fontStyle: 'italic',
  },
}));

const CollabCultPage = () => {
  const [activeComponent, setActiveComponent] = useState('home');
  const [inputValue, setInputValue] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const userItem = localStorage.getItem('user');
    setIsUserLoggedIn(!!userItem);

    if (userItem) {
      setActiveComponent(sessionStorage.getItem('activeComponent') || 'home');
      setInputValue(sessionStorage.getItem('searchInputValue') || '');
      const savedUser = sessionStorage.getItem('selectedUser');
      setSelectedUser(savedUser ? JSON.parse(savedUser) : null);
    }
  }, []);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/users/userDetails`);
        if (Array.isArray(response.data.userDetails)) {
          const suggestionsWithIds = response.data.userDetails.map((user, index) => ({
            ...user,
            id: `${user.name || 'unknown'}-${index}`,
          }));
          setUserSuggestions(suggestionsWithIds);
        } else {
          console.error('API response is not an array:', response.data);
          setUserSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching user suggestions:', error);
        setUserSuggestions([]);
      }
    };

    if (isUserLoggedIn) {
      fetchUserSuggestions();
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (isUserLoggedIn) {
      sessionStorage.setItem('activeComponent', activeComponent);
      sessionStorage.setItem('searchInputValue', inputValue);
      if (selectedUser) {
        sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser));
      } else {
        sessionStorage.removeItem('selectedUser');
      }
    }
  }, [activeComponent, inputValue, selectedUser, isUserLoggedIn]);

  const handleViewChange = useCallback(
    (view) => {
      if (isUserLoggedIn) {
        setActiveComponent(view);
        if (view !== 'userDetails') {
          setSelectedUser(null);
          setInputValue('');
        }
      }
    },
    [isUserLoggedIn]
  );

  const handleInputChange = useCallback(
    (event, newInputValue) => {
      if (isUserLoggedIn) {
        setInputValue(newInputValue);
        if (newInputValue === '') {
          setActiveComponent('home');
          setSelectedUser(null);
        }
      }
    },
    [isUserLoggedIn]
  );

  const handleUserSelect = useCallback(
    (event, newValue) => {
      if (isUserLoggedIn) {
        setSelectedUser(newValue);
        if (newValue) {
          setActiveComponent('userDetails');
          setInputValue(newValue.name || '');
        }
      }
    },
    [isUserLoggedIn]
  );

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('activeComponent');
    sessionStorage.removeItem('searchInputValue');
    sessionStorage.removeItem('selectedUser');
    setIsUserLoggedIn(false);
    setActiveComponent('home');
    setSelectedUser(null);
    setInputValue('');
    setIsDrawerOpen(false);
  };

  const { filteredSuggestions } = useTrie(userSuggestions, inputValue);

  return (
    <>
      <Helmet>
        <title>{activeComponent === 'editProfile' ? 'Edit Profile - CollabCult' : 'CollabCult'}</title>
        <meta
          name="description"
          content="Connect, collaborate, and create with like-minded professionals on CollabCult."
        />
      </Helmet>
      <div>
        <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: isMobile ? '16px' : '250px',
              paddingRight: isMobile ? '16px' : '250px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://collabcultimages.blob.core.windows.net/logo/whitelogo.png?sp=r&st=2024-08-27T14:33:14Z&se=2030-08-27T22:33:14Z&sv=2022-11-02&sr=b&sig=%2Bs5heSUazhVROgtN4Pz2EhGlGUdYS5ULxkMb0h9fpgY%3D"
                alt="CollabCult Logo"
                style={{ height: '30px', width: 'auto', marginRight: '10px' }}
              />
              {isUserLoggedIn && (
                <Suspense fallback={<CircularProgress size={20} />}>
                  <StyledAutocomplete
                    freeSolo
                    options={filteredSuggestions}
                    getOptionLabel={(option) => (option && option.name) || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Search users..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <IconButton sx={{ color: 'white' }}>
                              <Suspense fallback={<CircularProgress size={20} />}>
                                <MdSearch />
                              </Suspense>
                            </IconButton>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <CustomListItem {...props} key={option.id}>
                        <StyledAvatar src={option.profilePictureType} alt={option.name} />
                        <div>
                          <strong>{option.name || 'Unknown'}</strong>
                          <br />
                          {option.headline || 'N/A'}
                        </div>
                      </CustomListItem>
                    )}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onChange={handleUserSelect}
                    value={selectedUser}
                  />
                </Suspense>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isUserLoggedIn && (
                <>
                  <IconButton
                    onClick={() => handleViewChange('home')}
                    sx={{
                      color: activeComponent === 'home' ? '#21CBF3' : '#FFFFFF',
                      marginRight: '20px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <Suspense fallback={<CircularProgress size={20} />}>
                      <AiFillHome size={24} />
                    </Suspense>
                  </IconButton>
                  <IconButton
                    onClick={() => handleViewChange('posts')}
                    sx={{
                      color: activeComponent === 'posts' ? '#21CBF3' : '#FFFFFF',
                      marginRight: '20px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <Suspense fallback={<CircularProgress size={20} />}>
                      <MdEditNote size={30} />
                    </Suspense>
                  </IconButton>
                  <IconButton
                    onClick={() => handleViewChange('editProfile')}
                    sx={{
                      color: activeComponent === 'editProfile' ? '#21CBF3' : '#FFFFFF',
                      marginRight: '20px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <Suspense fallback={<CircularProgress size={20} />}>
                      <IoSettingsOutline size={24} />
                    </Suspense>
                  </IconButton>
                  <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                      color: '#FFFFFF',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <Suspense fallback={<CircularProgress size={20} />}>
                      <FaUser size={24} />
                    </Suspense>
                  </IconButton>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Suspense fallback={<CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />}>
          {(!isUserLoggedIn || activeComponent === 'home') && <CollabHomeComponent />}
          {isUserLoggedIn && activeComponent === 'posts' && <MyPosts searchQuery={inputValue} />}
          {isUserLoggedIn && activeComponent === 'editProfile' && <UpdateUser />}
          {isUserLoggedIn && activeComponent === 'userDetails' && <CollabCultUsersList user={selectedUser} />}
        </Suspense>

        <Suspense fallback={<CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />}>
          <UserDrawer 
            open={isDrawerOpen} 
            onClose={handleDrawerToggle}
            onLogout={handleLogout}
          />
        </Suspense>
      </div>
    </>
  );
};

export default CollabCultPage;