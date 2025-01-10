
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

fetch(`/thoughts?username=${usernameFromBackend}`)
  .then(response => response.json())
  .then(items=>{
    makeTable(items);

  })
  .catch(error=>console.error('Error fetching thoughts:',error));





// Fetch and display friends
fetch('/friends')
  .then(response => response.json())
  .then(friends => {
    const friendListContainer = document.querySelector('#friendListContainer');
    friendListContainer.innerHTML = ''; // Clear the placeholder

    if (friends.length === 0) {
      friendListContainer.innerHTML = '<li>No friends to display</li>';
    } else {
      friends.forEach(friend => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src="${friend.profile_image || '/images/default_profile.png'}" alt="${friend.username}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
          <span>${friend.username}</span>
        `;
        friendListContainer.appendChild(listItem);
      });
    }
  })
  .catch(error => console.error('Error fetching friends:', error));



const threadTable = document.querySelector("#collection tbody");
console.log("Thread table content before JS manipulation:", threadTable.innerHTML);
