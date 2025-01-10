
// Fetch friends' thoughts and display them in the Thought Pool
fetch('/friends-thoughts')
  .then(response => response.json())
  .then(thoughts => {
    const pool = document.getElementById('pool');
    pool.innerHTML = ''; // Clear the existing content

    if (thoughts.length === 0) {
      pool.innerHTML = '<p>No thoughts to display from your friends.</p>';
      return;
    }

    // Loop through thoughts and add them to the pool
    thoughts.forEach(thought => {
      const thoughtDiv = document.createElement('div');
      thoughtDiv.className = 'thought-item';
      thoughtDiv.innerHTML = `
        <div class="friend-info">
          <img src="${thought.profile_image || '/uploads/default-profile.png'}" alt="${thought.username}" class="friend-image">
          <strong>${thought.username}</strong>
        </div>
        <p class="thought-content">${thought.thought}</p>
        <span class="thought-date">${new Date(thought.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}</span>
      `;
      pool.appendChild(thoughtDiv);
    });
  })
  .catch(error => {
    console.error('Error fetching friends\' thoughts:', error);
    const pool = document.getElementById('pool');
    pool.innerHTML = '<p>Unable to load thoughts at this time.</p>';
  });

