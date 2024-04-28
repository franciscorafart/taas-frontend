import { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import StripeModal from "StripeModal";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import { TarotCard } from "shared/types";
import { colors } from "shared/theme";
import { TAROT_DECK } from "utils/constants";
import { getThreeCardReading } from "requests/reading";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import styled from "styled-components";

const defaultCards = [
  {
    value: "fool",
    label: "The Fool",
  },
  {
    value: "magician",
    label: "The Magician",
  },
  {
    value: "high_priestess",
    label: "The High Priestess",
  },
];

const ContainerStack = styled.div`
  background-color: ${colors.pastel};
`;

const ContentStack = styled(Stack)`
  padding: 80px 60px;
`;
const TextContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 20px;
  padding: 20px;
`;

const CardStack = styled(Stack)`
  align-items: start;
`;

export default function ReadingPage() {
  const [cardThrow, setCardThrow] = useState<TarotCard[] | undefined>(
    defaultCards
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
          <span>{`${title}`}</span>
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
  // console.log("content", content);
  return (
    <ContainerStack>
      <ContentStack gap={3}>
        <div>
          <h2>
            <span>Past, Present, Future</span> Reading
          </h2>
        </div>
        <p>
          Write down your question and give some context on it to get the best
          card reading.
        </p>

        <Form onSubmit={handleThrow}>
          <Stack gap={3}>
            <Form.Group>
              <InputGroup>
                <InputGroup.Text>Ask the Tarot</InputGroup.Text>
                <Form.Control
                  onChange={(e) => setQuestion(e.target.value)}
                  value={question}
                  as="textarea"
                  aria-label="With textarea"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Button type="submit" disabled={isGenerating || !question}>
                Get your spread
              </Button>
            </Form.Group>
          </Stack>
        </Form>

        <Stack direction="horizontal" gap={2}>
          <CardStack direction="horizontal" gap={3}>
            {cardThrow?.length &&
              cardThrow.map((card) => (
                <Card key={card.value}>
                  <Card.Img
                    variant="top"
                    src={`/marseille/${card.value}.jpg`}
                  />
                  <Card.Body>
                    <Card.Title>{card.label}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
          </CardStack>

          <TextContainer>
            {content ? (
              content
            ) : (
              <div className="mt-6 space-y-6">
                {isGenerating ? (
                  <>
                    <Spinner />
                    ...Reading your cards
                  </>
                ) : (
                  <span>...</span>
                )}
              </div>
            )}
          </TextContainer>
        </Stack>

        {/* <Button onClick={() => setDisplayForm(true)}>Buy More Credits</Button>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} /> */}
      </ContentStack>
    </ContainerStack>
  );
}
