import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Box,
  Spacer,
  Button,
  useDisclosure,
  ButtonGroup,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addPlayer,
  getMembers,
  getGame,
  getPlayers,
  gameAction,
  gameStart,
  gameEnd,
} from "@/shared/api";

import {
  DateFromSeconds,
  FormatDate,
  getBadgeStatusGame,
} from "@/shared/utils";

import AddPlayerModal from "@/components/modals/add-player-modal";
import GameLogModal from "@/components/modals/game-log-modal";
import PlayerList from "@/components/player-list";
import PlayerList2 from "@/components/player-list-2";
import PlayerActionModal from "@/components/modals/player-action-modal";

const getNextGameStatus = (status) => {
  const mapping = {
    new: "start",
    start: "end",
    end: "",
  };
  return mapping[status];
};

export default function Game() {
  const [gameId, setGameId] = useState("");
  const [clanId, setClanId] = useState("");
  const [game, setGame] = useState([]);
  const [members, setMembers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [action, setAction] = useState("");
  const [playerAction, setPlayerAction] = useState({});
  const [nextGameStatus, setNextGameStatus] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenLogs,
    onOpen: onOpenLogs,
    onClose: onCloseLogs,
  } = useDisclosure();

  const {
    isOpen: isOpenAction,
    onOpen: onOpenAction,
    onClose: onCloseAction,
  } = useDisclosure();

  const {
    isOpen: isOpenGameAction,
    onOpen: onOpenGameAction,
    onClose: onCloseGameAction,
  } = useDisclosure();

  const router = useRouter();

  async function fetchGame() {
    if (!gameId) return;
    const data = await getGame(clanId, gameId);
    setGame(data);
  }
  async function fetchMembers() {
    if (!gameId) return;
    const data = await getMembers(clanId);
    setMembers(data);
  }
  async function fetchPlayers() {
    if (!gameId) return;
    const data = await getPlayers(clanId, gameId);
    setPlayers(data);
  }

  useEffect(() => {
    const { id, clan_id } = router.query;
    setGameId(id);
    setClanId(clan_id);
  }, [router]);

  useEffect(() => {
    fetchGame();
    fetchMembers();
    fetchPlayers();
  }, [gameId]);

  useEffect(() => {
    setNextGameStatus(getNextGameStatus(game?.status));
  }, [game]);

  const onAddPlayer = async (data) => {
    try {
      await addPlayer(clanId, gameId, data);
      await fetchPlayers();
    } catch (error) {
      console.error(error);
    }
  };

  const onActionPlayer = async (data) => {
    const { action, player } = data;
    setAction(action);
    setPlayerAction(player);
    onOpenAction();
  };

  const onSubmitPlayerAction = async (data) => {
    const { value, action, player } = data;
    await gameAction(clanId, gameId, {
      value,
      action,
      player_id: player?.id,
    });
    await fetchPlayers();
  };

  const onGameChangeStatus = async (nextStatus) => {
    if (nextStatus === "start") {
      await gameStart(clanId, gameId);
    } else if (nextStatus === "end") {
      await gameEnd(clanId, gameId);
    }
    fetchGame();
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
                    {nextGameStatus ? (
                      <Popover
                        isOpen={isOpenGameAction}
                        onOpen={onOpenGameAction}
                        onClose={onCloseGameAction}
                      >
                        <PopoverTrigger>
                          <Button colorScheme={"purple"}>
                            {nextGameStatus?.toUpperCase()}
                          </Button>
                        </PopoverTrigger>
                        <Portal>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader>Confirmation!</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                              <PopoverBody>
                                Are you sure you want to <b>{nextGameStatus}</b>{" "}
                                game?
                              </PopoverBody>
                            </PopoverBody>
                            <PopoverFooter>
                              <Button
                                colorScheme="blue"
                                onClick={() => {
                                  onGameChangeStatus(nextGameStatus);
                                  onCloseGameAction();
                                }}
                              >
                                Ok
                              </Button>
                            </PopoverFooter>
                          </PopoverContent>
                        </Portal>
                      </Popover>
                    ) : (
                      <></>
                    )}

                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      variant="solid"
                      onClick={onOpen}
                      disabled={game?.status != "end"}
                    >
                      Add players
                    </Button>
                    <Button
                      colorScheme="green"
                      variant="solid"
                      onClick={onOpenLogs}
                    >
                      Logs
                    </Button>
                  </ButtonGroup>
                </Box>
              </Flex>
            </Box>
            <Box p="4">
              <Heading size="md">
                {game?.name} {getBadgeStatusGame(game?.status)}
              </Heading>
              <Text>Stack: {game?.stack}</Text>
              <Text>Rate: {game?.rate}</Text>
              <Text>Type: {game?.type}</Text>
              <Text>
                Create:{" "}
                {game?.created_at
                  ? FormatDate(
                      DateFromSeconds(game?.created_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                Start:{" "}
                {game?.start_at
                  ? FormatDate(
                      DateFromSeconds(game?.start_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                End:{" "}
                {game?.end_at
                  ? FormatDate(
                      DateFromSeconds(game?.end_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                Duration:{" "}
                {game?.status == "end"
                  ? `${Math.round(
                      Number(game?.end_at?.seconds - game?.start_at?.seconds) /
                        60
                    )} min`
                  : "-"}
              </Text>
            </Box>
          </VStack>
        </CardHeader>
        <CardBody>
          <PlayerList players={players} onAction={onActionPlayer} game={game} />
        </CardBody>
      </Card>
      <AddPlayerModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onAddPlayer}
        members={members}
        game={game}
      />
      <GameLogModal
        onClose={onCloseLogs}
        isOpen={isOpenLogs}
        game={game}
        clan_id={clanId}
      />
      <PlayerActionModal
        onClose={onCloseAction}
        isOpen={isOpenAction}
        player={playerAction}
        action={action}
        onSubmit={onSubmitPlayerAction}
      />
    </>
  );
}
