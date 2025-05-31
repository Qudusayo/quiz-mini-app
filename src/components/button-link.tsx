import { Link } from "react-router";
import Button from "./button";

export const ButtonLink = ({
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
