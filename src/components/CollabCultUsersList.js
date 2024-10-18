import React, { useState, lazy, Suspense, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Card, CardContent, CardActions, IconButton, Divider, CircularProgress, Button } from '@mui/material';
import { ThumbUpAltOutlined, ThumbUpAlt, ChatBubbleOutline, Share, PersonAdd, Check, Pending, Close } from '@mui/icons-material';
import ShapesBackground from './ShapesBackground';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import config,{ SECRET_KEY } from './config';

const UserPostsOverlay = lazy(() => import('./UserPostsOverlay'));

const PageWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: 'white',
  maxWidth: '800px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
}));

const UserHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'flex-start',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  marginRight: theme.spacing(3),
  border: '4px solid white',
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const PostCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const PostContent = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ActionText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledDivider = styled(Divider)({
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
});

const PostUserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(5),
  height: theme.spacing(5),
}));

const ConnectionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: 'white',
  borderColor: 'white',
}));

const CollabCultUsersList = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('not_connected');

  const fetchUserDetails = useCallback(async () => {
    try {
      const encryptedData = localStorage.getItem('user');
      if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const userId = decryptedData.id;
        setCurrentUser(decryptedData);
        
        const userResponse = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`, {
          headers: { Accept: 'application/json' },
        });
        
        if (userResponse.data.user.profilePictureType) {
          setCurrentUser(userResponse.data.user);
        }

        const connectionsResponse = await axios.get(`${config.BACKEND_URL}/api/connections/user/${userId}`);
        setConnections(connectionsResponse.data);

        const connection = connectionsResponse.data.find(conn => 
          (conn.user.id === user.id && conn.connectedUser.id === userId) || 
          (conn.user.id === userId && conn.connectedUser.id === user.id)
        );
        
        if (connection) {
          setConnectionStatus(connection.accepted ? 'accepted' : 'pending');
        } else {
          setConnectionStatus('not_connected');
        }

      } else {
        console.error('No user data found.');
      }
    } catch (error) {
      console.error('Error fetching user data.', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleLikePost = (postId) => {
    console.log(`Liked post with ID: ${postId}`);
    // Add logic to toggle like status and update UI accordingly
  };

  const handleSendConnectionRequest = async () => {
    try {
      await axios.post(`${config.BACKEND_URL}/api/connections/request`, null, {
        params: {
          userId: currentUser.id,
          connectedUserId: user.userid
        }
      });
      setConnectionStatus('pending');
      fetchUserDetails();
    } catch (error) {
      console.error('Error sending connection request', error);
    }
  };

  const handleAcceptConnection = async () => {
    try {
      await axios.put(`${config.BACKEND_URL}/api/connections/accept`, null, {
        params: {
          userId: currentUser.id,
          connectedUserId: user.userid
        }
      });
      setConnectionStatus('accepted');
      fetchUserDetails();
    } catch (error) {
      console.error('Error accepting connection request', error);
    }
  };

  const handleIgnoreConnection = async () => {
    try {
      await axios.delete(`${config.BACKEND_URL}/api/connections/ignore`, {
        params: {
          userId: currentUser.id,
          connectedUserId: user.userid
        }
      });
      setConnectionStatus('not_connected');
      fetchUserDetails();
    } catch (error) {
      console.error('Error ignoring connection request', error);
    }
  };

  const handleDeleteConnection = async () => {
    try {
      await axios.delete(`${config.BACKEND_URL}/api/connections/delete`, {
        params: {
          userId: currentUser.id,
          connectedUserId: user.userid
        }
      });
      setConnectionStatus('not_connected');
      fetchUserDetails();
    } catch (error) {
      console.error('Error deleting connection', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!user) return null;

  const renderConnectionButton = () => {
    switch (connectionStatus) {
      case 'not_connected':
        return (
          <ConnectionButton
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={handleSendConnectionRequest}
          >
            Connect
          </ConnectionButton>
        );
      case 'pending':
        const isPendingReceived = connections.some(conn => 
          conn.user.id === user.id && conn.connectedUser.id === currentUser.id && !conn.accepted
        );
        if (isPendingReceived) {
          return (
            <>
              <ConnectionButton
                variant="outlined"
                startIcon={<Check />}
                onClick={handleAcceptConnection}
                sx={{ marginRight: 1 }}
              >
                Accept
              </ConnectionButton>
              <ConnectionButton
                variant="outlined"
                startIcon={<Close />}
                onClick={handleIgnoreConnection}
              >
                Ignore
              </ConnectionButton>
            </>
          );
        } else {
          return (
            <ConnectionButton
              variant="outlined"
              startIcon={<Pending />}
              disabled
            >
              Request Sent
            </ConnectionButton>
          );
        }
      case 'accepted':
        return (
          <ConnectionButton
            variant="outlined"
            startIcon={<Close />}
            onClick={handleDeleteConnection}
          >
            Remove Connection
          </ConnectionButton>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ShapesBackground />
      <PageWrapper>
        <UserHeader>
          <UserAvatar
            src={user.profilePictureType}
            alt={user.name}
          >
            {(!user.profilePictureType || user.profilePictureType.startsWith('data:image')) ? user.name.charAt(0).toUpperCase() : null}
          </UserAvatar>
          <UserInfo>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color:'white'}}>
              {user.headline || ''}
            </Typography>
            <Typography variant="body1" color="white">
              {user.location || 'No location'} • {user.connections || '0'} connections
            </Typography>
            {renderConnectionButton()}
          </UserInfo>
        </UserHeader>

        {user.userposts && user.userposts.length > 0 ? (
          user.userposts.map((post, index) => (
            <PostCard key={index}>
              <CardContent>
                <PostHeader>
                  <PostUserAvatar
                    src={user.profilePictureType}
                    alt={user.name}
                  >
                    {(!user.profilePictureType || user.profilePictureType.startsWith('data:image')) ? user.name.charAt(0).toUpperCase() : null}
                  </PostUserAvatar>
                  <Box ml={2}>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdDate).toLocaleString()}
                    </Typography>
                  </Box>
                </PostHeader>
                <PostContent variant="body1">
                  {post.content}
                </PostContent>
              </CardContent>
              <StyledDivider />
              <CardActions sx={{ justifyContent: 'space-around' }}>
                <ActionButton size="small" onClick={() => handleLikePost(post.id)}>
                  {user.likedPosts?.includes(post.id) ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
                  <ActionText variant="button" sx={{ textTransform:'none'}}>Like</ActionText>
                </ActionButton>
                <ActionButton size="small" onClick={() => handleCommentClick(post)}>
                  <ChatBubbleOutline fontSize="small" />
                  <ActionText variant="button" sx={{ textTransform:'none'}}>Comment</ActionText>
                </ActionButton>
                <ActionButton size="small">
                  <Share fontSize="small" />
                  <ActionText variant="button" sx={{ textTransform:'none'}} >Share</ActionText>
                </ActionButton>
              </CardActions>
            </PostCard>
          ))
        ) : (
          <Typography variant="h6" align="center">No posts available</Typography>
        )}
      </PageWrapper>

      <Suspense fallback={<CircularProgress color="inherit" />}>
        {isModalOpen && (
          <UserPostsOverlay
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            post={selectedPost}
            username={user.name}
            userProfilePicture={user.profilePictureType}
            likedPosts={user.likedPosts || []}
            onLike={handleLikePost}
            currentUser={currentUser}
          />
        )}
      </Suspense>
    </>
  );
};

export default CollabCultUsersList;