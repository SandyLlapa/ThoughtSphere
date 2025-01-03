import React from 'react';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ColorLensIcon from '@mui/icons-material/ColorLens';




const IconDisplay = () => {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <AddLocationIcon style={{ fontSize: '40px', color: 'red' }} />
      <AlternateEmailIcon style={{ fontSize: '40px', color: 'blue' }} />
      <EmojiEmotionsIcon style={{ fontSize: '40px', color: 'yellow' }} />
      <LocalActivityIcon style={{ fontSize: '40px', color: 'green' }} />
      <LibraryMusicIcon style={{ fontSize: '40px', color: 'purple' }} />
      <ColorLensIcon style={{ fontSize: '40px', color: 'orange' }} />
    </div>
  );
};


