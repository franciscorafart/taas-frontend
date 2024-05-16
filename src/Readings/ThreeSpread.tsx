import { useState, FormEvent, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import StripeModal from "StripeModal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Spinner } from "react-bootstrap";
import { TarotCard } from "shared/types";
import { TAROT_DECK } from "utils/constants";
import alert from "atoms/alert";
import { getThreeCardFreeReading, getThreeCardReading } from "requests/reading";
import account from "atoms/account";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import styled from "styled-components";
import useFreeCount from "utils/hooks/useFreeCount";
import accountInState from "atoms/account";
import freebies from "atoms/freebies";
import { getAuthUser, getFreeCount } from "requests/auth";

// const defaultCards =
//   process.env.NODE_ENV === "development"
//     ? [
//         {
//           value: "fool",
//           label: "The Fool",
//         },
//         {
//           value: "magician",
//           label: "The Magician",
//         },
//         {
//           value: "high_priestess",
//           label: "The High Priestess",
//         },
//       ]
//     : undefined;

const ContainerStack = styled.div`
  height: 100vh;
  padding: 80px 40px;
`;

const ContentStack = styled(Stack)`
  align-items: center;
`;

const ReadingStack = styled(Stack)`
  align-items: start;

  @media only screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 700px;
`;

const TextContainer = styled.div`
  border-radius: 20px;
  padding: 20px;
  max-width: 50%;

  @media only screen and (max-width: 992px) {
    max-width: 100%;
  }
`;

const CardImage = styled(Card.Img)`
  max-width: 400px;
`;
const CardStack = styled(Stack)`
  align-items: start;
  justify-content: center;
`;

export default function ReadingPage() {
  useFreeCount();
  const setUserAccount = useSetRecoilState(accountInState);
  const [cardThrow, setCardThrow] = useState<TarotCard[] | undefined>(
    undefined
  );
  const userAccount = useRecoilValue(account);
  const [freebs, setFreebies] = useRecoilState(freebies);
  const setAlert = useSetRecoilState(alert);

  const reloadUser = useCallback(async () => {
    const user = await getAuthUser();
    if (user) {
      setUserAccount({
        userId: user.id,
        email: user.email,
        role: user.role,
        credits: user.credits,
      });
    }
  }, [setUserAccount]);

  const findFreebies = useCallback(async () => {
    const res = await getFreeCount();
    setFreebies(Number(res?.count || 0));
  }, [setFreebies]);

  const [reading, setReading] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");

  const formatContent = (res: string) => {
    // Split the JSON string into individual sections
    const sections = res.split("\n\n");
    // Format the sections into HTML markup
    const formattedSections = sections.map((section, sIdx) => {
      const lines = section.split("\n");
      // const title = lines[0].replace(/\*\*|\*\*/g, ""); // Extracting the title without asterisks
      const content = lines.map((line, lIdx) => (
        <p key={`section-${sIdx}-line-${lIdx}`} className="text-sm">
          {line.replace(/^\*\s/, "")}
        </p>
      ));

      return (
        <div key={`section-${sIdx}-container`}>
          <>{content}</>
        </div>
      );
    });
    return formattedSections;
  };

  const handleThrow = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!userAccount.userId && freebs <= 0) {
        setAlert({
          display: true,
          variant: "warning",
          message:
            "You have no more free readings left. Sign up or log in to get more free readings.",
        });

        return;
      }

      if (userAccount.userId && userAccount.credits <= 0) {
        setAlert({
          display: true,
          variant: "warning",
          message: "You have no more readings left. Please buy more credits.",
        });

        return;
      }

      setIsGenerating(true);
      const cards = [];
      for (let i = 0; i < 3; i++) {
        cards.push(TAROT_DECK[Math.floor(Math.random() * 78)]);
      }

      const res = userAccount.userId
        ? await getThreeCardReading({ question, cards })
        : await getThreeCardFreeReading({ question, cards });

      if (!res || !res.success) {
        throw new Error("Failed to generate reading");
      }

      setReading(res.data);
      setCardThrow(cards);
      if (!userAccount.userId) {
        await findFreebies();
      } else {
        await reloadUser();
      }

      setIsGenerating(false);
    } catch (err: any) {
      setAlert({
        display: true,
        variant: "danger",
        message: "Failed to generate reading",
      });

      setIsGenerating(false);
      setReading(
        "Oops. An error occurred while generating the reading. Please try again later."
      );
    }
  };
  const content = reading && cardThrow?.length ? formatContent(reading) : null;

  return (
    <ContainerStack>
      <ContentStack gap={5}>
        <TopContainer>
          <Image
            roundedCircle
            src="/marseille/world.jpg"
            width={120}
            height={120}
          />
          <h2>
            <span>Tarot - Past, Present, Future</span> Reading
          </h2>
          {!userAccount.userId && (
            <span>Please log in to get your reading</span>
          )}
          <p>
            This is a three card spread that reflects the past, present, and
            possible future of your situation. Please write down your question
            and give some context on it to get the most informative reading.
          </p>
        </TopContainer>

        <Form onSubmit={handleThrow}>
          <ContentStack gap={3}>
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
          </ContentStack>
        </Form>

        <ReadingStack direction="horizontal" gap={2}>
          <CardStack direction="horizontal" gap={3}>
            {cardThrow?.length
              ? cardThrow.map((card) => (
                  <Card key={card.value}>
                    <CardImage
                      variant="top"
                      src={`/marseille/${card.value}.jpg`}
                    />
                    <Card.Body>
                      <Card.Text>{card.label}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              : null}
          </CardStack>

          {content ? (
            <TextContainer>{content}</TextContainer>
          ) : isGenerating ? (
            <>
              <Spinner />
              ...Reading your cards
            </>
          ) : (
            <TextContainer>...</TextContainer>
          )}
        </ReadingStack>

        {/* <Button onClick={() => setDisplayForm(true)}>Buy More Credits</Button>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} /> */}
      </ContentStack>
    </ContainerStack>
  );
}
