



// creates table with updated information
function makeTable(items) {
  const table = document.querySelector('#collection tbody');
  table.innerHTML = ''; // Clear the table content

  items.forEach(item => {
    const row = document.createElement('tr');
    const date = new Date(item.created_at).toISOString().split('T')[0]; 

    row.innerHTML = `
      <td style="text-align: center; vertical-align: middle;">${item.thought}</td>
      <td style="text-align: center; vertical-align: middle;">${date}</td>
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


