import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  DateFromSeconds,
  FormatDate,
  getBadgeStatusGame,
} from "@/shared/utils";

const GameCard = ({ game, clan_id }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Heading size="md">
            {game?.name} {getBadgeStatusGame(game?.status)}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>Stack: {game?.stack}</Text>
          <Text>Rate: {game?.rate}</Text>
          <Text>Type: {game?.type}</Text>
        </CardBody>
        <CardFooter>
          <Link color="teal.500" href={`/game/${game?.id}?clan_id=${clan_id}`}>
            ➡️ View
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameCard;
