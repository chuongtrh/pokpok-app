import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Box,
  Spacer,
  Button,
  useDisclosure,
  ButtonGroup,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  getClan,
  getMembers,
  getGames,
  createGame,
  addMember,
} from "@/shared/api";

import GameCard from "@/components/game-card";
import NewGameModal from "@/components/modals/new-game-modal";
import AddMemberModal from "@/components/modals/add-member-modal";

export default function Clan() {
  const [clan, setClan] = useState([]);
  const [games, setGames] = useState([]);
  const [members, setMembers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenNewMember,
    onOpen: onOpenNewMember,
    onClose: onCloseNewMember,
  } = useDisclosure();

  const router = useRouter();
  const { id } = router.query;

  async function fetchClan() {
    if (!id) return;
    const data = await getClan(id);
    setClan(data);
  }
  async function fetchMembers() {
    if (!id) return;
    const data = await getMembers(id);
    setMembers(data);
  }
  async function fetchGames() {
    if (!id) return;
    const data = await getGames(id);
    setGames(data);
  }

  useEffect(() => {
    fetchClan();
    fetchMembers();
    fetchGames();
  }, [id]);

  const onNewGame = async (data) => {
    try {
      const res = await createGame(id, data);
      await fetchGames();
    } catch (error) {
      console.error(error);
    }
  };
  const onAddNewMember = async (data) => {
    console.log("🚀 ~ data", data);
    try {
      const res = await addMember(id, data);
      await fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <VStack spacing={4} align="stretch">
            <Box p="4">
              <Flex>
                <Spacer />
                <Box>
                  <ButtonGroup gap="2">
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="teal"
                      variant="solid"
                      onClick={onOpen}
                    >
                      New game
                    </Button>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      variant="solid"
                      onClick={onOpenNewMember}
                    >
                      Add Member
                    </Button>
                  </ButtonGroup>
                </Box>
              </Flex>
            </Box>
            <Box p="4">
              <Heading size="md"> {clan.name}</Heading>
              <Text>{clan.description}</Text>
              <Text>Members:{members.length}</Text>
              <Text>Games:{games.length}</Text>
            </Box>
          </VStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={2} spacing={10}>
            {games.map((g) => (
              <GameCard
                key={g.id}
                id={g.id}
                name={g.name}
                status={g.status}
                start_at={g.start_at}
                created_at={g.created_at}
                end_at={g.end_at}
                clan_id={id}
              />
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
      <NewGameModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onNewGame}
        members={members}
      />
      <AddMemberModal
        isOpen={isOpenNewMember}
        onClose={onCloseNewMember}
        onSubmit={onAddNewMember}
        clan={clan}
      />
    </>
  );
}