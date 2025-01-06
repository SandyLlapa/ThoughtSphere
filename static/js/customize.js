document.getElementById('background').addEventListener('input', (event) => {
  const color = event.target.value;
  document.getElementById('previewBox').style.backgroundColor = color;
});


