import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";

import { DateFromSeconds, FormatDate } from "@/shared/utils";

const Member = ({ member }) => {
  return (
    <>
      <Tr>
        <Td>
          <Text as="b">{member?.name}</Text>
        </Td>
        <Td>{member?.code}</Td>
        <Td>
          {member?.joined_at
            ? FormatDate(
                DateFromSeconds(member?.joined_at?.seconds),
                "YYYY-MM-DD HH:mm:ss"
              )
            : "-"}
        </Td>
      </Tr>
    </>
  );
};

const ViewMemberModal = ({ onClose, isOpen, clan, members }) => {
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Members of clan: {clan?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer overflowX="scroll" overflowY="unset">
              <Table colorScheme="teal" size="md">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Code</Th>
                    <Th>Joined at</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {members?.map((m) => {
                    return <Member key={m.id} member={m} />;
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewMemberModal;
