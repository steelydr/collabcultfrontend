import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Box, Card, CardContent, Typography, Button, TextField, Snackbar, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { FaInstagram, FaYoutube } from "react-icons/fa";
import Sentiment from 'sentiment';

import ShapesBackground from './ShapesBackground';
import PostCard from './PostCard';
import config, { SECRET_KEY } from './config';

const sentiment = new Sentiment();

const analyzeContent = (content) => {
  const result = sentiment.analyze(content);
  return result.score < -5;
};

const CollabHomeComponent = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [deleteAnimation, setDeleteAnimation] = useState({ postId: null, active: false });
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  const handleRegisterLogin = () => {
    navigate('/register');
  };
   const handlecommunitypage =()=>{
    navigate('/cc');
   };

  const handleCreatePost = async () => {
    if (newPost.trim() && userData) {
      setIsLoading(true);
      const post = {
        content: newPost,
        user_id: userData.id,
        image: null,
        createdDate: new Date().toISOString(),
      };

      try {
        const response = await axios.post(`${config.BACKEND_URL}/api/posts`, post);
        const createdPost = response.data.post;

        if (!createdPost.id) {
          console.error('Post ID is missing from the created post object');
          setSnackbar({ open: true, message: 'Failed to create post due to missing post ID', severity: 'error' });
          setIsLoading(false);
          return;
        }

        setNewPost('');
        setSnackbar({ open: true, message: 'Post created successfully', severity: 'success' });

        if (analyzeContent(createdPost.content)) {
          setSnackbar({
            open: true,
            message: 'Our community does not encourage such posts.',
            severity: 'warning'
          });

          setTimeout(async () => {
            try {
              await axios.delete(`${config.BACKEND_URL}/api/posts/${createdPost.id}`);
              setSnackbar({ open: true, message: 'Post deleted due to negative sentiment', severity: 'warning' });
            } catch (error) {
              console.error('Error deleting post:', error);
              setSnackbar({ open: true, message: 'Failed to delete post after analysis', severity: 'error' });
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Error creating post:', error.response ? error.response.data : error.message);
        setSnackbar({ open: true, message: 'Failed to create post', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    setDeleteAnimation({ postId, active: true });

    setTimeout(async () => {
      setIsLoading(true);
      try {
        await axios.delete(`${config.BACKEND_URL}/api/posts/${postId}`);
        setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
      } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message);
        setSnackbar({ open: true, message: 'Failed to delete post', severity: 'error' });
      } finally {
        setIsLoading(false);
        setDeleteAnimation({ postId: null, active: false });
      }
    }, 500);
  };

  const handleUpdatePost = async (postId, newContent) => {
    const maxRetries = 3;
    let attempts = 0;
    const retryDelay = 1000;

    setIsLoading(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (attempts < maxRetries) {
      try {
        const response = await axios.put(`${config.BACKEND_URL}/api/posts/${postId}`,
          { content: newContent }, { timeout: 5000 });

        if (response.data && response.data.message) {
          setSnackbar({ open: true, message: response.data.message, severity: 'success' });
          break;
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        attempts += 1;
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.warn(`Retrying attempt ${attempts} due to timeout...`);
          await delay(retryDelay);
        } else {
          console.error('Error updating post:', error);
          setSnackbar({ open: true, message: `Failed to update post: ${error.message}`, severity: 'error' });
          break;
        }
      }
    }

    if (attempts === maxRetries) {
      setSnackbar({ open: true, message: 'Failed to update post please retry or wait.', severity: 'error' });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/posts`);
        let data = response.data;
        console.log(data);
        if (Array.isArray(data)) {
          data = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          setPosts(data);
        } else if (data.posts) {
          data.posts = data.posts.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setSnackbar({ open: true, message: 'Failed to fetch posts', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    const encryptedData = localStorage.getItem('user');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUserData(decryptedData);
      } catch (error) {
        console.error('Error decrypting user data:', error);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }

    eventSourceRef.current = new EventSource(`${config.BACKEND_URL}/api/posts/stream`);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleSSEEvent(data);
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSourceRef.current.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSSEEvent = (data) => {
    switch (data.type) {
      case 'post-create':
        setPosts((prevPosts) => [data.post, ...prevPosts]);
        break;
      case 'post-update':
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === data.post.id ? data.post : post))
        );
        break;
      case 'post-delete':
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== data.post.id));
        break;
      default:
        console.log('Unhandled event type:', data.type);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <ShapesBackground />
      <Title>CONNECT CREATE CONQUER</Title>
      <PostsContainer>
      <CreatePostCard>
    <CardContent>
      <StyledTextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="What's on your mind?"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <StyledButton
          variant="contained"
          onClick={handleCreatePost}
          disabled={!newPost.trim() || !userData || isLoading} // Disable if there's no content or the user isn't logged in
        >
          {isLoading ? 'Posting...' : 'Post'}
        </StyledButton>
      </Box>
    </CardContent>
  </CreatePostCard>

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : posts.length > 0 ? (
          <>
            {(userData ? posts : posts.slice(0, 2)).map((post) => (
              <AnimatedPostCard
                key={post.id}
                isdeleting={deleteAnimation.postId === post.id && deleteAnimation.active ? 1 : 0}
              >
                <PostCard
                  post={post}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                  isLoading={isLoading}
                  isNegative={analyzeContent(post.content)}
                />
              </AnimatedPostCard>
            ))}
            {!userData && (
              <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                <StyledTypography>
                  To join our community click login
                </StyledTypography>
                <StyledButton
                  variant="contained"
                  onClick={handleRegisterLogin}
                  sx={{ mt: 2 }}
                >
                  Login
                </StyledButton>
                <StyledTypography sx={{ mt : 2}}>
                  To know more about our community journey Click join us!
                </StyledTypography>
                <StyledButton variant="contained" onClick={handlecommunitypage} sx={{ mt : 2}}>
                  Join Us
               </StyledButton>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No posts available
          </Typography>
        )}
      </PostsContainer>
     

      {!isLoading && (
        <Footer>
          <FooterContent>
            <FooterTitle>COLLABCULT COMMUNITY</FooterTitle>
            <FooterDescription>
              Join our community and collaborate to create innovative solutions. Share your thoughts, learn together, and conquer challenges with us!
            </FooterDescription>
            <SocialIcons>
              <a href="https://www.instagram.com/collab._cult_/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/@vamshivk" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </SocialIcons>
            <FooterLink href="mailto:vamshivk873@gmail.com">Send us a message</FooterLink>
          </FooterContent>
          <Copyright>
            © {new Date().getFullYear()} CollabCult. All rights reserved.
          </Copyright>
        </Footer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

// Styled Components
const Title = styled(Typography)({
  fontSize: '38px',
  fontWeight: 'bold',
  color: '#21CBF3',
  textAlign: 'center',
  marginTop: '100px',
  marginBottom: '0px',
  letterSpacing: '2px',
});

const PostsContainer = styled(Box)({
  marginTop: '10px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '600px',
  boxSizing:'border-box',
  margin: '10px auto 0',
});

const CreatePostCard = styled(Card)({
  width: '100%',
  marginBottom: '20px',
  borderRadius: '8px',
  backgroundColor: '#1a1a1a',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#4d4d4d',
    },
    '&:hover fieldset': {
      borderColor: '#6d6d6d',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8d8d8d',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
});

const StyledTypography = styled(Typography)({
  fontSize: '16px',
  fontWeight: '400',
  color: '#21CBF3',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  backgroundColor: '#21CBF3',
  '&:hover': {
    backgroundColor: '#1BA0CC',
  },
});

const fadeOutAndShrink = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const AnimatedPostCard = styled(Box)(({ isdeleting }) => ({
  width: '100%',
  transition: 'all 0.3s ease-in-out',
  animation: isdeleting === 1 ? `${fadeOutAndShrink} 0.5s ease-in-out forwards` : 'none',
}));

const Footer = styled(Box)({
  width: '100%',
  backgroundColor: 'black',
  color: '#f5f5f5',
  padding: '40px 20px',
  marginTop: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const FooterContent = styled(Box)({
  maxWidth: '1200px',
  textAlign: 'center',
  marginBottom: '20px',
});

const FooterTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#21CBF3',
  marginBottom: '20px',
});

const FooterDescription = styled(Typography)({
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#d3d3d3',
  marginBottom: '30px',
  maxWidth: '600px',
});

const SocialIcons = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
  '& a': {
    color: '#21CBF3',
    fontSize: '36px',
    margin: '0 15px',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#1BA0CC',
    },
  },
});

const FooterLink = styled('a')({
  color: '#21CBF3',
  textDecoration: 'none',
  fontSize: '16px',
  marginTop: '20px',
  '&:hover': {
    color: '#1BA0CC',
  },
});

const Copyright = styled(Typography)({
  fontSize: '14px',
  color: '#d3d3d3',
  marginTop: '20px',
});

export default CollabHomeComponent;
