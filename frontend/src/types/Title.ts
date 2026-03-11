export interface Title {
  id: number;
  name: string;
  original_title: string;
  year: number | null;
  type: string;
  type_display: string;
  description: string;
  seasons: number;
  categories: {
    id: number;
    name: string;
  }[];
  actors: {
    id: number;
    name: string;
  }[];
  platforms:  {
    id: number;
    name: string;
  }[];
  tracking: {
    status: string;
    status_display: string;
    rating: number | null;
    current_episode: number | null;
    opinion: string;
  }
}
