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
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

import ReactECharts from "echarts-for-react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import { getClan, getSummaryClan } from "@/shared/api";
import { formatMoney } from "@/shared/utils";

export default function Dashboard() {
  const router = useRouter();
  const { clan_id } = router.query;
  const [clan, setClan] = useState([]);
  const [summary, setSummary] = useState({});

  async function fetchClan() {
    if (!clan_id) return;
    const data = await getClan(clan_id);
    setClan(data);
  }

  async function fetchSummaryClan() {
    if (!clan_id) return;
    const data = await getSummaryClan(clan_id);
    setSummary(data);
  }

  useEffect(() => {
    fetchClan();
    fetchSummaryClan();
  }, [clan_id]);

  const { option, game_names, member_profits, games, grand_total_profit } =
    useMemo(() => {
      const { members, games, game_players } = summary;

      const legend = members
        ?.map((member) => {
          return member.name;
        })
        .sort();
      const sortGames = games
        ? games?.sort((a, b) => {
            return a?.end_at.seconds - b?.end_at.seconds;
          })
        : [];

      const xAxis = sortGames?.map((x) => {
        return x.name;
      });

      const profitTotalMapping = {};
      const profitMapping = {};
      if (members) {
        for (let m of members) {
          profitMapping[m.id] = Array(sortGames.length).fill(0);
          profitTotalMapping[m.id] = Array(sortGames.length).fill(0);
        }
      }

      sortGames?.forEach((g, index) => {
        let gPlayers = game_players[g.id];
        members.forEach((m) => {
          let player = gPlayers.find((p) => p.id === m.id);
          if (player && player.id) {
            profitTotalMapping[player.id][index] = player.profit;
            if (index > 0) {
              profitMapping[player.id][index] =
                player.profit + profitMapping[player.id][index - 1];
            } else {
              profitMapping[player.id][index] = player.profit;
            }
          } else {
            profitTotalMapping[m.id][index] = 0;

            if (index > 0) {
              profitMapping[m.id][index] = profitMapping[m.id][index - 1];
            } else {
              profitMapping[m.id][index] = 0;
            }
          }
        });
      });

      let grand_total_profit = 0;
      let member_profits = members?.map((member) => {
        const profit = profitTotalMapping[member.id].reduce((a, b) => a + b, 0);
        grand_total_profit += profit;
        return {
          name: member.name,
          type: "line",
          data: profitMapping[member.id],
          total_profit: profit,
          data_total: profitTotalMapping[member.id],
        };
      });

      member_profits = member_profits?.sort(
        (a, b) => b?.total_profit - a?.total_profit
      );

      return {
        option: {
          responsive: true,
          maintainAspectRatio: false,

          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: legend,
          },
          grid: {
            left: "0%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xAxis,
          },
          yAxis: {
            type: "value",
          },
          series: member_profits,
        },
        game_names: xAxis,
        member_profits,
        games: sortGames,
        grand_total_profit,
      };
    }, [summary]);

  return (
    <>
      <Box p="4">
        <Breadcrumb
          spacing="8px"
          as="b"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/clan/?clan_id=${clan.id}`}>
              Clan
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box p="4">
        <VStack spacing={4} align="stretch">
          <Box>
            <Heading size="md"> {clan?.name}</Heading>
            <Text>{clan?.description}</Text>
          </Box>
          <Box>
            <Text as="b">Time series profit</Text>
            <ReactECharts option={option} style={{ height: "500px" }} />
          </Box>
          <Box>
            <Text as="b">Summary</Text>
            <TableContainer>
              <Table variant="simple">
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
                    {game_names?.map((n, index) => {
                      return <Th key={index}>{n}</Th>;
                    })}
                    <Th style={{ backgroundColor: "gray" }}>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {member_profits?.map((m, index) => {
                    return (
                      <Tr key={index}>
                        <Td
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 9999,
                            backgroundColor: "white",
                          }}
                        >
                          <Text as="b">
                            {m.name}
                            {index == 0 ? (
                              <b>🥇</b>
                            ) : index == 1 ? (
                              <b>🥈</b>
                            ) : index == 2 ? (
                              <b>🥉</b>
                            ) : (
                              <></>
                            )}
                          </Text>
                        </Td>
                        {m.data_total?.map((v, index) => {
                          return (
                            <Th key={index}>
                              {formatMoney(v, clan?.settings?.currency)}
                            </Th>
                          );
                        })}
                        <Td style={{ backgroundColor: "gray" }}>
                          <Text as="b">
                            {formatMoney(
                              m.total_profit,
                              clan?.settings?.currency
                            )}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })}
                  <Tr>
                    <Td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 9999,
                        backgroundColor: "gray",
                      }}
                    >
                      <Text as="b">Total</Text>
                    </Td>
                    {games.map((g) => {
                      return (
                        <Td key={g.id} style={{ backgroundColor: "gray" }}>
                          <Text as="b">
                            {formatMoney(
                              (g.balance_chip / g.stack) * g.rate,
                              clan?.settings?.currency
                            )}
                          </Text>
                        </Td>
                      );
                    })}
                    <Td style={{ backgroundColor: "gray" }}>
                      <Text as="b">
                        {formatMoney(
                          grand_total_profit,
                          clan?.settings?.currency
                        )}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </Box>
    </>
  );
}
