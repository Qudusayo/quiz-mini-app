import { Link } from "react-router";
import Button from "../components/button";
import CeloIcon from "../components/icon";

function Home() {
  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center">
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

const ButtonLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <Link to={to}>
          <Button className="lg:w-3/5 w-4/5 mx-auto block text-lg font-semibold">
            {children}
          </Button>
        </Link>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[2px] bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
