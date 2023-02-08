import { SimpleGrid } from "@chakra-ui/react";
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
      <SimpleGrid columns={2} spacing={10}>
        {clans.map((d) => (
          <ClanCard key={d.id} name={d.name} code={d.code} id={d.id} />
        ))}
      </SimpleGrid>
    </>
  );
}
