import { Link } from "react-router";
import { useAccount } from "wagmi";
import ArrowBack from "../components/arrow-back";
import Button from "../components/button";
import UserIcon from "../components/user-icon";

function Profile() {
  const { address } = useAccount();
  const yesterdayScore = 850;
  const todayScore = 920;

  return (
    <div className="relative pt-12">
      <Link
        to="/"
        className="absolute top-4 left-4 text-white hover:text-white transition-colors text-lg flex items-center"
      >
        <ArrowBack />
        <span className="ml-2 font-semibold">Back</span>
      </Link>

      {/* Profile section */}
      <div className="flex flex-col items-center p-8">
        {/* Profile icon with border */}
        <div className="size-44 rounded-full border-white flex items-center justify-center mb-4 bg-white/10">
          <UserIcon className="size-36 stroke-2" />
        </div>
        <h1 className="text-2xl font-bold text-white mt-8 uppercase font-inter">
          User Profile
        </h1>

        {/* User Address */}
        <div className="mt-8 w-full">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Wallet Address</p>
            <p className="text-white font-bold font-inter text-xl">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
            </p>
          </div>
        </div>

        {/* Scores Section */}
        <div className="mt-6 w-full grid grid-cols-2 gap-4">
          {/* Today's Score */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Today's Score</p>
            <p className="text-white text-2xl font-bold font-inter">
              {todayScore}
            </p>
          </div>

          {/* Yesterday's Score */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Yesterday's Score</p>
            <p className="text-white text-2xl font-bold font-inter">
              {yesterdayScore}
            </p>
          </div>
        </div>

        {/* Claim Reward Button */}
      </div>
      <div className="relative w-full mt-12">
        <Button className="lg:w-3/5 w-4/5 mx-auto block text-xl font-semibold uppercase font-inter z-10 py-6">
          Claim Reward
        </Button>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[2px] bg-white"></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
