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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

const PlayerActionModal = ({ onClose, isOpen, onSubmit, player, action }) => {
  const [value, setValue] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({ value, action, player });
    setValue(0);

    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {player?.name} - {action == "buyin" ? " 💵 Buyin" : "🏃‍♂️ Cashout"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="new-game" onSubmit={handleSubmit}>
              <FormControl mt={4} isRequired>
                <FormLabel>
                  {action == "buyin" ? "Buyin Stack" : "Cashout Chips"}
                </FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  placeholder="Value"
                  onChange={(e) => {
                    setValue(e);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" form="new-game">
              {action == "buyin" ? "Save Buyin" : "Save Cashout"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlayerActionModal;
