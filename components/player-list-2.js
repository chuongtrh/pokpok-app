/* eslint-disable react/jsx-key */
import {
  ChakraProvider,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import React from "react";
import { useTable, useSortBy } from "react-table";

import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

function CustomTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => {
            return (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    userSelect="none"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <Flex alignItems="center">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDownIcon ml={1} w={4} h={4} />
                        ) : (
                          <ChevronUpIcon ml={1} w={4} h={4} />
                        )
                      ) : (
                        ""
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            );
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}

const PlayerList2 = ({ players, onAction, game }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Player in game",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            sticky: "left",
          },
          {
            Header: "Buyin",
            accessor: "buyin",
          },
          {
            Header: "Chips",
            accessor: "total_buyin",
          },
          {
            Header: "Cashout",
            accessor: "total_cashout",
          },
          {
            Header: "Action",
            accessor: "action",
            Cell: ({ data, row: { index } }) => {
              return (
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
                        onAction({ action: "buyin", player: data[index] });
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
              );
            },
          },
        ],
      },
    ],
    [players, game]
  );

  return (
    <CustomTable
      columns={columns}
      data={players?.map((p) => {
        return {
          ...p,
          buyin: p.total_buyin / game?.stack,
        };
      })}
    />
  );
};

export default PlayerList2;
