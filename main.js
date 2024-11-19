document.addEventListener('DOMContentLoaded', async() => {
    const characterList = document.getElementById('character-list');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const characterDetails = document.getElementById('character-details');
    const backButton = document.getElementById('backButton');
    const movieTrailerButton = document.getElementById('movieTrailerButton');
    const trailerIframe = document.getElementById('trailerIframe');
    const characterImage = document.getElementById('characterImage');
    const characterName = document.getElementById('characterName');
    const characterDescription = document.getElementById('characterDescription');
    const characterExtraInfo = document.getElementById('characterExtraInfo');
    const loadingIndicator = document.getElementById('loadingIndicator');

    let characters = [];
    let filteredCharacters = [];

    // Fetch character data from the Star Wars API
    try {
        const response = await fetch('https://swapi.dev/api/people/');
        const data = await response.json();
        characters = data.results;

        // Hide the loading indicator and display the character list
        loadingIndicator.style.display = 'none';
        characterList.style.display = 'grid'; // Show the character list

        renderCharacterList(characters); // Initially render all characters
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingIndicator.textContent = 'Failed to load characters. Please try again later.';
    }

    // Render the character list using rectangles
    function renderCharacterList(charactersToRender) {
        characterList.innerHTML = ''; // Clear the character list
        charactersToRender.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card');
            card.innerHTML = `
                <div class="rectangle" style="width: 150px; height: 150px; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; border-radius: 8px; cursor: pointer;">
                    <h3 style="color: white; font-size: 1.2rem; text-align: center; text-transform: capitalize;">${character.name}</h3>
                </div>
            `;
            card.addEventListener('click', () => showCharacterDetails(character));
            characterList.appendChild(card);
        });
    }
    // Show character details with more information
    function showCharacterDetails(character) {
        // Hide the character list and show character details screen
        characterDetails.style.display = 'block';
        characterList.style.display = 'none';

        // Populate character details
        characterName.textContent = character.name;
        characterImage.src = "https://via.placeholder.com/150"; // You can replace this with an actual image URL if you want

        // Character description (basic info from the API)
        characterDescription.innerHTML = `
            <strong>Gender:</strong> ${character.gender}<br>
            <strong>Height:</strong> ${character.height} cm<br>
            <strong>Hair Color:</strong> ${character.hair_color}<br>
            <strong>Skin Color:</strong> ${character.skin_color}<br>
        `;

        // Additional character info (what they did, their role, etc.)
        characterExtraInfo.innerHTML = `
            <strong>Role in Star Wars:</strong> ${getCharacterRole(character.name)}<br>
        `;

        // Movie trailer button click functionality
        movieTrailerButton.addEventListener('click', () => {
            trailerIframe.style.display = 'block';
            trailerIframe.src = "https://www.youtube.com/embed/VIDEO_ID"; // Replace with actual trailer URL
        });
    }
    // Function to simulate character role in the Star Wars movies (you can add more logic here)
    function getCharacterRole(characterName) {
        const roles = {
            "Luke Skywalker": "Jedi Knight, Rebel Leader, Son of Anakin Skywalker.",
            "Darth Vader": "Former Jedi Knight, Sith Lord, Father of Luke Skywalker.",
            "Leia Organa": "Princess of Alderaan, Rebel Leader, Sister to Luke Skywalker.",
            "Han Solo": "Smuggler, Rebel Leader, Pilot of the Millennium Falcon.",
            // Add more roles here based on the character's name.
        };

        return roles[characterName] || "No role information available";
    }

    // Back button functionality
    backButton.addEventListener('click', () => {
        // Hide character details and show character list again
        characterDetails.style.display = 'none';
        characterList.style.display = 'grid'; // Ensure the character list displays in grid format

        // Clear the trailer iframe
        trailerIframe.style.display = 'none';
        trailerIframe.src = "";
    });

    // Search button functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(query));

        if (filteredCharacters.length > 0) {
            renderCharacterList(filteredCharacters); // Render only the filtered characters
        } else {
            characterList.innerHTML = `<p>No results found</p>`; // Display "No results" if no match is found
        }
    });
});