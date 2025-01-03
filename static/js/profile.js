import React from "react";
import ReactDOM from "react-dom";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const AboutMeIcons = () => {
  return (
    <div>
      <h2>About Me</h2>
      <p>
        <AlternateEmailIcon style={{ color: "blue", fontSize: "30px" }} /> Contact Me
      </p>
      <p>
        <EmojiEmotionsIcon style={{ color: "yellow", fontSize: "30px" }} /> Stay Positive
      </p>
    </div>
  );
};

// Find the existing div with id="aboutMe" and render the JSX inside it
const rootElement = document.getElementById("aboutMe");
ReactDOM.render(<AboutMeIcons />, rootElement);
