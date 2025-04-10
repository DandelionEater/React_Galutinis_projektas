import React, { useEffect, useState } from 'react';
import { fetchAnimes } from './api/animeApi';

function App() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number>(0); // Rating state
  const [episodes, setEpisodes] = useState<number>(0); // Episodes state
  const [genre, setGenre] = useState<string>(''); // Genre state

  useEffect(() => {
    const loadAnimes = async () => {
      const fetchedAnimes = await fetchAnimes();
      setAnimes(fetchedAnimes);
    };
    loadAnimes();
  }, []);

  const handleAddAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAnime = {
      title: title,
      description,
      rating,            // Make sure you're sending rating
      episodes,          // Make sure you're sending episodes
      genre,             // Make sure you're sending genre
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/animes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnime),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData); // Log the full error message from the API
        throw new Error('Failed to create anime');
      }
  
      const data = await response.json();
      console.log("Grąžintas anime po pridėjimo:", data);  // Debugging: patikrink, ką grąžina API
  
      if (data) {
        setAnimes([...animes, data]);  // Pridedame naują anime į sąrašą
        setTitle('');
        setDescription('');
        setRating(0);
        setEpisodes(0);
        setGenre('');
      } else {
        console.error('Anime nebuvo pridėtas.');
      }
    } catch (error) {
      console.error('Klaida pridėdant anime:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Anime Tracker</h1>

      {/* Form to add new anime */}
      <form onSubmit={handleAddAnime}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Anime Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Pavadinimas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Aprašymas"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="episodes" className="form-label">Episodes</label>
          <input
            type="number"
            className="form-control"
            id="episodes"
            value={episodes}
            onChange={(e) => setEpisodes(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <input
            type="text"
            className="form-control"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Pridėti Anime</button>
      </form>

      {/* Anime list display */}
      <h2 className="my-4">Anime List</h2>
      <ul className="list-group">
        {animes.length === 0 ? (
          <p>Nėra anime, pridėkite pirmąjį!</p>
        ) : (
          animes.map((anime) => (
            <li key={anime._id} className="list-group-item">
              <h5>{anime.name}</h5>
              <p>{anime.description}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
