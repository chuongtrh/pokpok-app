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
} from "@chakra-ui/react";

import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Player = ({ player, onAction }) => {
  return (
    <>
      <Tr>
        <Td position={"sticky"}>
          <b>{player.name}</b>
        </Td>
        <Td isNumeric>{player.total_buyin}</Td>
        <Td isNumeric>{player.total_cashout}</Td>
        <Td isNumeric>{player.profit}</Td>
        <Td>
          <Menu>
            <MenuButton
              size="small"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  console.log("Buyin");
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
const PlayerList = ({ players, onAction }) => {
  return (
    <>
      <TableContainer>
        <Table colorScheme="teal" size="md">
          <TableCaption>Players in game</TableCaption>
          <Thead>
            <Tr>
              <Th position={"sticky"}>Name</Th>
              <Th isNumeric>Buyin</Th>
              <Th isNumeric>Cashout</Th>
              <Th isNumeric>Profit</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {players.map((p) => {
              return <Player key={p.id} player={p} onAction={onAction} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PlayerList;
