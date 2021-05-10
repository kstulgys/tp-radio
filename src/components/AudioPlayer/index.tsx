import React from "react";
import { FiVolume, FiPlay, FiPause, FiVolumeX, FiVolume2 } from "react-icons/fi";
import { Button, Stack, Text, Image, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Icon } from "@chakra-ui/react";

export function AudioPlayer({ songState }) {
  return (
    <Stack
      spacing={[0, 0, 5]}
      isInline
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      bottom={0}
      p={3}
      px={[4, 4, 10]}
      width="full"
      bg="rgba(0, 0, 0, 0.5)"
      sx={{ backdropFilter: "blur(20px)" }}
    >
      <Stack display={["none", "none", "flex"]} flex={1} isInline alignItems="center" spacing={5}>
        <Box height="20" width="20">
          <Image rounded="sm" height="20" width="20" objectFit="cover" src={songState?.now_playing?.song.art} />
        </Box>
        <Stack spacing={0} color="gray.100">
          <Box>
            <Text lineHeight="shorter" mb={0} fontSize="xl" fontWeight="bold">
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
  const { isLoading, isPlaying, isPaused, isMuted, volume, onVolumeChange, onTogglePlayPause, onToggleMute } = useAudio();

  const PlayerButtonIcon = React.useMemo(() => {
    if (isPaused) return FiPlay;
    return FiPause;
  }, [isPaused]);

  const MutedIcon = React.useMemo(() => {
    if (isMuted) return FiVolumeX;
    return FiVolume2;
  }, [isMuted]);

  return (
    <Stack flex={1} isInline spacing={[0, 0, 3]} justifyContent={["center", "center", "flex-end"]} alignItems="center">
      <Stack spacing={0} isInline alignItems="center">
        <Button display={["none", "none", "flex"]} variant="unstyled" onClick={onToggleMute}>
          <Icon as={MutedIcon} color="gray.100" fontSize="2xl" mb={1} />
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
        <Stack spacing={0} isInline justifyContent="center">
          <Button isLoading={isLoading} onClick={onTogglePlayPause} rounded="full" height={20} width={20}>
            <Icon ml={!isPlaying ? 1 : 0} fontSize="2xl" as={PlayerButtonIcon} color="green.500" />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

type AudioStateAndActions = [
  {
    isPaused: boolean;
    isMuted: boolean;
    volume: number;
  },
  {
    onTogglePlay: () => void;
    onToggleMute: () => void;
    onVolumeChange: (val: number) => void;
  },
];

const initialState = {
  isPaused: true,
  isMuted: true,
  volume: 0,
  volumeBeforeMute: 0,
};

function getAudioPlayerState({ audio, state }) {
  return {
    ...state,
    isPaused: audio.paused,
    isMuted: !audio.volume,
    volume: audio.volume,
  };
}

type Action = [string, { audio: HTMLMediaElement; volume?: number }];

const streamSrc = "https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3";

function useAudio() {
  const audio: HTMLAudioElement = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const audio = new Audio(streamSrc);
    // audio.autoplay = true;
    return audio;
  }, []);

  const [, rerender] = React.useReducer((n, a = 1) => n + a, 0);
  const [isLoading, setIsLoading] = React.useState(true);

  const audioEvents = [
    "audioprocess",
    "canplay",
    "canplaythrough",
    "complete",
    "durationchange",
    "emptied",
    "ended",
    "loadeddata",
    "loadedmetadata",
    "pause",
    "play",
    "playing",
    "ratechange",
    "seeked",
    "seeking",
    "stalled",
    "suspend",
    // "timeupdate",
    "volumechange",
    "waiting",
  ];

  React.useEffect(() => {
    if (!audio) return;
    audioEvents.forEach((event) => {
      audio.addEventListener(event, () => {
        if (event === "waiting") setIsLoading(true);
        if (event === "canplay") {
          audio.play();
          setIsLoading(false);
        }
        rerender();
        console.log({ event });
      });
    });
    return () => {
      audioEvents.forEach((event) => {
        audio?.removeEventListener(event, rerender);
      });
      audio?.pause();
      audio?.removeAttribute("src");
    };
  }, [audio]);

  const onPlay = () => {
    if (!audio.src) {
      audio.setAttribute("src", streamSrc);
      audio.load();
    }
    audio.muted = false;
    audio.play();
  };

  const onPause = () => {
    audio.muted = true;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  };

  const onTogglePlayPause = () => {
    audio.paused ? onPlay() : onPause();
  };

  const onVolumeChange = (volume) => {
    audio.volume = volume;
    audio.volume ? onPlay() : onPause();
  };

  const onToggleMute = () => {
    audio.muted ? onPlay() : onPause();
  };

  return {
    isLoading,
    isPlaying: !audio?.paused ?? false,
    isPaused: audio?.paused ?? true,
    isMuted: audio?.muted ?? true,
    volume: audio?.volume ?? 0,
    onVolumeChange,
    onTogglePlayPause,
    onToggleMute,
  };
}
