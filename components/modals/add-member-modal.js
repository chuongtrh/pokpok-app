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

import { useEffect, useState } from "react";

const AddMemberModal = ({ onClose, isOpen, onSubmit, clan }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ name, code });
    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Member to clan: {clan?.name}</ModalHeader>
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

              <FormControl isRequired>
                <FormLabel>Code</FormLabel>
                <Input
                  placeholder="Code"
                  onChange={(e) => setCode(e.currentTarget.value)}
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

export default AddMemberModal;
