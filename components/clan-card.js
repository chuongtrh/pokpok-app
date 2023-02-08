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

const ClanCard = ({ name, id, code }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Heading size="md"> {name}</Heading>
        </CardHeader>
        <CardBody>
          <Text>View a summary of all your customers over the last month.</Text>
        </CardBody>
        <CardFooter>
          <Link href={`/clan/${id}`}>Click</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClanCard;
