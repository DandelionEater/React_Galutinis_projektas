import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '../types/types';

interface Props {
  media: MediaItem;
  onClose: () => void;
  onSave: (updatedMedia: MediaItem) => void;
  onRemove: (id: number) => void;
}

const MediaEditOverlay: React.FC<Props> = ({ media, onClose, onSave, onRemove }) => {
  const [episodesWatched, setEpisodesWatched] = useState(media.episodesWatched);
  const [rating, setRating] = useState(media.rating ?? 0);
  const [status, setStatus] = useState(media.status);
  const [isVisible, setIsVisible] = useState(true);

  const handleSave = () => {
    onSave({ ...media, episodesWatched, rating, status });
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false); // start fade-out animation
    setTimeout(onClose, 300); // delay onClose to match animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal show centered onHide={handleClose} backdrop={false}>
              <Modal.Header closeButton>
                <Modal.Title>Edit {media.title}</Modal.Title>
              </Modal.Header>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Modal.Body>
                  <img src={media.imageUrl} alt={media.title} className="img-fluid mb-3" />
                  <Form>
                    <Form.Group controlId="episodesWatched">
                      <Form.Label>Episodes Watched</Form.Label>
                      <Form.Control
                        type="number"
                        value={episodesWatched}
                        onChange={(e) => setEpisodesWatched(Number(e.target.value))}
                      />
                    </Form.Group>

                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        max={10}
                        min={0}
                      />
                    </Form.Group>

                    <Form.Group controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as MediaItem['status'])
                        }
                      >
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                        <option value="dropped">Dropped</option>
                        <option value="planning">Planning</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
              </motion.div>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="danger" onClick={() => { onRemove(media.id); handleClose(); }}>Remove</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaEditOverlay;
