import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

const ClanCard = ({ clan }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Heading size="md"> {clan.name}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{clan.description}</Text>
        </CardBody>
        <CardFooter>
          <a href={`/clan/${clan.id}`}>➡️ Click</a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClanCard;
