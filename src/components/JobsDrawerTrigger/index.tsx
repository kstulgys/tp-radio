import React from "react";
import { Button } from "@components";
import { FiVolume, FiPlay, FiPause, FiVolumeX, FiUsers, FiVolume2 } from "react-icons/fi";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Box,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

export function JobsDrawerTrigger() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setstate] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen || state.length > 0) return;
    async function fetchJobs() {
      setLoading(true);
      const { data } = await axios("https://6096766e116f3f00174b323e.mockapi.io/api/v1/jobs");
      setstate(data);
      setLoading(false);
    }
    fetchJobs();
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={onOpen}
        bg="rgba(0, 0, 0, 0.5)"
        sx={{ backdropFilter: "blur(20px)" }}
        // backgroundColor="rgba(255, 255, 255, 0.5)"
        position="fixed"
        top={[4, 10]}
        right={[4, 10]}
        width={14}
        height={14}
        color="gray.100"
        rounded="full"
        _hover={{}}
        _active={{
          bg: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <Icon as={FiUsers} fontSize="xl" />
      </Button>
      <Drawer
        size="md"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        //   finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader fontSize="2xl">Open positions</DrawerHeader>

            <DrawerBody>
              {!isLoading &&
                state.map(({ id, title }) => (
                  <Box key={id}>
                    <Text>{title}</Text>
                  </Box>
                ))}
            </DrawerBody>

            {/* <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">Save</Button>
              </DrawerFooter> */}
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
