import {
  SimpleGrid,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

import ClanCard from "@/components/clan-card";
import { useEffect, useState } from "react";
import { getClans } from "@/shared/api";

export default function Home() {
  const [clans, setClans] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const datas = await getClans();
      setClans(datas);
    }
    fetchData();
  }, []);

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
        </Breadcrumb>
      </Box>
      <Box p="4">
        <SimpleGrid columns={2} spacing={10}>
          {clans?.map((clan) => (
            <ClanCard key={clan.id} clan={clan} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
