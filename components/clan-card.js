import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

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
          <Link href={`/clan/${clan.id}`}>➡️ Click</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClanCard;
