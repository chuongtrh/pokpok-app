import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
} from "@chakra-ui/react";

const ClanCard = ({ clan }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Heading size="md"> {clan?.name}</Heading>
          <Text size="md"> {clan?.is_private ? "🔒" : ""}</Text>
        </CardHeader>
        <CardBody>
          <Text>{clan?.description}</Text>
        </CardBody>
        <CardFooter>
          <a href={`/clan/?clan_id=${clan?.id}`}>➡️ Click</a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClanCard;
