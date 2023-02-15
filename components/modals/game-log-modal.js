import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  ListItem,
  UnorderedList,
  Text,
  Highlight,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getLogs } from "@/shared/api";

import { DateFromSeconds, FormatDate } from "@/shared/utils";

const buildTextFromLog = (log) => {
  const { name, action, created_at, value } = log;
  return (
    <>
      <Text as="b">{name}</Text>
      <Highlight
        query={["buyin", "cashout"]}
        styles={{
          rounded: "full",
          px: "2",
          py: "1",
          bg: action == "buyin" ? "teal.100" : "red.100",
        }}
      >
        {` ${action} ${value} at ${FormatDate(
          DateFromSeconds(created_at?.seconds)
        )}`}
      </Highlight>
    </>
  );
};

const GameLogModal = ({ onClose, isOpen, game, clan_id }) => {
  const [logs, setLogs] = useState([]);

  async function fetchLogs() {
    if (!game?.id) return;
    const data = await getLogs(clan_id, game?.id);
    setLogs(data);
  }

  useEffect(() => {
    if (!isOpen) return;
    fetchLogs();
  }, [game, clan_id, isOpen]);

  return (
    <>
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader borderBottomWidth="1px">
            Log game: {game?.name}
          </DrawerHeader>
          <DrawerBody>
            <UnorderedList>
              {logs.map((log) => {
                return (
                  <ListItem key={log.id} pb={"2"}>
                    {buildTextFromLog(log)}
                  </ListItem>
                );
              })}
            </UnorderedList>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GameLogModal;
