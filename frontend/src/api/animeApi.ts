const API_URL = 'http://localhost:3000/api/animes'; // Priklausomai nuo jūsų serverio vietos

// Gauti visus anime
export const fetchAnimes = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Klaida gaunant anime:", error);
    return [];
  }
};

// Sukurti naują anime
export const createAnime = async (animeData: any) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animeData),
    });
    const data = await response.json();
    console.log("naujas anime:", data);
    return data;
  } catch (error) {
    console.error("Klaida kuriant anime:", error);
    return null;
  }
};

// Atnaujinti anime pagal ID
export const updateAnime = async (id: string, animeData: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animeData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Klaida atnaujinant anime:", error);
    return null;
  }
};

// Pašalinti anime pagal ID
export const deleteAnime = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Klaida pašalinant anime:", error);
    return null;
  }
};
