const API_URL = 'http://localhost:3000/api/animes';

export const enum WatchStatus {
    Planned,
    Watching,
    Paused,
    Dropped,
    Completed
  }
  
  export class Anime {
    animeId: number = -1;
    completedEpisodes: number = 0;
    score: number = 0;
    status: WatchStatus = WatchStatus.Planned;
  }

export const getAllFromList = async () => {
    const response = await (await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ?? ""
        }
    })).json();

    return response as Anime[];
}

export const getFromList = async (index: number) => {
    const response = await (await fetch(`${API_URL}/${index}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ?? ""
        }
    })).json();

    return response as Anime;
}

export const addToList = async (animeid: number) => {
    var anime = new Anime();

    anime.animeId = animeid;

    const response = await (await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ?? ""
        },
        body: JSON.stringify({ anime: anime })
    })).json();

    return response as Anime[];
}

export const updateEntry = async (index: number, modifiedAnime: { completedEpisodes?: number | undefined, score?: number | undefined, status?: WatchStatus | undefined}) => {
    const response = await (await fetch(`${API_URL}/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ?? ""
        },
        body: JSON.stringify({anime: modifiedAnime})
    })).json();

    return response as Anime;
}

export const deleteEntry = async (index: number) => {
    const response = await (await fetch(`${API_URL}/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ?? ""
        }
    })).json();

    return response;
}