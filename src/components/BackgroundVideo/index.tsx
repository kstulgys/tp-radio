import React from "react";
import { Box } from "@chakra-ui/react";

export function BackgroundVideo({ songState }): JSX.Element {
  const [, rerender] = React.useReducer((count) => count + 1, 0);
  const videoRef = React.useRef<HTMLVideoElement>();

  React.useEffect(() => {
    if (videoRef?.current) {
      console.log(videoRef?.current);
      videoRef.current.playbackRate = 0.8;
      rerender();
    }
  }, []);

  const artUrl = songState?.now_playing?.song?.art || "";
  // Show image or video
  return (
    <>
      <Box
        display={["block", "block", "none"]}
        backgroundImage={`url(${artUrl})`}
        height="full"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      />
      <Box
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   @ts-ignore
        ref={videoRef}
        display={["none", "none", "block"]}
        as="video"
        loop
        autoPlay
        muted
        filter="grayscale(60%)"
        position="fixed"
        objectFit="cover"
        right={0}
        bottom={0}
        minWidth="full"
        minHeight="full"
      >
        <Box as="source" src="Untitled-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </>
  );
}
