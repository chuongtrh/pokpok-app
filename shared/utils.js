import moment from "moment";
import { Badge } from "@chakra-ui/react";
import { number } from "prop-types";
export const DateFromSeconds = (secs) => {
  return new Date(secs * 1000);
};

export const FormatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).format(format);
};

export const getBadgeStatusGame = (status) => {
  switch (status) {
    case "start":
      return <Badge colorScheme="green">Start</Badge>;
    case "new":
      return <Badge colorScheme="blue">New</Badge>;
    case "end":
      return <Badge colorScheme="red">End</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const getBadgeStatusPlayer = (status) => {
  switch (status) {
    case "in":
      return (
        <Badge colorScheme="green" fontSize="0.4em">
          IN
        </Badge>
      );
    case "out":
      return (
        <Badge colorScheme="red" fontSize="0.4em">
          OUT
        </Badge>
      );
    default:
      return <></>;
  }
};

export const formatMoney = (amount, currency = "USD") => {
  return amount?.toLocaleString("en-US", { style: "currency", currency });
};
