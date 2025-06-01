import * as React from "react";
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    id="user"
    fill="white"
    {...props}
  >
    <g>
      <rect width={32} height={32} opacity={0} />
      <path d="M16 15c2.82 0 5-3.23 5-6A5 5 0 0 0 11 9C11 11.77 13.18 15 16 15zm0-9a3 3 0 0 1 3 3c0 1.75-1.46 4-3 4s-3-2.25-3-4A3 3 0 0 1 16 6zM23.12 19.11a10 10 0 0 0-14.24 0 5.87 5.87 0 0 0-2.06 4.11 5.87 5.87 0 0 0 2.06 4.1 9.95 9.95 0 0 0 14.24 0 5.87 5.87 0 0 0 2.06-4.1A5.87 5.87 0 0 0 23.12 19.11zm-1.41 6.78a8 8 0 0 1-11.42 0 4 4 0 0 1-1.47-2.67 4 4 0 0 1 1.47-2.68 8 8 0 0 1 11.42 0 4 4 0 0 1 1.47 2.68A4 4 0 0 1 21.71 25.89z" />
    </g>
  </svg>
);
export default UserIcon;
