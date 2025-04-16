import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { MediaToggleProps } from '../types/types';

const MediaToggle = ({ current, onChange }: MediaToggleProps) => {
  return (
    <div className="text-center mb-3">
      <ToggleButtonGroup
        type="radio"
        name="media-type"
        value={current}
        onChange={onChange}
      >
        <ToggleButton id="anime-toggle" variant="outline-primary" value="anime">
          Anime
        </ToggleButton>
        <ToggleButton id="manga-toggle" variant="outline-primary" value="manga">
          Manga
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default MediaToggle;
