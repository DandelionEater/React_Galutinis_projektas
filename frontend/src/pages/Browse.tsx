import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const ANILIST_API = 'https://graphql.anilist.co';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [seasonal, setSeasonal] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchCategory = async (sort: string[], variables: any = {}) => {
    const query = `
      query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: ${sort.join(', ')}, season: $season, seasonYear: $seasonYear) {
            id
            type
            title { romaji }
            coverImage { medium }
          }
        }
      }
    `;
    try {
      const res = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { page: 1, perPage: 20, ...variables } }),
      });
      const json = await res.json();
      return json.data.Page.media;
    } catch (err) {
      console.error('Error fetching category:', err);
      return [];
    }
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
            coverImage { medium }
          }
        }
      }
    `;

    let results: any[] = [];
    try {
      if (selectedFilter === 'ALL') {
        const animeResults = await fetchGraphQL(query, { search: searchQuery, type: 'ANIME' });
        const mangaResults = await fetchGraphQL(query, { search: searchQuery, type: 'MANGA' });
        results = [...animeResults, ...mangaResults];
      } else {
        results = await fetchGraphQL(query, { search: searchQuery, type: selectedFilter });
      }
      setSearchResults(results);
    } catch (err) {
      console.error('Error fetching search results:', err);
    }
  };

  const fetchGraphQL = async (query: string, variables: any) => {
    const res = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data.Page.media;
  };

  const loadCategories = async () => {
    setTrending(await fetchCategory(['TRENDING_DESC']));

    const now = new Date();
    const month = now.getMonth();
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const currentSeasonIndex = Math.floor(month / 3);
    const currentSeason = seasons[currentSeasonIndex];
    const currentYear = now.getFullYear();

    const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
    const nextSeason = seasons[nextSeasonIndex];
    const nextSeasonYear = nextSeasonIndex === 0 ? currentYear + 1 : currentYear;

    setSeasonal(
      await fetchCategory(['POPULARITY_DESC'], {
        season: currentSeason,
        seasonYear: currentYear,
      })
    );

    setUpcoming(
      await fetchCategory(['POPULARITY_DESC'], {
        season: nextSeason,
        seasonYear: nextSeasonYear,
      })
    );
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
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="ANIME">Anime</option>
          <option value="MANGA">Manga</option>
        </select>
        <button className="btn btn-primary" onClick={fetchSearch}>
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h5>Search Results</h5>
          <div className="row">
            {searchResults.map((item) => (
              <div className="col-6 col-md-3 col-lg-2 mb-4" key={item.id}>
                <Link
                  to={`/media/${item.id}`}
                  className="text-decoration-none text-reset me-3"
                  style={{ minWidth: '150px' }}
                >
                  <div className="card h-100">
                    <img
                      src={item.coverImage.medium}
                      className="card-img-top"
                      style={{ width: '190px', height: '250px', objectFit: 'cover', alignSelf: 'center' }}
                      alt={item.title.romaji}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-truncate mb-1" title={item.title.romaji}>
                        {item.title.romaji}
                      </h6>
                      <p className="card-text text-muted small mb-2">{item.type}</p>
                      <button className="btn btn-outline-success btn-sm w-100">Save</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <>
          <CategorySection title="Trending Now" items={trending} />
          <CategorySection title="Popular This Season" items={seasonal} />
          <CategorySection title="Upcoming Next Season" items={upcoming} />
        </>
      )}
    </div>
  );
};

const CategorySection = ({ title, items }: { title: string; items: any[] }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
  
    const handleWheel = (e: React.WheelEvent) => {
        if (carouselRef.current) {
          if (e.deltaY !== 0) {
            e.preventDefault();
            carouselRef.current.scrollLeft += e.deltaY;
          }
        }
      };
  
    const lockBodyScroll = () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflowY = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    };
      
    const unlockBodyScroll = () => {
        document.body.style.overflowY = 'auto';
        document.body.style.paddingRight = '';
    };
  
    return (
      <div className="mb-5">
        <h5 className="mb-3">{title}</h5>
        <div
          ref={carouselRef}
          className="d-flex overflow-auto"
          style={{ cursor: 'grab', overflowY: 'hidden' }}
          onWheel={handleWheel}
          onMouseEnter={lockBodyScroll}
          onMouseLeave={unlockBodyScroll}
        >
          {items.map((item) => (
            <Link
              to={`/media/${item.id}`}
              className="me-3 text-decoration-none text-reset"
              style={{ minWidth: '150px' }}
              key={item.id}
            >
              <div className="card h-100">
                <img
                  src={item.coverImage.medium}
                  className="card-img-top"
                  style={{ width: '150px', height: '210px', objectFit: 'cover' }}
                  alt={item.title.romaji}
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate mb-1" title={item.title.romaji}>
                    {item.title.romaji}
                  </h6>
                  <p className="card-text text-muted small mb-2">{item.type}</p>
                  <button className="btn btn-outline-success btn-sm w-100">Save</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

export default Browse;
