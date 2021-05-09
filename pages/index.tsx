import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { BackgroundVideo } from "@components";
import { AudioPlayer } from "@components/AudioPlayer";
import { TrustPilotMenuLink } from "@components/TrustPilotMenuLink";
import { JobsDrawerTrigger } from "@components/JobsDrawerTrigger";
import { Stack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

const client = new W3CWebSocket("wss://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio");

const Home: React.FC = () => {
  const [songState, setSongState] = React.useState<any>({});
  console.log({ songState });

  React.useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data) setSongState(data);
    };
  }, []);

  return (
    <>
      <NextSeo title="📻 TP Radio" description="TP Radio. 24/7 music designed for work" />
      <Stack height="100vh" spacing={0}>
        <BackgroundVideo songState={songState} />
        <TrustPilotMenuLink />
        <JobsDrawerTrigger />
        <AudioPlayer songState={songState} />
      </Stack>
    </>
  );
};

export default Home;
