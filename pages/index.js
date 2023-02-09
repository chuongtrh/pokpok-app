import { SimpleGrid } from "@chakra-ui/react";
import ClanCard from "@/components/clan-card";
import { useEffect, useState } from "react";
import { getClans } from "@/shared/api";
import { useEffectOnce } from "react-use";

export default function Home() {
  const [clans, setClans] = useState([]);

  useEffectOnce(() => {
    async function fetchData() {
      const datas = await getClans();
      setClans(datas);
    }
    fetchData();
  });

  return (
    <>
      <SimpleGrid columns={2} spacing={10}>
        {clans?.map((clan) => (
          <ClanCard key={clan.id} clan={clan} />
        ))}
      </SimpleGrid>
    </>
  );
}
