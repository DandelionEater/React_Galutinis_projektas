import React, { useState } from 'react';
import { createAnime } from '../api/animeApi';

const AddAnime: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number>(0);  // Rating laukelis
  const [episodes, setEpisodes] = useState<number>(0);  // Episodes laukelis
  const [genre, setGenre] = useState('');  // Genre laukelis

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pridedame visus laukus, kad atitiktų API reikalavimus
    const animeData = { title, description, rating, episodes, genre };

    const newAnime = await createAnime(animeData);

    if (newAnime) {
      alert("Anime pridėtas!");
      setTitle('');
      setDescription('');
      setRating(0);
      setEpisodes(0);
      setGenre('');
    } else {
      alert("Klaida pridedant anime.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Pridėti Anime</h2>
      <form onSubmit={handleSubmit}>
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
            placeholder="Įvertinimas"
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
            placeholder="Epizodų skaičius"
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
            placeholder="Žanras"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Pridėti</button>
      </form>
    </div>
  );
};

export default AddAnime;
