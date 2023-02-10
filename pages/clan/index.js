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
  const { clan_id } = router.query;

  async function fetchClan() {
    if (!clan_id) return;
    const data = await getClan(clan_id);
    setClan(data);
  }
  async function fetchMembers() {
    if (!clan_id) return;
    const data = await getMembers(clan_id);
    setMembers(data);
  }
  async function fetchGames() {
    if (!clan_id) return;
    const data = await getGames(clan_id);
    setGames(data);
  }

  useEffect(() => {
    fetchClan();
    fetchMembers();
    fetchGames();
  }, [clan_id]);

  const onNewGame = async (data) => {
    try {
      const res = await createGame(clan_id, data);
      await fetchGames();
    } catch (error) {
      console.error(error);
    }
  };
  const onAddNewMember = async (data) => {
    try {
      const res = await addMember(clan_id, data);
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
              <Heading size="md"> {clan?.name}</Heading>
              <Text>{clan?.description}</Text>
              <Text>Members:{members?.length}</Text>
              <Text>Games:{games?.length}</Text>
            </Box>
          </VStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={2} spacing={10}>
            {games?.map((g) => (
              <GameCard key={g.id} game={g} clan_id={clan_id} />
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
