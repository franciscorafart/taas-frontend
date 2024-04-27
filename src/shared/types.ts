export type ScreenSizeType = "desktop" | "mobile" | "tablet";

export type TarotCard = {
  value: string;
  label: string;
};

export enum TarotReadingType {
  PastPresentFuture,
}

export type GeneratedTarotReading = string;
