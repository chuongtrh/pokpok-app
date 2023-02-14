import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";

import {
  DateFromSeconds,
  FormatDate,
  getBadgeStatusGame,
} from "@/shared/utils";

const Game = ({ game, clan_id }) => {
  return (
    <>
      <Tr>
        <Td>
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
const GameList = ({ games, clan_id }) => {
  return (
    <>
      <TableContainer overflowX="scroll" overflowY="unset">
        <Table colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Type</Th>
              <Th>Created at</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {games?.map((g) => {
              return <Game key={g.id} game={g} clan_id={clan_id} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GameList;
