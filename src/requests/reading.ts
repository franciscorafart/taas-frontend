import { ResponseStatus } from "utils/enums";
import { post } from "./utils";
import { TarotCard } from "shared/types";

type ThreeSpreadPayload = {
  cards: TarotCard[];
  question: string;
};
type PostResponse = {
  success: boolean;
  data: string; // Tarot reading
  status: ResponseStatus;
};

export const getThreeCardReading = async (payload: ThreeSpreadPayload) => {
  const res = await post<PostResponse>({
    route: "reading/three-spread",
    payload,
  });
  return res;
};

export const getThreeCardFreeReading = async (payload: ThreeSpreadPayload) => {
  const res = await post<PostResponse>({
    route: "reading/three-spread-f",
    payload,
  });
  return res;
};
