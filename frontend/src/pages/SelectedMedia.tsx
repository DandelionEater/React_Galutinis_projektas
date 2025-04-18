import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getAllFromList, addToList } from '../utils/mediaUpdate';
import MediaEditOverlay from '../components/MediaEditOverlay';
import ToastPopup from '../components/ToastPopup';
import { MediaItem } from '../types/types';

const ANILIST_API = 'https://graphql.anilist.co';

const SelectedMedia = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    addToList(Number(id));
    setToastMessage(`Successfully saved: ${media.title.romaji}`);
    setShowToast(true);
    fetchMedia();
  };

  const fetchMedia = async () => {
    const query = `
      query ($id: Int) {
        Media(id: $id) {
          id
          type
          title {
            romaji
            english
            native
          }
          description(asHtml: true)
          coverImage {
            large
          }
          format
          status
          episodes
          chapters
          volumes
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          averageScore
          genres
          relations {
            edges {
              relationType
              node {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                }
                type
              }
            }
          }
        }
      }
    `;
    try {
      const res = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { id: Number(id) } }),
      });
      const json = await res.json();
      const mediaData = json.data.Media;
      const list = await getAllFromList();
      const isInMyList = list.some((entry: any) => Number(entry.animeId) === Number(mediaData.id));
      setMedia({ ...mediaData, isInMyList });
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!media) return <div className="container py-5">Not found.</div>;

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row">
        <div className="col-md-4">
          <img
            src={media.coverImage.large}
            alt={media.title.romaji}
            className="img-fluid rounded shadow"
            loading='lazy'
          />
        </div>
        <div className="col-md-8">
          <h2>{media.title.romaji}</h2>
          <h6 className="text-muted">{media.title.english || 'No English Name...'}</h6>
          <h5 className="text-muted">{media.type}</h5>

          <div className="mb-3">
            {media.genres?.map((genre: string) => (
              <span key={genre} className="badge bg-primary me-2 mb-2">
                {genre}
              </span>
            ))}
          </div>

          <div
            className="mt-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(media.description || 'No description available.')
            }}
          />

          <ul className="list-group list-group-flush mt-4">
            <li className="list-group-item"><strong>Format:</strong> {media.format || 'N/A'}</li>
            <li className="list-group-item"><strong>Status:</strong> {media.status || 'N/A'}</li>
            {media.episodes && <li className="list-group-item"><strong>Episodes:</strong> {media.episodes}</li>}
            {media.chapters && <li className="list-group-item"><strong>Chapters:</strong> {media.chapters}</li>}
            {media.volumes && <li className="list-group-item"><strong>Volumes:</strong> {media.volumes}</li>}
            <li className="list-group-item">
              <strong>Start Date:</strong> {media.startDate?.year || 'N/A'}-{media.startDate?.month || '??'}-{media.startDate?.day || '??'}
            </li>
            <li className="list-group-item">
              <strong>End Date:</strong> {media.endDate?.year || 'N/A'}-{media.endDate?.month || '??'}-{media.endDate?.day || '??'}
            </li>
            <li className="list-group-item"><strong>Average Score:</strong> {media.averageScore || 'N/A'}</li>
          </ul>

          <button
          className="btn btn-success mt-4"
          onClick={() => {
            if (media.isInMyList) {
              const mediaItem: MediaItem = {
                id: media.id,
                title: media.title.romaji,
                imageUrl: media.coverImage.large,
                type: media.type.toLowerCase(),
                status: 'planning',
                episodesWatched: 0,
                totalEpisodes: media.episodes || 0,
                rating: 0,
              };

              setSelectedMediaItem(mediaItem);
              setShowOverlay(true);
            } else {
              handleSave();
            }
          }}
        >
          {media.isInMyList ? 'Edit media' : 'Save to My List'}
        </button>

          {/* Toast */}
          <ToastPopup show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

          {media.relations?.edges?.length > 0 && (
            <div className="mt-5">
              <h4>Related Media</h4>
              <div className="row">
                {media.relations.edges.map((edge: any) => (
                  <div className="col-6 col-md-3 col-lg-2 mb-4" key={edge.node.id} style={{ minWidth: '160px' }}>
                    <Link to={`/media/${edge.node.id}`} className="text-decoration-none text-reset">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={edge.node.coverImage.medium}
                          alt={edge.node.title.romaji}
                          className="card-img-top"
                          style={{ width: '100%', height: '210px', objectFit: 'cover' }}
                          loading='lazy'
                        />
                        <div className="card-body p-2 d-flex flex-column">
                          <h6 className="card-title mb-1 text-truncate" title={edge.node.title.romaji}>
                            {edge.node.title.romaji || 'No title'}
                          </h6>
                          <small className="text-muted">{edge.relationType}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showOverlay && selectedMediaItem && (
            <MediaEditOverlay
              media={selectedMediaItem}
              onClose={() => setShowOverlay(false)}
              onSave={(updatedMedia) => {
                setSelectedMediaItem(updatedMedia);
                setShowOverlay(false);
              }}
              onRemove={(id) => {
                setSelectedMediaItem(null);
                setShowOverlay(false);
                navigate('/');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedMedia;
