import { useEffect } from 'react';
import config from './config';

const SSECommentManager = ({ onCommentUpdate }) => {
  useEffect(() => {
    const newEventSource = new EventSource(`${config.BACKEND_URL}/api/comments/stream`);

    newEventSource.onmessage = (event) => {
      console.log('Received event:', event);
    };

    newEventSource.addEventListener('INIT', (event) => {
      console.log('SSE connection established:', event.data);
    });

    newEventSource.addEventListener('heartbeat', (event) => {
      console.log('Heartbeat received:', event.data);
    });

    newEventSource.addEventListener('comment-create', (event) => {
      const newComment = JSON.parse(event.data);
      onCommentUpdate('create', newComment);
    });

    newEventSource.addEventListener('comment-update', (event) => {
      const updatedComment = JSON.parse(event.data);
      onCommentUpdate('update', updatedComment);
    });

    newEventSource.addEventListener('comment-delete', (event) => {
      const deletedComment = JSON.parse(event.data);
      onCommentUpdate('delete', deletedComment);
    });

    newEventSource.onerror = (error) => {
      console.error('SSE error:', error);
      newEventSource.close();
    };

    return () => {
      if (newEventSource) {
        newEventSource.close();
      }
    };
  }, [onCommentUpdate]);

  return null; // This component doesn't render anything
};

export default SSECommentManager;