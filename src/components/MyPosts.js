import React, { useCallback, useState, useEffect, lazy, Suspense } from 'react';
import { Box, Typography, Avatar, Grid, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from './config';

// Lazy load components
const ShapesBackground = lazy(() => import('./ShapesBackground'));
const UserPostsOverlay = lazy(() => import('./UserPostsOverlay'));

// Styled Components
const StyledPostCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'black',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
}));

const StyledPostContent = styled(CardContent)(({ theme }) => ({
  padding: '16px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  lineHeight: '1.6',
  height: '165px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
    minHeight: '130px',
  },
}));

const StyledPostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '12px',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '8px',
  },
}));

const StyledPostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #444',
  padding: '10px 16px',
  [theme.breakpoints.down('sm')]: {
    padding: '8px 12px',
  },
}));

const StyledActionButton = styled(Button)(({ theme }) => ({
  color: '#b0b0b0',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: '4px 8px',
  },
}));

const StyledPostText = styled(Typography)(({ theme }) => ({
  color: '#fff',
  marginBottom: '16px',
  fontSize: '1rem',
  lineHeight: '1.7',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
}));

const StyledDateText = styled(Typography)(({ theme }) => ({
  color: '#888',
  fontSize: '0.8rem',
  marginTop: '2px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
  },
}));

const StyledUserName = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontWeight: 'normal',
  fontSize: '32px',
  marginLeft: '12px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    marginLeft: '8px',
  },
}));

const StyledShowMoreButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#21CBF3',
  textTransform: 'none',
  padding: '8px',
  borderRadius: '0 0 12px 12px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: '6px',
  },
}));

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'transparent',
    }}
  >
    <CircularProgress sx={{ color: '#21CBF3' }} />
  </Box>
);

const MyPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const encryptedData = localStorage.getItem('user');
      if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const userId = decryptedData.id;
        setCurrentUser(decryptedData);
        
        const response = await axios.get(`http://localhost:80/api/users/${userId}`, {
          headers: { Accept: 'application/json' },
        });
        console.log(response.data)
        
        if (response.data.user.profilePictureType) {
          setUserProfilePicture(response.data.user.profilePictureType);
          setUsername(response.data.user.username);
        }

        if (response.data && response.data.user.posts) {
          setUserPosts(response.data.user.posts);
        } else {
          setErrorMessage('No posts found for this user.');
        }
      } else {
        setErrorMessage('No user data found.');
      }
    } catch (error) {
      setErrorMessage('Error fetching user posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleLike = useCallback((postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const handleOpenModal = useCallback((post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPost(null);
  }, []);

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <LoadingSpinner />
        <Suspense fallback={<CircularProgress />}>
          <ShapesBackground />
        </Suspense>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: 'transparent',
        overflow: 'hidden',
        padding: { xs: '20px 10px', sm: '30px 15px', md: '40px 20px' },
        margin: { xs: '0', sm: '0 20px', md: '0 50px', lg: '0 150px' },
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <ShapesBackground />
      </Suspense>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: { xs: '20px', sm: '30px', md: '40px' },
          gap: '15px',
        }}
      >
        <Avatar
          src={userProfilePicture}
          alt="Profile"
          loading="lazy"
          sx={{
            width: { xs: 70, sm: 80, md: 100 },
            height: { xs: 70, sm: 80, md: 100 },
            border: '2px solid white',
            textAlign: 'center',
          }}
        />
        <StyledUserName variant="h2">{username}</StyledUserName>
      </Box>
      {errorMessage ? (
        <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>
          {errorMessage}
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {userPosts.map((post) => (
            <Grid item xs={12} sm={6} md={6} key={post.id}>
              <StyledPostCard>
                <StyledPostContent onClick={() => handleOpenModal(post)}>
                  <StyledPostHeader>
                    <Avatar
                      src={userProfilePicture}
                      alt="Profile"
                      loading="lazy"
                      sx={{ width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}
                    />
                    <Box sx={{ marginLeft: { xs: '6px', sm: '6px' } }}>
                      <StyledUserName variant="subtitle1" sx={{fontSize:'16px'}}>{username}</StyledUserName>
                      <StyledDateText>{new Date(post.createdDate).toLocaleString()}</StyledDateText>
                    </Box>
                  </StyledPostHeader>
                  <StyledPostText variant="body1">
                    {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                  </StyledPostText>
                  {post.content.length > 150 && (
                    <StyledShowMoreButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(post);
                      }}
                      endIcon={<ExpandMoreIcon />}
                    >
                      Show More
                    </StyledShowMoreButton>
                  )}
                </StyledPostContent>
                <StyledPostActions>
                  <StyledActionButton
                    startIcon={likedPosts.includes(post.id) ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                  >
                    Like
                  </StyledActionButton>
                  <StyledActionButton startIcon={<ChatBubbleOutlineIcon />} onClick={(e) => e.stopPropagation()}>
                    Comment
                  </StyledActionButton>
                  <StyledActionButton startIcon={<ShareIcon />} onClick={(e) => e.stopPropagation()}>
                    Share
                  </StyledActionButton>
                </StyledPostActions>
              </StyledPostCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <UserPostsOverlay
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
          username={username}
          userProfilePicture={userProfilePicture}
          likedPosts={likedPosts}
          onLike={handleLike}
          currentUser={currentUser} 
        />
      </Suspense>
    </Box>
  );
};

export default MyPosts;