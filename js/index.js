

document.addEventListener("DOMContentLoaded", function () {
    getUsers();
  });
  
  urlOne = "https://api.github.com/users/octocat/repos";
  
  function getUsers() {
    fetch(urlOne)
      .then((res) => res.json())
      .then((data) => {
        const userList = document.querySelector("#user-list");
        const form = document.getElementById("github-form");
  
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
  
          // taking the input and turning it to lowercase
          const search = document.querySelector("#search").value.toLowerCase();
  
          // Array to store matching users once found
          let matchingUsers = [];
          let userExistence = false;
  
          // Search loop to look for the full name
          for (const item of data) {
            const fullName = item.full_name.toLowerCase();
  
            if (fullName.includes(search)) {
              userExistence = true;
              // Store matching users in the array
              matchingUsers.push(item);
            }
          }
  
          if (!userExistence) {
            alert(`User ${search} not found`);
          } else {
            // Clear user list to create a fresh one
            userList.innerHTML = "";
  
            // Display loop for matching users
            for (const item of matchingUsers) {
              const fullName = item.full_name;
              const avatarUrl = item.owner.avatar_url;
              const profileUrl = item.owner.html_url;
  
              // Creating elements to display the user info
              const userContainer = document.createElement("div");
              userContainer.classList.add("user-container");
  
              const userAvatar = document.createElement("img");
              userAvatar.src = avatarUrl;
  
              const fullNameElm = document.createElement("p");
              fullNameElm.textContent = `Full Name: ${fullName}`;
  
              const profileLink = document.createElement("a");
              profileLink.href = profileUrl;
              profileLink.textContent = "View Profile";
  
              // Add click event listener to each user container
              userContainer.addEventListener("click", async () => {
                // Extract the username from the full name
                const username = fullName.split("/")[0].trim();
                // Construct the URL for the User Repos Endpoint
                const userReposUrl = `https://api.github.com/users/${username}/repos`;
  
                try {
                  // Fetch the user's repositories
                  const reposResponse = await fetch(userReposUrl);
                  const repos = await reposResponse.json();
  
                  // Display the repository data for the selected user
                  const reposContainer = document.createElement("div");
                  reposContainer.classList.add("repos-container");
  
                  repos.forEach((repo) => {
                    const repoNameElm = document.createElement("p");
                    repoNameElm.textContent = `Repository: ${repo.name}`;
  
                    const repoDescriptionElm = document.createElement("p");
                    repoDescriptionElm.textContent = `Description: ${
                      repo.description || "No description"
                    }`;
  
                    const repoUrlLink = document.createElement("a");
                    repoUrlLink.href = repo.html_url;
                    repoUrlLink.textContent = "View Repository";
  
                    const repoContainer = document.createElement("div");
                    repoContainer.classList.add("repo-container");
                    repoContainer.appendChild(repoNameElm);
                    repoContainer.appendChild(repoDescriptionElm);
                    repoContainer.appendChild(repoUrlLink);
  
                    reposContainer.appendChild(repoContainer);
                  });
  
                  // Append the repositories to the user container
                  userContainer.appendChild(reposContainer);
                } catch (error) {
                  console.error("Error fetching repositories:", error);
                }
              });
  
              // Appending the elements to the container
              userContainer.appendChild(userAvatar);
              userContainer.appendChild(fullNameElm);
              userContainer.appendChild(profileLink);
  
              // Appending the container to the userlist
              userList.appendChild(userContainer);
            }
          }
        });
      });
    }