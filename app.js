// Ensure that the window loads before executing code
window.addEventListener('load', () => {
    const searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', loadPHP);
});

/**
 * Displays hero data in the specified target div.
 * @param {Object|string} heroData - The data of the hero.
 * @param {HTMLElement} targetDiv - The target div to display the data.
 */
function displayHeroData(heroData, targetDiv) {
    // Clear innerHTML if data is already present
    if (targetDiv.innerHTML !== '') {
        targetDiv.innerHTML = '';
    }

    // Create the necessary HTML elements if the data is not a string
    if (typeof heroData !== 'string') {
        const nameHeader = document.createElement('h3');
        nameHeader.textContent = heroData.alias.toUpperCase();
        targetDiv.appendChild(nameHeader);

        const aliasHeader = document.createElement('h4');
        aliasHeader.textContent = `A.K.A ${heroData.name}`.toUpperCase();
        targetDiv.appendChild(aliasHeader);

        const biographyArea = document.createElement('p');
        biographyArea.textContent = heroData.biography;
        targetDiv.appendChild(biographyArea);
    }
}

/**
 * Inserts the error class when the hero has not been found.
 * @param {string} data - The hero not found message.
 * @param {HTMLElement} targetDiv - The div the class is being added to.
 */
function insertErrorClass(data, targetDiv) {
    if (data.toLowerCase().includes('hero not found')) {
        targetDiv.classList.add('error');
    }
}

/**
 * Removes the error class from the document.
 * @param {HTMLElement} targetDiv - The div the class is being removed from.
 */
function removeErrorClass(targetDiv) {
    if (targetDiv.classList.contains('error')) {
        targetDiv.classList.remove('error');
    }
}

/**
 * Displays the respective data based on the data passed in.
 * @param {Object|string} data - The data of the hero entered into the form.
 * If a hero was entered, a JSON object representing the hero's data is passed into the function.
 */
function displayHeroes(data) {
    const result = document.getElementById('result');

    // Removing the error class from previous queries
    removeErrorClass(result);

    if (typeof data === 'string') {
        // If the data doesn't contain a hero or is empty, insert the error class
        insertErrorClass(data, result);
        result.innerHTML = data;
    } else {
        displayHeroData(data, result);
    }
}

/**
 * Fetches data based on the input entered in the form.
 * @param {string} formData - The data entered in the form.
 */
async function fetchData(formData) {
    const response = await fetch(`superheroes.php?query=${formData}`);

    if (response.ok) {
        // Returns the response as a string
        return response.text();
    } else {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
}

/**
 * Retrieve data from the server after a query is made to the form.
 * @param {Event} event - The event object.
 */
async function loadPHP(event) {
    event.preventDefault();
    const form = document.getElementById('superhero-search');

    try {
        const phpData = await fetchData(form.value);
        const processedData = await handleJSON(phpData);
        console.log(processedData);
        displayHeroes(processedData);
    } catch (error) {
        console.log('There was an error: ' + error);
    }
}

/**
 * Attempts to parse a JSON object from a string passed in.
 * @param {string} data - The data to be parsed.
 * @returns {Object|string} - The parsed data or the original string if parsing fails.
 */
function handleJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
}


