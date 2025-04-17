import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { filterNSFW } from '../utils/filterNSFW';
import { addToList, getAllFromList, Anime } from '../utils/mediaUpdate';
import ToastPopup from '../components/ToastPopup';
import { MediaItem } from '../types/types';
import MediaEditOverlay from '../components/MediaEditOverlay';

const ANILIST_API = 'https://graphql.anilist.co';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ANIME' | 'MANGA'>('ALL');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [seasonal, setSeasonal] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [list, setList] = useState<Anime[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const fetchGraphQL = async (query: string, variables: any) => {
    const res = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data.Page.media;
  };

  const baseMediaQuery = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $search: String, $type: MediaType) {
      Page(page: $page, perPage: $perPage) {
        media(sort: [POPULARITY_DESC], season: $season, seasonYear: $seasonYear, search: $search, type: $type) {
          id
          type
          title { romaji }
          coverImage { large }
          genres
          tags { name }
        }
      }
    }
  `;

  const fetchTrending = async (currentList: Anime[]) => {
    const query = `
      query {
        Page(page: 1, perPage: 20) {
          media(sort: TRENDING_DESC) {
            id
            type
            title { romaji }
            coverImage { large }
            genres
            tags { name }
          }
        }
      }
    `;
    const media = await fetchGraphQL(query, {});
    return filterNSFW(media.map((m: any) => ({
      ...m,
      isInMyList: currentList.some(l => l.animeId === m.id)
    })));
  };

  const fetchSeasonal = async (currentList: Anime[]) => {
    const now = new Date();
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const currentSeasonIndex = Math.floor(now.getMonth() / 3);
    const currentSeason = seasons[currentSeasonIndex];
    const currentYear = now.getFullYear();

    const media = await fetchGraphQL(baseMediaQuery, {
      page: 1,
      perPage: 20,
      season: currentSeason,
      seasonYear: currentYear
    });

    return filterNSFW(media.map((m: any) => ({
      ...m,
      isInMyList: currentList.some(l => l.animeId === m.id)
    })));
  };

  const fetchUpcoming = async (currentList: Anime[]) => {
    const now = new Date();
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const currentSeasonIndex = Math.floor(now.getMonth() / 3);
    const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
    const nextSeason = seasons[nextSeasonIndex];
    const nextYear = nextSeasonIndex === 0 ? now.getFullYear() + 1 : now.getFullYear();

    const media = await fetchGraphQL(baseMediaQuery, {
      page: 1,
      perPage: 20,
      season: nextSeason,
      seasonYear: nextYear
    });

    return filterNSFW(media.map((m: any) => ({
      ...m,
      isInMyList: currentList.some(l => l.animeId === m.id)
    })));
  };

  const loadCategories = async () => {
    const currentList = await getAllFromList();
    setList(currentList);

    const trendingData = await fetchTrending(currentList);
    const seasonalData = await fetchSeasonal(currentList);
    const upcomingData = await fetchUpcoming(currentList);

    setTrending(trendingData);
    setSeasonal(seasonalData);
    setUpcoming(upcomingData);
  };

  const fetchSearch = async () => {
    if (!searchQuery) return;
    setHasSearched(true);

    const query = `
      query ($search: String, $type: MediaType) {
        Page(perPage: 20) {
          media(search: $search, type: $type) {
            id
            type
            title { romaji }
            coverImage { large }
            genres
            tags { name }
          }
        }
      }
    `;

    try {
      let results: any[] = [];
      if (selectedFilter === 'ALL') {
        const animeResults = await fetchGraphQL(query, { search: searchQuery, type: 'ANIME' });
        const mangaResults = await fetchGraphQL(query, { search: searchQuery, type: 'MANGA' });
        results = [...animeResults, ...mangaResults];
      } else {
        results = await fetchGraphQL(query, { search: searchQuery, type: selectedFilter });
      }

      const currentList = await getAllFromList();
      setSearchResults(
        filterNSFW(results.map(item => ({
          ...item,
          isInMyList: currentList.some(l => l.animeId === item.id)
        })))
      );
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSave = async (id: number, title: string) => {
    await addToList(id);
    setToastMessage(`Successfully saved: ${title}`);
    setShowToast(true);
    await loadCategories();
  };

  const handleEdit = (item: any) => {
    const mediaToEdit: MediaItem = {
      id: item.id,
      title: item.title.romaji,
      imageUrl: item.coverImage.large,
      episodesWatched: 0,
      rating: 0,
      status: 'watching',
      type: item.type,
    };
    setEditingMedia(mediaToEdit);
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      loadCategories();
    }
  }, [searchQuery]);

  return (
    <div className="container py-4">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for anime or manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setHasSearched(false);
            }}
            type="button"
          >
            &times;
          </button>
        )}
        <select
          className="form-select"
          style={{ maxWidth: '120px' }}
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as any)}
        >
          <option value="ALL">All</option>
          <option value="ANIME">Anime</option>
          <option value="MANGA">Manga</option>
        </select>
        <button className="btn btn-primary" onClick={fetchSearch}>Search</button>
      </div>

      {searchResults.length > 0 && (
        <MediaGrid title="Search Results" items={searchResults} onSave={handleSave} onEdit={handleEdit} />
      )}

      {!hasSearched && (
        <>
          <MediaGrid title="Trending Now" items={trending} onSave={handleSave} onEdit={handleEdit} />
          <MediaGrid title="Popular This Season" items={seasonal} onSave={handleSave} onEdit={handleEdit} />
          <MediaGrid title="Upcoming Next Season" items={upcoming} onSave={handleSave} onEdit={handleEdit} />
        </>
      )}

      <ToastPopup show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

      {editingMedia && (
      <MediaEditOverlay
        media={editingMedia}
        onClose={() => setEditingMedia(null)}
        onSave={(updatedMedia) => {
          // Atnaujinti savo local listą (galima čia arba per reload)
          console.log('Saving changes:', updatedMedia);
          setToastMessage(`Updated: ${updatedMedia.title}`);
          setShowToast(true);
          setEditingMedia(null);
          loadCategories(); // arba atnaujinti tik redaguotą elementą
        }}
        onRemove={(id) => {
          console.log('Removing media with id:', id);
          setToastMessage(`Removed item with ID: ${id}`);
          setShowToast(true);
          setEditingMedia(null);
          loadCategories(); // arba pašalinti tik tą elementą iš local state
        }}
      />
    )}
    </div>
  );
};

const MediaGrid = ({ title, items, onSave, onEdit }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    return () => {
      document.body.style.overflowY = 'auto';
      document.body.style.paddingRight = '';
    };
  }, [location]);

  return (
    <div className="mb-5">
      <h5 className="mb-3">{title}</h5>
      <div
        ref={ref}
        className="d-flex overflow-auto"
        style={{ cursor: 'grab', overflowY: 'hidden' }}
        onWheel={(e) => ref.current && (ref.current.scrollLeft += e.deltaY)}
        onMouseEnter={() => {
          const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
          document.body.style.overflowY = 'hidden';
          document.body.style.paddingRight = `${scrollBarWidth}px`;
        }}
        onMouseLeave={() => {
          document.body.style.overflowY = 'auto';
          document.body.style.paddingRight = '';
        }}
      >
        {items.map((item: any) => (
          <div
          className="card h-100 me-3 d-flex flex-column"
          key={item.id}
          style={{ minWidth: '150px', height: '310px' }} // arba koks aukštis tau patogus
          >
            <Link to={`/media/${item.id}`} className="text-decoration-none text-reset">
              <img src={item.coverImage.large} className="card-img-top" style={{ width: '148px', height: '210px', objectFit: 'cover' }} alt={item.title.romaji} loading="lazy" />
              <div className="card-body p-2">
                <h6 className="card-title text-truncate mb-1" title={item.title.romaji}>{item.title.romaji}</h6>
                <p className="card-text text-muted small mb-2">{item.type}</p>
              </div>
            </Link>
            <div className="p-2 pt-0">
              <button className="btn btn-outline-success btn-sm w-100" onClick={() => item.isInMyList ? onEdit(item) : onSave(item.id, item.title.romaji)}>
                {item.isInMyList ? 'Edit' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
