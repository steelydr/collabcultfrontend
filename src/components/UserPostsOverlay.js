import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, Modal, CircularProgress, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import EmojiConvertor from 'emoji-js';
import config from './config';
const emoji = new EmojiConvertor();
emoji.init_env();
emoji.replace_mode = 'unified';

const OverlayContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: 'auto',
  maxWidth: '770px',
  maxHeight :'75%',
  backgroundColor: '#121212',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  borderRadius: '20px',
  padding: '24px',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    height: '90vh',
  },
}));

const PostHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
});

const UserInfo = styled(Box)({
  marginLeft: '16px',
  flex: 1,
});

const PostContent = styled(Typography)(({ theme }) => ({
  color: '#E0E0E0',
  marginBottom: '24px',
  fontSize: '1rem',
  lineHeight: 1.6,
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#757575',
  '&:hover': {
    color: '#21CBF3',
    backgroundColor: 'rgba(33, 203, 243, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px',
  },
}));

const ContentContainer = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
});

const PostColumn = styled(Box)({
  flex: 1,
  paddingRight: '12px',
  overflowY: 'auto',
});

const CommentsColumn = styled(Box)({
  flex: 1,
  paddingLeft: '12px',
  borderLeft: '1px solid #333',
  overflowY: 'auto',
});

const CommentItem = styled(Box)({
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: '#1E1E1E',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'flex-start',
});

const CommentContent = styled(Box)({
  marginLeft: '12px',
  flex: 1,
});

const UserPostsOverlay = ({
  isOpen,
  onClose,
  post,
  username,
  userProfilePicture,
  likedPosts,
  onLike,
  currentUser
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const eventSourceRef = useRef(null);
  const fetchComments = useCallback(
    async (postId) => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BACKEND_URL}/api/comments/post/${postId}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (error.code === 'ERR_NETWORK') {
          alert('Network error: Please check your server and try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const subscribeToComments = useCallback(
    (postId) => {
      if (eventSourceRef.current) return; // Prevent multiple subscriptions

      const sse = new EventSource(`${config.BACKEND_URL}/api/comments/stream`);
      eventSourceRef.current = sse;

      sse.addEventListener('comment-update', (event) => {
        const updatedComment = JSON.parse(event.data);
        if (updatedComment.post.id === postId) {
          setComments((prevComments) =>
            prevComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
          );
        }
      });

      sse.addEventListener('comment-create', (event) => {
        const newComment = JSON.parse(event.data);
        if (newComment.post.id === postId) {
          setComments((prevComments) => [...prevComments, newComment]);
        }
      });

      sse.addEventListener('comment-delete', (event) => {
        const deletedCommentId = JSON.parse(event.data).id;
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== deletedCommentId));
      });

      sse.onerror = (error) => {
        console.error('Error in SSE connection:', error);
        sse.close();
        eventSourceRef.current = null;
      };
    },
    []
  );

  useEffect(() => {
    if (showComments && post) {
      fetchComments(post.id);
      subscribeToComments(post.id);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [showComments, post, fetchComments, subscribeToComments]);

  const handleCreateComment = async () => {
  try {
    const newCommentData = {
      post_id: post.id,
      user_id: currentUser.id,
      content: newCommentContent,
    };
    await axios.post(`${config.BACKEND_URL}/api/comments`, newCommentData);
    setNewCommentContent(''); // Clear the input field after successful submission
  } catch (error) {
    console.error('Error creating comment:', error);
  }
};
  const handleUpdateComment = async (commentId) => {
    try {
      const updatedCommentData = {
        content: editingComment.content,
      };
      await axios.put(`${config.BACKEND_URL}/api/comments/${commentId}`, updatedCommentData);
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${config.BACKEND_URL}/api/comments/${commentId}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const getAvatarContent = (user) => {
    if (user.profilePictureType) {
      return <Avatar src={user.profilePictureType} alt={user.username} sx={{ width: 40, height: 40 }} />;
    } else {
      return (
        <Avatar sx={{ width: 40, height: 40, bgcolor: stringToColor(user.username) }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  if (!post) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <OverlayContainer>
        <PostHeader>
          <Avatar src={userProfilePicture} alt="Profile" sx={{ width: 56, height: 56 }} />
          <UserInfo>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
              {new Date(post.createdDate).toLocaleString()}
            </Typography>
          </UserInfo>
          <IconButton onClick={onClose} sx={{ color: '#757575' }}>
            <CloseIcon />
          </IconButton>
        </PostHeader>
        <ContentContainer>
          <PostColumn>
            <PostContent>{emoji.replace_colons(post.content)}</PostContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
              <ActionButton onClick={() => onLike(post.id)}>
                {likedPosts.includes(post.id) ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
              </ActionButton>
              <ActionButton onClick={handleCommentClick}>
                <ChatBubbleOutlineIcon />
              </ActionButton>
              <ActionButton>
                <ShareIcon />
              </ActionButton>
            </Box>

            {showComments && (
              <Box>
                <TextField
                  fullWidth
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Write a comment..."
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
                <Button onClick={handleCreateComment}
                disabled={!newCommentContent.trim()}
                sx={{
                  color: '#21CBF3',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}>Post Comment</Button>
              </Box>
            )}
          </PostColumn>
          {showComments && (
            <CommentsColumn>
              <Typography variant="h6" sx={{ color: '#FFFFFF', marginBottom: '16px' }}>
                Comments
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    {getAvatarContent(comment.user)}
                    <CommentContent>
                      {editingComment && editingComment.id === comment.id ? (
                        <Box>
                          <TextField
                            fullWidth
                            value={editingComment.content}
                            onChange={(e) =>
                              setEditingComment({ ...editingComment, content: e.target.value })
                            }
                          />
                          <Button onClick={() => handleUpdateComment(comment.id)}  sx={{ color: '#1976d2', 
                        fontSize: '14px',  width: '24px', height: '24px', marginRight: '2px' ,
                        backgroundColor:'transparent',
                        '&:hover': {backgroundColor: 'transparent', }}}>
                            Update
                          </Button>
                          <Button onClick={handleCancelEdit} sx={{ color: '#FF1744', fontSize: '14px',  width: '24px', 
                        height: '24px', marginLeft: '2px' ,backgroundColor:'transparent',
                        '&:hover': {backgroundColor: 'transparent', }}}>
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#FFFFFF', fontWeight: 'bold' }}
                          >
                            {comment.user.username}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                            {comment.content}
                          </Typography>
                        </Box>
                      )}
                      {!editingComment && currentUser && currentUser.id === comment.user.id && (
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' ,marginTop:'5px'}}> 
                     <IconButton  onClick={() => setEditingComment(comment)}  sx={{ color: '#1976d2', 
                        fontSize: '13px',  width: '24px', height: '24px', marginRight: '8px' }}>  EDIT </IconButton>
                      <IconButton onClick={() => handleDeleteComment(comment.id)} sx={{ color: '#FF1744', fontSize: '13px',  width: '24px', 
                        height: '24px', marginLeft: '8px' }}>DELETE</IconButton> </Box>)}
                    </CommentContent>
                  </CommentItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                  No comments yet.
                </Typography>
              )}
            </CommentsColumn>
          )}
        </ContentContainer>
      </OverlayContainer>
    </Modal>
  );
};

export default UserPostsOverlay;