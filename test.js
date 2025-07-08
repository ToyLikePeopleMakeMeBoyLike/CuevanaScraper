const cuevana = require('./src/api');

async function test() {
    try {
        console.log('Testing movie search...');
        const searchResults = await cuevana.getSearch('avengers', 1);
        cuevana.getMovies(0)
            .then((res) => console.log(res));
        console.log('Search results:', JSON.stringify(searchResults, null, 2));

        if (searchResults && searchResults.length > 0) {
            console.log('\nTesting movie details...');
            const movieDetails = await cuevana.getDetail(searchResults[0].id);
            console.log('Movie details:', JSON.stringify(movieDetails, null, 2));
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

test(); 