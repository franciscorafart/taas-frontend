import { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import StripeModal from "StripeModal";
// import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import { TarotCard } from "shared/types";
import { TAROT_DECK } from "utils/constants";
import { getThreeCardReading } from "requests/reading";

export default function ReadingPage() {
  const [cardThrow, setCardThrow] = useState<TarotCard[] | undefined>(
    undefined
  );
  const [reading, setReading] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");

  const formatContent = (res: string) => {
    // Split the JSON string into individual sections
    const sections = res.split("\n\n");
    // Format the sections into HTML markup
    const formattedSections = sections.map((section, sIdx) => {
      const lines = section.split("\\n");
      const title = lines[0].replace(/\*\*|\*\*/g, ""); // Extracting the title without asterisks
      const content = lines.slice(1).map((line, lIdx) => (
        <li key={`section-${sIdx}-line-${lIdx}`} className="text-sm">
          {line.replace(/^\*\s/, "")}
        </li>
      ));

      return (
        <div className={`section-${title}`}>
          <h2 className="text-md">{`${title}`}</h2>
          <ul>{content}</ul>
        </div>
      );
    });
    return <>{formattedSections.map((s) => s)}</>;
  };

  const handleThrow = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsGenerating(true);
      const cards = [];
      for (let i = 0; i < 3; i++) {
        cards.push(TAROT_DECK[Math.floor(Math.random() * 78)]);
      }

      setCardThrow(cards);

      // TODO: Implement request to the backend
      const res = await getThreeCardReading({ question, cards });
      if (!res) {
        throw new Error("Failed to generate reading");
      }
      setReading(res.data);
      setIsGenerating(false);
    } catch (err: any) {
      console.error("Error", err.message);
      setIsGenerating(false);
      setReading(
        "Oops. An error occurred while generating the reading. Please try again later."
      );
    }
  };
  const content = reading && cardThrow?.length ? formatContent(reading) : null;

  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            <span className="text-yellow-500">Past, Present, Future</span>{" "}
            Reading
          </h2>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white">
          Write down your question and give some context on it to get the best
          card reading.
        </p>
        <div className="my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10">
          <div className="space-y-10 my-10 py-8 px-4 mx-auto sm:max-w-lg">
            <form onSubmit={handleThrow} className="flex flex-col gap-2">
              <h3 className="text-md">Your Question</h3>
              <textarea
                name="question"
                placeholder="Your question here (give some context for a better result)"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="text-gray-600 "
              />
              <button
                type="submit"
                className="min-w-[7rem] font-medium text-gray-800/90 bg-yellow-50 shadow-md ring-1 ring-inset ring-slate-200 py-2 px-4 rounded-md hover:bg-yellow-100 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-none"
                disabled={isGenerating}
              >
                Get your spread
              </button>
            </form>
            <div className="border-b-2 border-gray-200 dark:border-gray-100/10"></div>
            <div className="flex gap-6">
              {cardThrow?.length &&
                cardThrow.map((card) => (
                  <div key={card.value} className="flex flex-col">
                    <p>{card.label}</p>
                    <img
                      src={`/marseille/${card.value}.jpg`}
                      alt={card.label}
                    />
                  </div>
                ))}
            </div>
            {isGenerating && (
              <>
                <Spinner />
                ...Reading your cards
              </>
            )}
            {content && <div className="mt-6 space-y-6">{content}</div>}
          </div>
        </div>
      </div>
      {/* <Button onClick={() => setDisplayForm(true)}>Buy More Credits</Button>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} /> */}
    </div>
  );
}
