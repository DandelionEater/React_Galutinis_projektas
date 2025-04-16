import { Row, Col } from 'react-bootstrap';
import MediaCard from './MediaCard';
import { MediaItem } from '../types/types';

interface MediaGridProps {
  mediaList: MediaItem[];
  onEdit: (media: MediaItem) => void;
}

const MediaGrid = ({ mediaList, onEdit }: MediaGridProps) => {
  return (
    <Row xs={1} sm={2} className="g-3 mt-3">
      {mediaList.map(media => (
        <Col key={media.id}>
          <MediaCard media={media} onEdit={() => onEdit(media)} />
        </Col>
      ))}
    </Row>
  );
};

export default MediaGrid;
