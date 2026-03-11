import type { Title } from "./Title";

export type TitlesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Title[];
};
