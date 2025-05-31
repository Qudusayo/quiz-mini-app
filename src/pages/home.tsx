import CeloIcon from "../components/icon";
import { ButtonLink } from "../components/button-link";
import { ConnectMenu } from "../components/connect-menu";

function Home() {
  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center relative">
      <ConnectMenu />
      <CeloIcon />
      <h1 className="text-center text-4xl font-normal text-white uppercase">
        Welcome!
      </h1>
      <div className="flex flex-col gap-4 w-full">
        <ButtonLink to="/challenge">Daily Challenge</ButtonLink>
        <ButtonLink to="/quick-play">Quick Play</ButtonLink>
        <ButtonLink to="/leaderboard">Leaderboard</ButtonLink>
        <ButtonLink to="/profile">Profile</ButtonLink>
      </div>
    </div>
  );
}

export default Home;
