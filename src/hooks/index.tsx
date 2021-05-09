import React from "react";
import debounce from "lodash.debounce";

const isBrowser = typeof window !== "undefined";

export function useAudio({ src, config = {} }): AudioStateAndActions {
  const audio: HTMLMediaElement = React.useMemo(() => !!isBrowser && new Audio(src), [isBrowser]);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const togglePlayWithSpacebar = ({ keyCode }) => keyCode === 32 && onTogglePlay();
    document.addEventListener("keyup", togglePlayWithSpacebar);
    return () => {
      document.removeEventListener("keyup", togglePlayWithSpacebar);
    };
  }, []);

  const onLoad = () => dispatch(["ON_LOAD", { audio }]);
  const onTogglePlay = () => dispatch(["ON_TOGGLE_PLAY", { audio }]);
  const onToggleMute = () => dispatch(["ON_TOGGLE_MUTE", { audio }]);
  const onVolumeChange = (volume) => dispatch(["ON_VOLUME_CHANGE", { audio, volume }]);

  React.useEffect(() => {
    onLoad();
    return () => {
      audio?.pause();
    };
  }, [audio]);

  React.useEffect(() => {
    // Stop streaming if audio.paused or no audio?.volume
    if (audio?.paused || !audio?.volume) audio.load();
  }, [audio?.paused, audio?.volume]);

  const actions = {
    onTogglePlay,
    onToggleMute,
    onVolumeChange,
  };

  return [state, actions];
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

function reducer(state, [type, { audio, volume }]: Action) {
  switch (type) {
    case "ON_LOAD":
      state.volumeBeforeMute = state.volume;
      return getAudioPlayerState({ audio, state });

    case "ON_TOGGLE_PLAY":
      if (!audio.volume) {
        audio.play();
        audio.volume = state.volumeBeforeMute;
        return getAudioPlayerState({ audio, state });
      }
      if (audio.paused) {
        audio.play();
        return getAudioPlayerState({ audio, state });
      }
      if (!audio.paused) {
        audio.pause();
        return getAudioPlayerState({ audio, state });
      }
      return state;

    case "ON_TOGGLE_MUTE":
      if (audio.volume) {
        audio.volume = 0;
        audio.pause();
        state.volumeBeforeMute = state.volume;
        return getAudioPlayerState({ audio, state });
      }
      if (!audio.volume) {
        audio.play();
        audio.volume = state.volumeBeforeMute;
        return getAudioPlayerState({ audio, state });
      }
      return state;

    case "ON_VOLUME_CHANGE":
      audio.volume = volume;
      return getAudioPlayerState({ audio, state });

    default:
      throw new Error(`Action is not found`);
  }
}

// // API search function
// function searchCharacters(search) {
//   const apiKey = "f9dfb1e8d466d36c27850bedd2047687";
//   return fetch(
//     `https://gateway.marvel.com/v1/public/comics?apikey=${apiKey}&titleStartsWith=${search}`,
//     {
//       method: "GET",
//     }
//   )
//     .then((r) => r.json())
//     .then((r) => r.data.results)
//     .catch((error) => {
//       console.error(error);
//       return [];
//     });
// }
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
