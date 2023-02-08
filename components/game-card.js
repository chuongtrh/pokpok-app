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

const GameCard = ({
  name,
  id,
  status,
  start_at,
  end_at,
  created_at,
  clan_id,
}) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Heading size="md">
            {name} {getBadgeStatusGame(status)}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>
            Created:{" "}
            {created_at
              ? FormatDate(
                  DateFromSeconds(created_at?.seconds),
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"}
          </Text>
          <Text>
            Started:{" "}
            {start_at
              ? FormatDate(
                  DateFromSeconds(start_at?.seconds),
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"}
          </Text>
          <Text>
            Ended:{" "}
            {end_at
              ? FormatDate(
                  DateFromSeconds(end_at?.seconds),
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"}
          </Text>
        </CardBody>
        <CardFooter>
          <Link color="teal.500" href={`/game/${id}?clan_id=${clan_id}`}>
            View now
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameCard;
