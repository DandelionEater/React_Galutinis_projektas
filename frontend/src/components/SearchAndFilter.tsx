import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { SearchAndFilterProps } from '../types/types';

const statuses = ['all', 'watching', 'completed', 'paused', 'dropped', 'planning'];

const SearchAndFilter = ({ search, onSearchChange, filter, onFilterChange }: SearchAndFilterProps) => {
  return (
    <div className="p-3 border rounded shadow-sm">
      <Form.Group className="position-relative mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <X
            size={18}
            className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
            style={{ cursor: 'pointer' }}
            onClick={() => onSearchChange('')}
          />
        )}
      </Form.Group>

      <div className="mt-4">
        <small className="text-muted">Filter by status:</small>
        <ButtonGroup vertical className="w-100 mt-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'outline-secondary'}
              onClick={() => onFilterChange(status as any)}
              className="text-capitalize"
            >
              {status}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default SearchAndFilter;
