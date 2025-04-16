import { Url } from "url";

export default class AniList {
    async searchAnime(page: number, query : String | null | undefined = null) {
        const body = await (await this.sendRequest(JSON.stringify({
            query: `query {
                Page(page: ${page}, perPage: 50) {
                    media(${query && query !== "" ? "search: " + '"' + query + '"' : ""}) {
                        id,
                        title {
                            userPreferred
                        },
                        coverImage {
                            medium
                        }
                        description,
                        episodes,
                        genres,
                        meanScore
                    }
                }
            }`
    }))).json();

        const data = body.data.Page.media;

        const arr = data as any[]
        let result:{
            id: number;
            title: string;
            description: string;
            coverImage: Url;
            episodes: number;
            genres: string[];
            score: number;
        }[] = [];

        arr.forEach(anime => result.push(this.parseBody(anime)));

        return result;
    }

    async getAnime(id: number) {
        const body = await (await this.sendRequest(JSON.stringify({
            query:`query {
                Media(id: ${id}) {
                    id,
                    title {
                        userPreferred
                    },
                    coverImage {
                        medium
                    }
                    description,
                    episodes,
                    genres,
                    meanScore
                }
            }`
        }))).json();

        const data = body.data.Media;

        return this.parseBody(data);
    }

    private parseBody(data: any) {
        return {
            id: data.id as number,
            title: data.title.userPreferred as string,
            description: data.description as string,
            coverImage: data.coverImage.medium as Url,
            episodes: data.episodes as number,
            genres: data.genres as string[],
            score: data.meanScore as number 
        }
    }

    private sendRequest(body: BodyInit | null | undefined) : Promise<Response> {
        return fetch("https://graphql.anilist.co", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body,
      });
    }
}