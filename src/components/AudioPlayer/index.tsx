import React from "react";
import { FiVolume, FiPlay, FiPause, FiVolumeX, FiUsers, FiVolume2 } from "react-icons/fi";
import { Button, Stack, Text, Image, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Icon } from "@chakra-ui/react";
import { useAudio } from "src/hooks";

export function AudioPlayer({ songState }) {
  return (
    <Stack
      spacing={[0, 0, 5]}
      isInline
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      bottom={0}
      p={4}
      px={[4, 4, 10]}
      width="full"
      bg="rgba(0, 0, 0, 0.5)"
      sx={{ backdropFilter: "blur(20px)" }}
    >
      <Stack display={["none", "none", "flex"]} flex={1} isInline alignItems="center" spacing={5}>
        <Box height="full" width="16">
          <Image rounded="md" height="full" width="16" objectFit="cover" src={songState?.now_playing?.song.art} />
        </Box>
        <Stack color="gray.100">
          <Box>
            <Text mb={0} fontSize="lg" fontWeight="bold">
              {songState?.now_playing?.song?.artist}
            </Text>
          </Box>
          <Box>
            <Text mb={0} fontSize="sm">
              {songState?.now_playing?.song?.title}
            </Text>
          </Box>
        </Stack>
      </Stack>
      <Stack spacing={0} display={["none", "none", "flex"]} flex={1} isInline justifyContent="center">
        <Box>
          <Text m={0} color="gray.100">
            Welcome to TP Radio. 24/7 music designed for work
          </Text>
        </Box>
      </Stack>
      <AudioPlayerControls />
    </Stack>
  );
}

function AudioPlayerControls() {
  const [audioState, audioActions] = useAudio({
    src: "https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3",
  });

  const { isMuted, isPaused, volume } = audioState;
  const { onToggleMute, onTogglePlay, onVolumeChange } = audioActions;

  const PlayerButtonIcon = React.useMemo(() => {
    if (isMuted || isPaused) return FiPlay;
    return FiPause;
  }, [isMuted, isPaused]);

  const MutedIcon = React.useMemo(() => {
    if (isMuted) return FiVolumeX;
    return FiVolume2;
  }, [isMuted]);

  return (
    <Stack flex={1} isInline spacing={[0, 0, 3]} justifyContent={["center", "center", "flex-end"]} alignItems="center">
      <Stack spacing={0} isInline alignItems="center">
        <Button display={["none", "none", "flex"]} variant="unstyled" onClick={onToggleMute}>
          <Icon as={MutedIcon} color="gray.100" fontSize="xl" mb={1} />
        </Button>
      </Stack>
      <Stack isInline spacing={[0, 0, 8]} justifyContent={["center", "center", "flex-end"]} alignItems="center">
        <Box display={["none", "none", "block"]}>
          <Slider width={28} value={volume} step={0.05} onChange={onVolumeChange} min={0} max={1}>
            <SliderTrack>
              <SliderFilledTrack bg="gray.100" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Stack spacing={0} isInline justifyContent="center" height={16} width={16}>
          <Button onClick={onTogglePlay} rounded="full" height={16} width={16}>
            <Icon ml={isPaused || isMuted ? 1 : 0} fontSize="2xl" as={PlayerButtonIcon} color="green.500" />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
