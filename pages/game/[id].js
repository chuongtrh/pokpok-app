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
  const { id: game_id, clan_id } = router.query;

  async function fetchGame() {
    if (!game_id) return;
    const data = await getGame(clan_id, game_id);
    setGame(data);
  }
  async function fetchMembers() {
    if (!game_id) return;
    const data = await getMembers(clan_id);
    setMembers(data);
  }
  async function fetchPlayers() {
    if (!game_id) return;
    const data = await getPlayers(clan_id, game_id);
    setPlayers(data);
  }

  useEffect(() => {
    fetchGame();
    fetchMembers();
    fetchPlayers();
  }, [game_id]);

  useEffect(() => {
    setNextGameStatus(getNextGameStatus(game?.status));
  }, [game]);

  const onAddPlayer = async (data) => {
    try {
      await addPlayer(clan_id, game_id, data);
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
    await gameAction(clan_id, game_id, {
      value,
      action,
      player_id: player?.id,
    });
    await fetchPlayers();
  };

  const onGameChangeStatus = async (nextStatus) => {
    if (nextStatus === "start") {
      await gameStart(clan_id, game_id);
    } else if (nextStatus === "end") {
      await gameEnd(clan_id, game_id);
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
                      disabled={game.status != "end"}
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
                {game.name} {getBadgeStatusGame(game.status)}
              </Heading>
              <Text>Stack: {game.stack}</Text>
              <Text>Rate: {game.rate}</Text>
              <Text>Type: {game.type}</Text>
              <Text>
                Created:{" "}
                {game.created_at
                  ? FormatDate(
                      DateFromSeconds(game.created_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                Started:{" "}
                {game.start_at
                  ? FormatDate(
                      DateFromSeconds(game.start_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                Ended:{" "}
                {game.end_at
                  ? FormatDate(
                      DateFromSeconds(game.end_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
            </Box>
          </VStack>
        </CardHeader>
        <CardBody>
          <PlayerList
            players={players}
            onAction={onActionPlayer}
            stack={game.stack}
          />
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
        clan_id={clan_id}
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
