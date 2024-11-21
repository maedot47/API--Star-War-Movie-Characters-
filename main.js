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
    const trailerError = document.getElementById('trailerError');

    let characters = [];

    // Fetch character data from SWAPI (real-time data)
    try {
        const response = await fetch('https://swapi.dev/api/people/');
        const data = await response.json();
        characters = data.results.slice(0, 10); // Limit to top 10 characters
        loadingIndicator.style.display = 'none';
        characterList.style.display = 'grid';
        renderCharacterList(characters);
    } catch (error) {
        loadingIndicator.textContent = 'Failed to load characters. Please try again later.';
        console.error('Error fetching characters:', error);
    }

    // Fetch character images from an external source
    async function fetchCharacterImage(characterName) {
        const imageUrl = await getCharacterImageFromAPI(characterName);
        return imageUrl || 'https://via.placeholder.com/150'; // Default image if none found
    }

    // Fetch exact movie character images based on name
    async function getCharacterImageFromAPI(characterName) {
        const imageUrls = {
            'Luke Skywalker': 'https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_7ffe21c7.jpeg?region=130%2C147%2C1417%2C796',
            'Darth Vader': 'https://upload.wikimedia.org/wikipedia/en/f/f7/Darth_Vader.png',
            'Leia Organa': 'https://en.wikipedia.org/wiki/File:Princess_Leia%27s_characteristic_hairstyle.jpg',
            'C-3PO': 'https://lumiere-a.akamaihd.net/v1/images/c-3po-9-retina_6313ab74_1a198c83.jpeg?region=0%2C0%2C1200%2C800',
            'R2-D2': 'https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png',
            'Obi-Wan Kenobi': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Ben_Kenobi.png/220px-Ben_Kenobi.png',
            'Beru Whitesun lars': 'https://upload.wikimedia.org/wikipedia/en/1/1a/Shelagh_Fraser.jpg',
            'R5-D4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/R2-D2_-_Genuine_Movie_Star.jpg/800px-R2-D2_-_Genuine_Movie_Star.jpg'

        };

        return imageUrls[characterName] || 'https://via.placeholder.com/150'; // Default if no image found
    }


    // Render the character list dynamically
    function renderCharacterList(charactersToRender) {
        characterList.innerHTML = '';
        charactersToRender.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card');
            card.innerHTML = `<h3>${character.name}</h3>`;
            card.addEventListener('click', () => showCharacterDetails(character));
            characterList.appendChild(card);
        });
    }

    // Show character details dynamically
    async function showCharacterDetails(character) {
        characterDetails.style.display = 'block';
        characterList.style.display = 'none';
        characterName.textContent = character.name;

        // Fetch the character image dynamically
        const imageUrl = await fetchCharacterImage(character.name);
        characterImage.src = imageUrl;

        // Display character description dynamically from SWAPI
        characterDescription.innerHTML = `
            <strong>Gender:</strong> ${character.gender || 'n/a'}<br>
            <strong>Height:</strong> ${character.height} cm<br>
            <strong>Hair Color:</strong> ${character.hair_color || 'n/a'}<br>
            <strong>Skin Color:</strong> ${character.skin_color || 'n/a'}<br>
            <strong>Birth Year:</strong> ${character.birth_year || 'n/a'}<br>
        `;

        // Display homeworld (planet) info
        const homeworldUrl = character.homeworld;
        const homeworldName = await fetchHomeworld(homeworldUrl);
        characterExtraInfo.innerHTML = `
            <strong>Homeworld:</strong> ${homeworldName}<br>
            <strong>Role in Star Wars:</strong> ${getCharacterRole(character.name)}
        `;

        // Hide the trailer iframe initially
        trailerIframe.style.display = 'none';
        trailerIframe.src = '';
        trailerError.style.display = 'none';
    }

    // Fetch the homeworld name from SWAPI
    async function fetchHomeworld(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.name || 'Unknown'; // Return homeworld name or "Unknown" if not available
        } catch (error) {
            console.error('Error fetching homeworld:', error);
            return 'Unknown';
        }
    }

    // Back button functionality
    backButton.addEventListener('click', () => {
        characterDetails.style.display = 'none';
        characterList.style.display = 'grid'; // Show character list again
        trailerIframe.style.display = 'none'; // Hide trailer iframe
        trailerIframe.src = ''; // Reset iframe source
    });

    // Search button functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const filteredCharacters = characters.filter(character =>
            character.name.toLowerCase().includes(query)
        );

        if (filteredCharacters.length > 0) {
            renderCharacterList(filteredCharacters);
        } else {
            characterList.innerHTML = `<p>No results found</p>`; // Display message if no results
        }
    });

    // Movie trailer button functionality
    movieTrailerButton.addEventListener('click', () => {
        const trailerUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder trailer link

        trailerIframe.style.display = 'block'; // Show iframe
        trailerIframe.src = trailerUrl; // Set iframe src to the YouTube link

        // Simulate YouTube-like behavior
        try {
            const isValid = isValidYouTubeUrl(trailerUrl);
            if (!isValid) {
                throw new Error('Invalid YouTube link');
            }
            trailerError.style.display = 'none'; // Hide error if valid
        } catch (error) {
            trailerIframe.style.display = 'none'; // Hide iframe
            trailerError.style.display = 'block'; // Show error message
            trailerError.textContent = "Error loading trailer. Please try again.";
        }
    });

    // Helper function to validate YouTube URL
    function isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu)\.(com|be)\/(watch\?v=|embed\/)[\w-]+$/;
        return youtubeRegex.test(url);
    }
});