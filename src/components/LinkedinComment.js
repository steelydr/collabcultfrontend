import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const LinkedinComment = ({ comment, fetchComments, currentUser }) => {
  const { id, user, content, createdDate } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [commentUserData, setCommentUserData] = useState({});

  // Fetch user data for the commenter
  useEffect(() => {
    const fetchCommentUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/api/users/${user.id}`);
        const commentUser = response.data.user;
        setCommentUserData(commentUser); // Storing complete user data including profilePictureType
      } catch (error) {
        console.error('Error fetching commenter user details:', error);
      }
    };

    fetchCommentUserDetails();
  }, [user.id]);

  // Long Polling for fetching comments
  useEffect(() => {
    const longPolling = async () => {
      try {
        // Make a request to fetch comments and keep the connection open until new data arrives
        await fetchComments();
        // Re-trigger the long polling after fetching new comments
        longPolling();
      } catch (error) {
        console.error('Error during long polling:', error);
        // Retry polling after a delay if an error occurs
        setTimeout(longPolling, 5000);
      }
    };

    longPolling();
  }, [fetchComments]);

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedComment(content);
  };

  const handleSaveEdit = async () => {
    if (editedComment.trim() !== content) {
      setIsLoading(true);
      try {
        await axios.put(`http://localhost/api/comments/${id}`, {
          content: editedComment,
          
        });
        setIsEditing(false);
        setIsLoading(false);
        fetchComments(); // Re-fetch comments after editing
      } catch (error) {
        console.error('Error updating comment:', error);
        setIsLoading(false);
      }
    }
  };

  const handleDeleteComment = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost/api/comments/${id}`);
      setIsLoading(false);
      fetchComments(); // Re-fetch comments after deleting
    } catch (error) {
      console.error('Error deleting comment:', error);
      setIsLoading(false);
    }
  };

  // Check if the current user is the owner of the comment
  const isCommentOwner = currentUser && currentUser.id === user.id;

  return (
    <CommentBox>
      <AvatarWrapper>
        {commentUserData.profilePictureType ? (
          <Avatar src={commentUserData.profilePictureType} alt={user.username} />
        ) : (
          <Avatar sx={{backgroundColor: '#1976d2',color: '#fff',}}>{user.username[0].toUpperCase()}</Avatar>
        )}
      </AvatarWrapper>
      <CommentContent>
        <CommentHeader>
          <Typography variant="subtitle2" className="comment-name">
            {user.name}
          </Typography>
          <Typography variant="caption" className="comment-date">
            {new Date(createdDate).toLocaleString()}
          </Typography>
        </CommentHeader>
        {isEditing ? (
          <StyledTextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <Typography variant="body2" className="comment-text">
            {content}
          </Typography>
        )}

        {isCommentOwner && (
          <CommentActions>
            {isEditing ? (
              <>
                <Button
                  size="small"
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  sx={{ color: '#21CBF3' }}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  sx={{ color: '#FF1744' }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="small"
                  onClick={handleEditComment}
                  sx={{ color: '#1976d2' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={handleDeleteComment}
                  disabled={isLoading}
                  sx={{ color: '#FF1744' }}
                >
                  Delete
                </Button>
              </>
            )}
          </CommentActions>
        )}
      </CommentContent>
    </CommentBox>
  );
};

// Styled Components

const CommentBox = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
});

const AvatarWrapper = styled(Box)({
  marginRight: '12px',
});

const CommentContent = styled(Box)({
  backgroundColor: '#111',
  borderRadius: '8px',
  padding: '8px',
  width: '100%',
});

const CommentHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
});

const CommentActions = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginTop: '8px',
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

export default LinkedinComment;
