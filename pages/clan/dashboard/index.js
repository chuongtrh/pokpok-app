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
} from "@chakra-ui/react";

import ReactECharts from "echarts-for-react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import { getClan, getSummaryClan } from "@/shared/api";

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

  const option = useMemo(() => {
    const { members, games, game_players } = summary;

    const legend = members
      ?.map((member) => {
        return member.name;
      })
      .sort();
    console.log("🚀 ~ legend", legend);
    console.log("🚀 ~ games", games);

    const sortGames = games
      ? games?.sort((a, b) => {
          return a?.end_at.seconds - b?.end_at.seconds;
        })
      : [];

    console.log("🚀 ~ sortGames", sortGames);

    const xAxis = sortGames?.map((x) => {
      return x.name;
    });

    const profitMapping = {};
    if (members) {
      for (let m of members) {
        profitMapping[m.id] = Array(sortGames.length).fill(0);
      }
    }

    console.log("🚀 ~ profitMapping 1", profitMapping);

    sortGames.forEach((g, index) => {
      let players = game_players[g.id];
      players.forEach((player) => {
        if (profitMapping[player.id]) {
          if (index > 0) {
            profitMapping[player.id][index] =
              player.profit + profitMapping[player.id][index - 1];
          } else {
            profitMapping[player.id][index] = player.profit;
          }
        }
      });
    });

    console.log("🚀 ~ profitMapping", profitMapping);

    console.log("🚀 ~ xAxis", xAxis);

    console.log("🚀 ~ game_players", game_players);

    const series = members?.map((member) => {
      return {
        name: member.name,
        type: "line",
        data: profitMapping[member.id],
      };
    });

    console.log("🚀 ~ series", series);

    return {
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
          <Text>
            <b>Time series profit</b>
          </Text>
          <ReactECharts option={option} style={{ height: "500px" }} />
        </Box>
      </VStack>
    </Box>
  );
}
