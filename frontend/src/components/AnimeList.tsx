import React, { useEffect, useState } from 'react';
import { fetchAnimes } from '../api/animeApi';

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    const loadAnimes = async () => {
      try {
        const fetchedAnimes = await fetchAnimes();
        setAnimes(fetchedAnimes);
      } catch (err) {
        setError('Failed to load animes');
      } finally {
        setLoading(false);  // End loading after fetch completes
      }
    };
    loadAnimes();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading anime list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Anime List</h1>

      {/* Display empty state if no anime is available */}
      {animes.length === 0 ? (
        <p>Anime sąrašas tuščias. Pridėkite pirmąjį anime!</p>
      ) : (
        <ul className="list-group">
          {animes.map((anime) => (
            <li key={anime._id} className="list-group-item">
              <h3>{anime.name}</h3> {/* Use `name` instead of `title` */}
              <p>{anime.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnimeList;
