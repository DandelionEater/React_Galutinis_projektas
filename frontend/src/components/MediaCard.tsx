import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../types/types';

type MediaCardProps = {
  media: MediaItem;
  onEdit: () => void;
};

const MediaCard = ({ media, onEdit }: MediaCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="media-card position-relative shadow-sm border-0"
      style={{ cursor: 'pointer', height: '120px', overflow: 'hidden' }}
    >
      <div className="d-flex h-100">
        <div
          className="position-relative"
          onMouseEnter={(e) => {
            const overlay = e.currentTarget.querySelector('.overlay-trigger') as HTMLElement;
            overlay.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const overlay = e.currentTarget.querySelector('.overlay-trigger') as HTMLElement;
            overlay.style.opacity = '0';
          }}
        >
          <Card.Img
            src={media.imageUrl}
            alt={media.title}
            style={{ width: '80px', height: '100%', objectFit: 'cover' }}
          />
          <div
            className="overlay-trigger position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ opacity: 0, transition: 'opacity 0.3s' }}
            onClick={onEdit}
          >
            <span className="text-white fs-5">...</span>
          </div>
        </div>

        <Card.Body className="p-2 d-flex flex-column justify-content-center">
          <Card.Title
            className="fs-6 text-primary mb-1"
            onClick={() => navigate(`/media/${media.id}`)}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {media.title}
          </Card.Title>
          <Card.Text className="mb-0">
            <small>EP: {media.episodesWatched}/{media.totalEpisodes || '??'}</small>
            <br />
            <small>Rating: {media.rating ?? 'N/A'}/10</small>
          </Card.Text>
        </Card.Body>
      </div>
    </Card>
  );
};

export default MediaCard;
