import {
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { Select } from "chakra-react-select";

import { useEffect, useState } from "react";

const NewGameModal = ({ onClose, isOpen, onSubmit, members }) => {
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState("");
  const [stack, setStack] = useState(0);
  const [rate, setRate] = useState(0);
  const [players, setPlayers] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ name, type: gameType, stack, rate, players });

    setName("");
    setGameType("");
    setStack(0);
    setRate(0);
    setPlayers([]);

    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new game</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="new-game" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Game type:</FormLabel>
                <Select
                  name="game_type"
                  options={[
                    { label: "Texas Holdem 6 Plus", value: "six_plus" },
                    { label: "Texas Holdem Classic", value: "texas_holdem" },
                  ]}
                  placeholder="Select type..."
                  closeMenuOnSelect={true}
                  size="sm"
                  onChange={(e) => setGameType(e?.value)}
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Stack:</FormLabel>
                <Select
                  name="stack"
                  options={[
                    { label: "500", value: 500 },
                    { label: "1.000", value: 1000 },
                    { label: "2.000", value: 2000 },
                  ]}
                  placeholder="Select stack..."
                  closeMenuOnSelect={true}
                  size="sm"
                  onChange={(e) => setStack(e?.value)}
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Rate:</FormLabel>
                <Select
                  name="rate"
                  options={[
                    { label: "50k", value: 50000 },
                    { label: "100k", value: 1000000 },
                    { label: "200k", value: 2000000 },
                  ]}
                  placeholder="Select rate..."
                  closeMenuOnSelect={true}
                  size="sm"
                  onChange={(e) => setRate(e?.value)}
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Players:</FormLabel>
                <Select
                  isMulti
                  name="players"
                  options={members?.map((m) => {
                    return {
                      label: m.name,
                      value: m.id,
                    };
                  })}
                  placeholder="Select players..."
                  closeMenuOnSelect={false}
                  size="sm"
                  onChange={(e) => {
                    setPlayers(
                      e.map((x) => {
                        return { id: x.value, name: x.label };
                      })
                    );
                  }}
                />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" form="new-game">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewGameModal;
