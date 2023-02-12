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

import { ChevronDownIcon } from "@chakra-ui/icons";
import { getBadgeStatusPlayer } from "@/shared/utils";

const Player = ({ player, onAction, game }) => {
  return (
    <>
      <Tr key={player.id}>
        <Td
          style={{
            position: "sticky",
            left: 0,
            zIndex: 9999,
            backgroundColor: "white",
          }}
        >
          <Text as="b">{player.name} </Text>
          {getBadgeStatusPlayer(player?.status)}
        </Td>
        <Td isNumeric>{player.total_buyin / game?.stack}</Td>
        <Td isNumeric>{player.total_buyin}</Td>
        <Td isNumeric>{player.total_cashout}</Td>
        <Td isNumeric>{player.profit_chip}</Td>
        <Td
          style={{
            position: "sticky",
            right: 0,
            zIndex: 9999,
            backgroundColor: "white",
            visibility: game?.status != "start" ? "hidden" : "visible",
          }}
        >
          <Menu>
            <MenuButton
              isDisabled={game?.status != "start"}
              size="small"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  onAction({ action: "buyin", player });
                }}
              >
                Buyin
              </MenuItem>
              <MenuItem
                onClick={() => {
                  console.log("Cashout");
                  onAction({
                    action: "cashout",
                    player,
                  });
                }}
              >
                Cashout
              </MenuItem>
            </MenuList>
          </Menu>
        </Td>
      </Tr>
    </>
  );
};
const PlayerList = ({ players, onAction, game }) => {
  return (
    <>
      <TableContainer overflowX="scroll" overflowY="unset">
        <Table colorScheme="teal" size="md">
          <TableCaption>Players in game</TableCaption>
          <Thead>
            <Tr>
              <Th
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 9999,
                  backgroundColor: "white",
                }}
              >
                Name
              </Th>
              <Th isNumeric>Buyin</Th>
              <Th isNumeric>Chips</Th>
              <Th isNumeric>Cashout</Th>
              <Th isNumeric>Profit</Th>
              <Th
                style={{
                  position: "sticky",
                  right: 0,
                  zIndex: 9999,
                  backgroundColor: "white",
                  visibility: game?.status != "start" ? "hidden" : "visible",
                }}
              >
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {players?.map((p) => {
              return (
                <Player key={p.id} player={p} onAction={onAction} game={game} />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PlayerList;
