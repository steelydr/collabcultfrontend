import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  Snackbar,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import config,{ SECRET_KEY } from './config';

const LazyAvatar = lazy(() => import('@mui/material/Avatar'));
const LazyLinkedInComment = lazy(() => import('./LinkedinComment'));

const LazyImage = ({ src, alt, ...props }) => (
  <Suspense fallback={<CircularProgress size={24} />}>
    <LazyAvatar src={src} alt={alt} {...props} />
  </Suspense>
);

const PostCard = ({ post, onDelete, onUpdate, isLoading }) => {
  const { id, content, createdDate, userId } = post;
  const [postState, setPostState] = useState({
    isEditing: false,
    editedContent: content,
    showCommentInput: false,
    newComment: '',
    showSnackbar: false,
  });
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const encryptedData = localStorage.getItem('user');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setCurrentUser(decryptedData);
      } catch (error) {
        console.error('Error decrypting user data:', error);
      }
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/users/${userId}`);
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserData(null);
    }
  }, [userId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/comments/post/${id}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
    fetchComments();
  }, [fetchUserDetails, fetchComments]);

  useEffect(() => {
    const eventSource = new EventSource(`${config.BACKEND_URL}/api/posts/stream`);

    const handlePostUpdate = (updatedPost) => {
      if (updatedPost.id === id) {
        setPostState(prevState => ({
          ...prevState,
          editedContent: updatedPost.content,
          isEditing: false,
        }));
      }
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handlePostUpdate(data);
    };

    eventSource.addEventListener('post-update', (event) => {
      const updatedPost = JSON.parse(event.data);
      handlePostUpdate(updatedPost);
    });

    eventSource.addEventListener('post-delete', (event) => {
      const deletedPost = JSON.parse(event.data);
      if (deletedPost.id === id) {
        onDelete(id);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [id, onDelete]);

  const handleStateChange = (key, value) => {
    setPostState(prevState => ({ ...prevState, [key]: value }));
  };

  const handleEdit = () => handleStateChange('isEditing', true);
  const handleCancelEdit = () => {
    handleStateChange('isEditing', false);
    handleStateChange('editedContent', content);
  };

  const handleSaveEdit = async () => {
    if (postState.editedContent.trim() !== content) {
      await onUpdate(id, postState.editedContent);
    }
    handleStateChange('isEditing', false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.BACKEND_URL}/api/posts/${id}`);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentClick = () => handleStateChange('showCommentInput', !postState.showCommentInput);

  const handlePostComment = async () => {
    if (!postState.newComment.trim()) return;
    try {
      await axios.post(`${config.BACKEND_URL}/api/comments`, {
        post_id: id,
        user_id: currentUser.id,
        content: postState.newComment,
      });
      handleStateChange('newComment', '');
      handleStateChange('showCommentInput', false);
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      handleStateChange('showSnackbar', true);
    });
  };

  return (
    <StyledCard isSmallScreen={isSmallScreen} isMediumScreen={isMediumScreen}>
      <CardContent>
        <PostHeader isSmallScreen={isSmallScreen}>
          <UserInfo>
            <LazyImage
              src={userData?.profilePictureType}
              alt={userData?.username || 'User'}
              sx={!userData?.profilePictureType ? {
                backgroundColor: '#1976d2',
                color: '#fff',
              } : {}}
            >
              {!userData?.profilePictureType && ((userData?.username && userData.username[0].toUpperCase()) || 'U')}
            </LazyImage>
            <Box ml={2}>
              <Typography variant="subtitle1" component="div" className="post-username">
                {userData?.name || 'Anonymous'}
              </Typography>
              <PostDate variant="caption" className="post-date">
                {new Date(createdDate).toLocaleString()}
              </PostDate>
            </Box>
          </UserInfo>
          {currentUser && currentUser.id === userId && (
            <AdminActionButtons>
              {postState.isEditing ? (
                <>
                  <AdminActionButton onClick={handleSaveEdit} disabled={isLoading}>
                    <FaCheck />
                  </AdminActionButton>
                  <AdminActionButton onClick={handleCancelEdit} disabled={isLoading}>
                    <FaTimes />
                  </AdminActionButton>
                </>
              ) : (
                <>
                  <AdminActionButton onClick={handleEdit} disabled={isLoading}>
                    <FaEdit />
                  </AdminActionButton>
                  <AdminActionButton onClick={handleDelete} disabled={isLoading}>
                    <FaTrashAlt />
                  </AdminActionButton>
                </>
              )}
            </AdminActionButtons>
          )}
        </PostHeader>

        {postState.isEditing ? (
          <StyledTextField
            fullWidth
            multiline
            rows={isSmallScreen ? 2 : 3}
            variant="outlined"
            value={postState.editedContent}
            onChange={(e) => handleStateChange('editedContent', e.target.value)}
            autoFocus
          />
        ) : (
          <PostContent variant="body1" component="p" mt={2} mb={2}>
            {postState.editedContent}
          </PostContent>
        )}

        <Divider />

        <ActionButtons isSmallScreen={isSmallScreen}>
          <ActionButton startIcon={<FaThumbsUp />}>Like</ActionButton>
          <ActionButton startIcon={<FaComment />} onClick={handleCommentClick}>
            Comment
          </ActionButton>
          <ActionButton startIcon={<FaShare />} onClick={handleShare}>
            Share
          </ActionButton>
        </ActionButtons>

        <Snackbar
          open={postState.showSnackbar}
          autoHideDuration={3000}
          onClose={() => handleStateChange('showSnackbar', false)}
          message="Post link copied to clipboard!"
        />

        {postState.showCommentInput && (
          <Box mt={2}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Write a comment..."
              value={postState.newComment}
              onChange={(e) => handleStateChange('newComment', e.target.value)}
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'gray',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />

            <Box mt={1} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePostComment}
                disabled={!postState.newComment.trim()}
                sx={{
                  color: '#21CBF3',
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: 'black',
                  },
                }}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        )}

        <CommentsSection>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Suspense key={comment.id} fallback={<CircularProgress size={24} />}>
                <LazyLinkedInComment
                  comment={comment}
                  fetchComments={fetchComments}
                  currentUser={currentUser}
                />
              </Suspense>
            ))
          ) : (
            <Typography variant="body2" color="#b0b0b0" sx={{ fontStyle: 'italic', marginTop: '5px' }}>
              Hey, feel free to start commenting on the post.
            </Typography>
          )}
        </CommentsSection>
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => !['isSmallScreen', 'isMediumScreen'].includes(prop),
})(({ theme, isSmallScreen, isMediumScreen }) => ({
  width: '100%',
  marginBottom: '20px',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#000',
  color: '#fff',
  padding: isSmallScreen ? '16px' : isMediumScreen ? '24px' : '32px',
}));

const PostHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmallScreen',
})(({ theme, isSmallScreen }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: isSmallScreen ? '8px' : '16px',
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: '#fff',
});

const Divider = styled(Box)({
  height: '1px',
  backgroundColor: '#333',
  margin: '16px 0',
});

const ActionButtons = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmallScreen',
})(({ theme, isSmallScreen }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  gap: isSmallScreen ? '4px' : '16px',
}));

const AdminActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const ActionButton = styled(Button)({
  textTransform: 'none',
  color: '#b0b0b0',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const AdminActionButton = styled(IconButton)({
  color: '#333',
  padding: '6px',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
});

const PostContent = styled(Typography)({
  color: '#fff',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  lineHeight: '1.5',
  padding: '10px 0',
});

const PostDate = styled(Typography)({
  color: '#bdbdbd',
  fontSize: '12px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#333',
    '& fieldset': {
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: '#777',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiInputLabel-root': {
    color: '#bdbdbd',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#fff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#555',
  },
});

const CommentsSection = styled(Box)({
  marginTop: '16px',
});

export default PostCard;