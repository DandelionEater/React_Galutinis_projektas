import { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { filterNSFW } from "../utils/filterNSFW";

type Anime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
  bannerImage?: string;
};

const Home = () => {
  const [popular, setPopular] = useState<Anime[]>([]);
  const [recent, setRecent] = useState<Anime[]>([]);
  const [recommended, setRecommended] = useState<Anime[]>([]);

  useEffect(() => {
    const query = `
        query {
        popular: Page(perPage: 5) {
            media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title { romaji }
            coverImage { large }
            bannerImage
            genres
            tags { name }
            }
        }
        recent: Page(perPage: 8) {
            media(sort: START_DATE_DESC, type: ANIME) {
            id
            title { romaji }
            coverImage { large }
            genres
            tags { name }
            }
        }
        recommended: Page(perPage: 8) {
            media(sort: TRENDING_DESC, type: ANIME) {
            id
            title { romaji }
            coverImage { large }
            genres
            tags { name }
            }
        }
        }
    `;

    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPopular(filterNSFW(data.data.popular.media));
        setRecent(filterNSFW(data.data.recent.media));
        setRecommended(filterNSFW(data.data.recommended.media));
      })
      .catch((err) => console.error("Error fetching AniList data:", err));
  }, []);

  return (
    <Container className="mt-4">
      {/* Carousel */}
      <Carousel>
        {popular.map((anime) => (
          <Carousel.Item key={anime.id} style={{ height: "400px", overflow: "hidden" }}>
            <Link to={`/media/${anime.id}`}>
              <img
                className="d-block w-100"
                src={anime.bannerImage || anime.coverImage.large}
                alt={anime.title.romaji}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                loading="lazy"
              />
              <Carousel.Caption>
                <h5>{anime.title.romaji}</h5>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Recent Releases */}
      <h3 className="mt-5 mb-3">📅 Recent Releases</h3>
      <div className="d-flex justify-content-center">
        <Row className="w-auto">
          {recent.map((anime) => (
            <Col md={2} sm={4} xs={6} key={anime.id} className="mb-4">
              <Link to={`/media/${anime.id}`} className="text-decoration-none">
                <Card className="h-100">
                  <div style={{ height: "220px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={anime.coverImage.large}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <Card.Body className="p-2">
                    <Card.Title className="fs-6 text-truncate" title={anime.title.romaji}>
                      {anime.title.romaji}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recommendations */}
      <h3 className="mt-5 mb-3">✨ Recommended For You</h3>
      <div className="d-flex justify-content-center">
        <Row className="w-auto">
          {recommended.map((anime) => (
            <Col md={2} sm={4} xs={6} key={anime.id} className="mb-4">
              <Link to={`/media/${anime.id}`} className="text-decoration-none">
                <Card className="h-100">
                  <div style={{ height: "220px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={anime.coverImage.large}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <Card.Body className="p-2">
                    <Card.Title className="fs-6 text-truncate" title={anime.title.romaji}>
                      {anime.title.romaji}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Home;
