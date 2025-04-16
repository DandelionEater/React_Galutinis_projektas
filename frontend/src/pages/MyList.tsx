import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MediaCard from '../components/MediaCard';
import SearchAndFilter from '../components/SearchAndFilter';
import MediaToggle from '../components/MediaToggle';
import MediaEditOverlay from '../components/MediaEditOverlay';
import { MediaItem } from '../types/types';

const MyList = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'watching' | 'completed' | 'paused' | 'dropped' | 'planning'>('all');
  const [type, setType] = useState<'anime' | 'manga'>('anime');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  useEffect(() => {
    const dummyList: MediaItem[] = [
        {
          id: 123,
          title: 'Naruto',
          imageUrl: 'https://placehold.co/100x150',
          type: 'anime',
          status: 'watching',
          episodesWatched: 43,
          totalEpisodes: 220,
          rating: 8,
        },
        {
            id: 456,
            title: 'One Piece',
            imageUrl: 'https://placehold.co/100x150',
            type: 'anime',
            status: 'completed',
            episodesWatched: 700,
            totalEpisodes: 1050,
            rating: 9,
        },
    ];
    setMediaList(dummyList);
  }, []);

  const handleSave = (updatedMedia: MediaItem) => {
    setMediaList(prevList => prevList.map(media => media.id === updatedMedia.id ? updatedMedia : media));
  };

  const handleRemove = (id: number) => {
    setMediaList(prevList => prevList.filter(media => media.id !== id));
  };

  const filteredList = mediaList.filter(media => {
    const matchesSearch = media.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || media.status === filter;
    const matchesType = media.type === type;
    return matchesSearch && matchesFilter && matchesType;
  });

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <SearchAndFilter
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
          />
        </Col>
        <Col md={8}>
          <MediaToggle current={type} onChange={setType} />
          <Row xs={1} md={2} className="g-4 mt-3">
            {filteredList.map(media => (
              <MediaCard
              key={media.id}
              media={media}
              onEdit={() => setSelectedMedia(media)}
            />
            ))}
          </Row>
        </Col>
      </Row>
      {selectedMedia && (
        <MediaEditOverlay
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onSave={handleSave}
          onRemove={handleRemove}
        />
      )}
    </Container>
  );
};

export default MyList;
