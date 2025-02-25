import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard.jsx";
import { searchMovies, getPopularMovies } from "../services/api.js";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            setLoading(true);
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.error(err);
                setError("Failed to load popular movies...");
            } finally {
                setLoading(false);
            }
        };

        if (!searchQuery.trim()) {
            loadPopularMovies();
        } else {
            const debounceTimer = setTimeout(() => {
                performSearch(searchQuery);
            }, 500); // Debounce delay for typing
            return () => clearTimeout(debounceTimer);
        }
    }, [searchQuery]);

    const performSearch = async (query) => {
        setLoading(true);
        try {
            const searchResults = await searchMovies(query);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load search results.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="home">
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchQueryChange} // Update input value
                />
                <button type="submit" className="search-button">
                    Search
                </button>

            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))
                    ) : (
                        <div className="not-found">No movies found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;