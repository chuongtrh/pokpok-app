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

const AddPlayerModal = ({ onClose, isOpen, onSubmit, members, game }) => {
  const [players, setPlayers] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ players });
    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Player to game: {game.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="new-game" onSubmit={handleSubmit}>
              <FormControl mt={4} isRequired>
                <FormLabel>Players:</FormLabel>
                <Select
                  isMulti
                  name="players"
                  options={members.map((m) => {
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

export default AddPlayerModal;
