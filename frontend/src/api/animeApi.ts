const API_URL = 'http://localhost:3000/api/anilist';

export const getAnime = async (animeid: number) => {
  try {
    const response = await fetch(`${API_URL}/get/${animeid}`, {
      method: 'GET'
    });
    const data: {
      id: number;
      title: string;
      type: string;
      description: string;
      coverImage: string;
      episodes: number;
      genres: string[];
      score: number;
    } = (await response.json()).response; 
    
    return data;
  } catch (error) {
    console.error("Klaida gaunant anime:", error);
    return {} as {
      id: number;
      title: string;
      type: string;
      description: string;
      coverImage: string;
      episodes: number;
      genres: string[];
      score: number;
    };
  }
};

