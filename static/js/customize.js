// Set the background color of "previewBox" to the color selected by the user
document.getElementById('background').addEventListener('input', (event) => {
  const color = event.target.value;
  document.getElementById('previewBox').style.backgroundColor = color;
});


