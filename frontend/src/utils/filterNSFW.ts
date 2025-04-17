const NSFW_KEYWORDS = [
    "ecchi",
    "hentai",
    "yaoi",
    "yuri",
    "smut",
    "mature",
    "adult",
    "futanari",
    "loli",
    "shotacon",
    "incest",
    "bdsm",
  ];
  
  export function filterNSFW(mediaList: any[]) {
    return mediaList.filter((media) => {
      const genreList = media.genres?.map((g: string) => g.toLowerCase()) || [];
      const tagList = media.tags?.map((tag: any) => tag.name.toLowerCase()) || [];
  
      const hasNSFW = NSFW_KEYWORDS.some((keyword) =>
        genreList.includes(keyword) || tagList.includes(keyword)
      );
  
      return !hasNSFW;
    });
  }