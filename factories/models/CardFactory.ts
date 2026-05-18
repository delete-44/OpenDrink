import { Card } from "@/src/models/Card";
import { TCardData } from "@/src/types";

export function CardFactory(overrides: Partial<TCardData> = {}) {
  return new Card({
    id: 1,
    deck_id: -1,
    content: "Test Card",
    created_at: "1970-01-01",
    updated_at: "1970-01-02",
    ...overrides,
  });
}
