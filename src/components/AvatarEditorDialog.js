import React, { useRef, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Slider } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';

const AvatarEditorDialog = ({ image, editorOpen, handleCloseEditor, handleSaveAvatar }) => {
  const avatarEditorRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  return (
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
  );
};

export default AvatarEditorDialog;
