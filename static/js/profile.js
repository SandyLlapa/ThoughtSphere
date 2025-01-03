// import React from "react";
// import ReactDOM from "react-dom";
// import AddLocationIcon from '@mui/icons-material/AddLocation';
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
// import LocalActivityIcon from '@mui/icons-material/LocalActivity';
// import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
// import ColorLensIcon from '@mui/icons-material/ColorLens';

// const AboutMeIcons = () => {
//   return (
//     <div>
//       <h2>About Me</h2>
//       <p>
//         <AlternateEmailIcon style={{ color: "blue", fontSize: "30px" }} /> Contact Me
//       </p>
//       <p>
//         <EmojiEmotionsIcon style={{ color: "yellow", fontSize: "30px" }} /> Stay Positive
//       </p>
//     </div>
//   );
// };

// // Find the existing div with id="aboutMe" and render the JSX inside it
// const rootElement = document.getElementById("aboutMe");
// ReactDOM.render(<AboutMeIcons />, rootElement);



// creates table with updated information
function makeTable(items) {
  const table = document.querySelector('#collection tbody');
  table.innerHTML = ''; // Clear the table content

  items.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td style="text-align: center; vertical-align: middle;">${item.thought}</td>
      <td style="text-align: center; vertical-align: middle;">${item.created_at}</td>
      <td style="text-align: center; vertical-align: middle;">
        <button id="comments-${item.id}" class="commentButton">comment</button>
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <button id="delete-${item.id}" class="deleteButton">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });

}

fetch('/thoughts')
  .then(response => response.json())
  .then(items=>{
    makeTable(items);

  })
  .catch(error=>console.error('Error fetching thoughts:',error));


