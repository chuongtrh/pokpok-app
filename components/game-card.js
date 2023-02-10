import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
} from "@chakra-ui/react";
import { getBadgeStatusGame } from "@/shared/utils";

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
          <a
            color="teal.500"
            href={`/game/?clan_id=${clan_id}&game_id=${game?.id}`}
          >
            ➡️ View
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameCard;
