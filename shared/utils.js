import moment from "moment";
import { Badge } from "@chakra-ui/react";
export const DateFromSeconds = (secs) => {
  return new Date(secs * 1000);
};

export const FormatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).format(format);
};

export const getBadgeStatusGame = (status) => {
  switch (status) {
    case "start":
      return <Badge colorScheme="purple">Start</Badge>;
    case "new":
      return <Badge colorScheme="green">New</Badge>;
    default:
      return <Badge>Default</Badge>;
  }
};
