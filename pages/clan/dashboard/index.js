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
} from "@chakra-ui/react";

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
    console.log("🚀 ~ data", data);
    setSummary(data);
  }

  useEffect(() => {
    fetchClan();
    fetchSummaryClan();
  }, [clan_id]);

  const { option, game_names, member_profit } = useMemo(() => {
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

    sortGames.forEach((g, index) => {
      let players = game_players[g.id];
      players.forEach((player) => {
        if (profitMapping[player.id]) {
          profitTotalMapping[player.id][index] = player.profit;

          if (index > 0) {
            profitMapping[player.id][index] =
              player.profit + profitMapping[player.id][index - 1];
          } else {
            profitMapping[player.id][index] = player.profit;
          }
        }
      });
    });

    const series = members?.map((member) => {
      return {
        name: member.name,
        type: "line",
        data: profitMapping[member.id],
        total: profitTotalMapping[member.id].reduce((a, b) => a + b, 0),
        data_total: profitTotalMapping[member.id],
      };
    });

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
        series,
      },
      game_names: xAxis,
      member_profit: series,
    };
  }, [summary]);

  return (
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
                  <Th>Name</Th>
                  {game_names?.map((n, index) => {
                    return <Th key={index}>{n}</Th>;
                  })}
                  <Th style={{ backgroundColor: "gray" }}>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {member_profit?.map((m, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        <Text as="b">{m.name}</Text>
                      </Td>
                      {m.data_total?.map((v, index) => {
                        return (
                          <Th key={index}>
                            {formatMoney(v, clan?.settings?.currency)}
                          </Th>
                        );
                      })}
                      <Td style={{ backgroundColor: "gray" }}>
                        {formatMoney(m.total, clan?.settings?.currency)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  );
}
