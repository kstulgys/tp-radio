import React from "react";
import { SiTrustpilot } from "react-icons/si";
import { Stack, Box, Icon, Link } from "@chakra-ui/react";

export function TrustPilotMenuLink() {
  return (
    <Link rounded="full" position="fixed" top={[4, 10]} left={[4, 10]} isExternal href="https://www.trustpilot.com/">
      <Stack
        bg="rgba(0, 0, 0, 0.5)"
        sx={{ backdropFilter: "blur(20px)" }}
        // bg="rgba(255, 255, 255, 0.5)"
        color="gray.100"
        rounded="full"
        _hover={{}}
        _active={{
          bg: "rgba(0, 0, 0, 0.4)",
        }}
        isInline
        alignItems="center"
        spacing={4}
        height={14}
        px={5}
      >
        <Box>
          <Icon color="green.500" as={SiTrustpilot} fontSize="xl" mb={1} />
        </Box>
        <Box>
          <Icon color="green.500" as={SiTrustpilot} fontSize="xl" mb={1} />
        </Box>
        <Box>
          <Icon color="green.500" as={SiTrustpilot} fontSize="xl" mb={1} />
        </Box>
        <Box>
          <Icon color="green.500" as={SiTrustpilot} fontSize="xl" mb={1} />
        </Box>
        <Box>
          <Icon color="gray.100" as={SiTrustpilot} fontSize="xl" mb={1} />
        </Box>
      </Stack>
    </Link>
  );
}
