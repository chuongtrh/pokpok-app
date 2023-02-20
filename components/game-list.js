import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";

import {
  DateFromSeconds,
  FormatDate,
  getBadgeStatusGame,
  formatMoney,
} from "@/shared/utils";

const Game = ({ game, clan_id, clan }) => {
  return (
    <>
      <Tr>
        <Td
          style={{
            position: "sticky",
            left: 0,
            backgroundColor: "white",
          }}
        >
          <Text as="b">
            <a
              color="teal.500"
              href={`/game/?clan_id=${clan_id}&game_id=${game?.id}`}
            >
              {game?.name}
            </a>
          </Text>
        </Td>
        <Td>{getBadgeStatusGame(game?.status)}</Td>
        <Td>{game?.type}</Td>
        <Td>
          {formatMoney(game.total_money_in || 0, clan?.settings?.currency)}
        </Td>
        <Td>
          {game?.created_at
            ? FormatDate(
                DateFromSeconds(game?.created_at?.seconds),
                "YYYY-MM-DD HH:mm:ss"
              )
            : "-"}
        </Td>
        <Td>
          <a
            color="teal.500"
            href={`/game/?clan_id=${clan_id}&game_id=${game?.id}`}
          >
            ➡️ View
          </a>
        </Td>
      </Tr>
    </>
  );
};
const GameList = ({ games, clan_id, clan }) => {
  return (
    <>
      <TableContainer overflowX="scroll" overflowY="unset">
        <Table colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th
                style={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "white",
                }}
              >
                Name
              </Th>
              <Th>Status</Th>
              <Th>Type</Th>
              <Th>Money-In</Th>
              <Th>Created at</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {games?.map((g) => {
              return <Game key={g.id} game={g} clan_id={clan_id} clan={clan} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GameList;
