export type MediaItem = {
    id: number;                 // Unique ID of the media
    title: string;              // Title of the media
    imageUrl: string;           // URL of the media's image (cover art)
    episodesWatched: number;    // Number of episodes (or chapters) the user has watched/finished
    totalEpisodes?: number;     // Total number of episodes (if applicable)
    rating?: number;            // User rating for the media (out of 10)
    status: 'watching' | 'completed' | 'paused' | 'dropped' | 'planning'; // Current status of the media
    type: 'anime' | 'manga';    // Type of media (anime or manga)
};

export type SearchAndFilterProps = {
    search: string; // Search query text
    onSearchChange: (value: string) => void; // Callback to handle search input change
    filter: 'all' | 'watching' | 'completed' | 'paused' | 'dropped' | 'planning'; // Current filter
    onFilterChange: (value: 'all' | 'watching' | 'completed' | 'paused' | 'dropped' | 'planning') => void; // Callback to handle filter change
};
  
export type MediaToggleProps = {
    current: 'anime' | 'manga';  // Current type (anime or manga)
    onChange: (value: 'anime' | 'manga') => void;  // Callback to handle type change
};
