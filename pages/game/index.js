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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { AddIcon, ChevronRightIcon, RepeatIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import {
  addPlayer,
  getMembers,
  getGame,
  getPlayers,
  gameAction,
  gameStart,
  gameEnd,
  getClan,
} from "@/shared/api";

import {
  DateFromSeconds,
  FormatDate,
  getBadgeStatusGame,
  formatMoney,
} from "@/shared/utils";
import { CSVLink, CSVDownload } from "react-csv";

import AddPlayerModal from "@/components/modals/add-player-modal";
import GameLogModal from "@/components/modals/game-log-modal";
import PlayerList from "@/components/player-list";
import PlayerActionModal from "@/components/modals/player-action-modal";

import { useUserStore } from "@/shared/user.store";

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
  const [clan, setClan] = useState({});
  const [game, setGame] = useState({});
  const [members, setMembers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [action, setAction] = useState("");
  const [playerAction, setPlayerAction] = useState({});
  const [nextGameStatus, setNextGameStatus] = useState("");

  const user = useUserStore((state) => state.user);

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
  async function fetchClan() {
    if (!clanId) return;
    const data = await getClan(clanId);
    setClan(data);
  }
  async function fetchMembers() {
    if (!gameId) return;
    const data = await getMembers(clanId);
    setMembers(data);
  }
  async function fetchPlayers() {
    if (!gameId) return;
    const data = await getPlayers(clanId, gameId);
    setPlayers(data.sort((a, b) => b.profit - a.profit));
  }

  async function fetchData() {
    fetchGame();
    fetchClan();
    fetchMembers();
    fetchPlayers();
  }
  useEffect(() => {
    const { game_id, clan_id } = router.query;
    setClanId(clan_id);
    setGameId(game_id);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [gameId]);

  useEffect(() => {
    setNextGameStatus(getNextGameStatus(game?.status));
  }, [game]);

  const csvData = useMemo(() => {
    return players?.map((p) => {
      return {
        name: p.name,
        stack: p.total_buyin / game?.stack,
        buyin: p.total_buyin,
        cashout: p.total_cashout,
        profit_chip: p.profit_chip,
        profit: p.profit,
      };
    });
  }, [players, game]);

  const onRefresh = async () => {
    fetchData();
  };
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
      <Box pl="10">
        <Breadcrumb
          spacing="8px"
          as="b"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">🏠 Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/clan/?clan_id=${clan.id}`}>
              Clan
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
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
                          <Button
                            colorScheme={"purple"}
                            isDisabled={!user?.is_admin}
                          >
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
                      isDisabled={game?.status != "start" || !user?.is_admin}
                    >
                      Add 🥷
                    </Button>

                    <Button
                      colorScheme="green"
                      variant="solid"
                      onClick={onOpenLogs}
                    >
                      Logs
                    </Button>
                    <Button
                      rightIcon={<RepeatIcon />}
                      colorScheme="gray"
                      variant="solid"
                      onClick={onRefresh}
                    ></Button>
                  </ButtonGroup>
                </Box>
              </Flex>
            </Box>
            <Box p="4">
              <Heading size="md">
                {game?.name} {getBadgeStatusGame(game?.status)}
              </Heading>
              <Text>🥞 Stack: {game?.stack}</Text>
              <Text>
                💵 Rate: {formatMoney(game?.rate, clan?.settings?.currency)}
              </Text>
              <Text>♥️ Type: {game?.type}</Text>
              <Text>
                ❇️ Create:{" "}
                {game?.created_at
                  ? FormatDate(
                      DateFromSeconds(game?.created_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                🏁 Start:{" "}
                {game?.start_at
                  ? FormatDate(
                      DateFromSeconds(game?.start_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                🔚 End:{" "}
                {game?.end_at
                  ? FormatDate(
                      DateFromSeconds(game?.end_at?.seconds),
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </Text>
              <Text>
                ⏰ Duration:{" "}
                {game?.status == "end"
                  ? `${Math.round(
                      Number(game?.end_at?.seconds - game?.start_at?.seconds) /
                        60
                    )} mins`
                  : "-"}
              </Text>
            </Box>
            {game?.status == "end" ? (
              <Box p="4">
                <Text>💵 Total Buyin: {game?.total_buyin_chip}</Text>
                <Text>🏃‍♂️ Total Cashout: {game?.total_cashout_chip}</Text>
                <Text>👀 Balance: {game?.balance_chip}</Text>
                <Text>
                  💸 MoneyIn:{" "}
                  {formatMoney(game?.total_money_in, clan?.settings?.currency)}
                </Text>
              </Box>
            ) : (
              <></>
            )}
          </VStack>
        </CardHeader>
        <CardBody>
          <Flex p="4">
            <Text as="b">Players in game:</Text>
            <Spacer />
            <CSVLink
              filename={`${game?.name}`}
              data={csvData}
              headers={[
                { label: "Name", key: "name" },
                { label: "Stack", key: "stack" },
                { label: "Buyin", key: "buyin" },
                { label: "Cashout", key: "cashout" },
                { label: "Profit chips", key: "profit_chip" },
                { label: "Profit", key: "profit" },
              ]}
            >
              ⬇️ Download CSV
            </CSVLink>
          </Flex>
          <PlayerList
            players={players}
            onAction={onActionPlayer}
            game={game}
            clan={clan}
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
