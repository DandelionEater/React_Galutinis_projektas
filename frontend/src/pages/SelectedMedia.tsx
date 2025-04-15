import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const ANILIST_API = 'https://graphql.anilist.co';

const SelectedMedia = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setMedia(json.data.Media);
      } catch (err) {
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!media) return <div className="container py-5">Not found.</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={media.coverImage.large}
            alt={media.title.romaji}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h2>{media.title.romaji}</h2>
          <h5 className="text-muted">{media.type}</h5>

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

          <button className="btn btn-success mt-4">Save to My List</button>
        </div>
      </div>
    </div>
  );
};

export default SelectedMedia;
