// Create thought threads table
function makeTable(items) {
  const table = document.querySelector('#collection tbody');
  table.innerHTML = ''; // Clear the table content

  items.forEach(item => {
    const row = document.createElement('tr');
    const date = new Date(item.created_at).toISOString().split('T')[0];

    // Include thought_id in the button data attribute
    row.innerHTML = `
      <td style="text-align: center; vertical-align: middle;">${item.thought}</td>
      <td style="text-align: center; vertical-align: middle;">${date}</td>
      <td style="text-align: center; vertical-align: middle;">
        <button data-thought-id="${item.thought_id}" class="deleteButton">Delete</button>
      </td>`;

    table.appendChild(row);
  });
  attachDeleteEventListeners(); // Add event listeners after table is created
}

// Functionality for delete button of user's posts 
function attachDeleteEventListeners() {
  document.querySelectorAll('.deleteButton').forEach(button => {
    button.addEventListener('click', function () {
      const thoughtId = this.getAttribute('data-thought-id');

      if (!thoughtId) {
        console.error('Thought ID is undefined');
        return;
      }

      fetch(`/thoughts/${thoughtId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          console.log('Thought deleted successfully');
          this.closest('tr').remove(); // Remove the row from the UI
        } else {
          console.error('Failed to delete thought');
        }
      })
      .catch(error => console.error('Error deleting thought:', error));
    });
  });
}
  

// fetch thoughts from the user's profile
fetch(`/thoughts?username=${usernameFromBackend}`)
  .then(response => response.json())
  .then(items=>{
    makeTable(items);

  })
  .catch(error=>console.error('Error fetching thoughts:',error));


// Fetch and display friends of the current profile being viewed
fetch(`/friends?username=${usernameFromBackend}`)
  .then(response => response.json())
  .then(friends => {
    const friendListContainer = document.querySelector('#friendListContainer');
    friendListContainer.innerHTML = ''; // Clear the placeholder

    if (friends.length === 0) {
      friendListContainer.innerHTML = '<div>No friends to display</div>';
    } else {
      friends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.innerHTML = `
          <img src="${friend.profile_image || '/images/default_profile.png'}" alt="${friend.username}" class="friend-image">
          <span class="friend-username">${friend.username}</span>
        `;
        friendListContainer.appendChild(friendCard);
      });
    }
  })
  .catch(error => console.error('Error fetching friends:', error));
