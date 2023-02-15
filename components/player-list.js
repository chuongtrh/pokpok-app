import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";

import { getBadgeStatusPlayer } from "@/shared/utils";

import { formatMoney } from "@/shared/utils";

const Player = ({ player, onAction, game, clan }) => {
  return (
    <>
      <Tr key={player.id}>
        <Td
          style={{
            position: "sticky",
            left: 0,
            backgroundColor: "white",
          }}
        >
          <Text as="b">{player.name} </Text>
          {getBadgeStatusPlayer(player?.status)}
        </Td>
        <Td isNumeric>{player.total_buyin / game?.stack}</Td>
        <Td isNumeric>{player.total_buyin}</Td>
        <Td isNumeric>{player.total_cashout}</Td>
        <Td isNumeric>{player.profit_chip ? player.profit_chip : 0}</Td>
        <Td isNumeric>
          {player.profit
            ? formatMoney(player.profit, clan?.settings?.currency)
            : 0}
        </Td>
        {game?.status == "start" ? (
          <Td>
            <ButtonGroup gap="2">
              <Button
                colorScheme="whatsapp"
                size="sm"
                onClick={() => {
                  onAction({ action: "buyin", player });
                }}
              >
                {" "}
                💵 Buyin
              </Button>
              <Button
                colorScheme="pink"
                size="sm"
                onClick={() => {
                  onAction({
                    action: "cashout",
                    player,
                  });
                }}
              >
                {" "}
                🏃‍♂️ Cashout
              </Button>
            </ButtonGroup>
          </Td>
        ) : (
          <></>
        )}
      </Tr>
    </>
  );
};
const PlayerList = ({ players, onAction, game, clan }) => {
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
                  // zIndex: 9999,
                  backgroundColor: "white",
                }}
              >
                Name
              </Th>
              <Th isNumeric>Buyin</Th>
              <Th isNumeric>Chips</Th>
              <Th isNumeric>Cashout</Th>
              <Th isNumeric>Profit Chips</Th>
              <Th isNumeric>Profit</Th>
              {game?.status == "start" ? (
                <Th
                  style={
                    {
                      // position: "sticky",
                      // right: 0,
                      // zIndex: 9999,
                      // backgroundColor: "white",
                    }
                  }
                >
                  Action
                </Th>
              ) : (
                <></>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {players?.map((p) => {
              return (
                <Player
                  key={p.id}
                  player={p}
                  onAction={onAction}
                  game={game}
                  clan={clan}
                />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PlayerList;
