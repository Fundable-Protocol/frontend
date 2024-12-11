import * as React from "react";
import { SVGProps } from "react";
const LinkIcon = (
  props: SVGProps<SVGSVGElement> & { color?: string; className?: string }
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    className={props.className} // Allow Tailwind classes to be passed
    {...props}
  >
    <path
      fill={props.color || "currentColor"}
      d="M22.5 13.5v2.25h-6.75a4.5 4.5 0 0 0-4.5 4.5v4.5a4.5 4.5 0 0 0 4.5 4.5H27a4.5 4.5 0 0 0 4.5-4.5v-4.5a4.5 4.5 0 0 0-2.25-3.897v-2.47a6.753 6.753 0 0 1 4.5 6.365v4.5a6.75 6.75 0 0 1-6.75 6.75H15.75A6.75 6.75 0 0 1 9 24.748V20.25a6.75 6.75 0 0 1 6.75-6.75h6.75Z"
    />
    <path
      fill={props.color || "currentColor"}
      d="M13.5 22.5v-2.25h6.75a4.5 4.5 0 0 0 4.5-4.5v-4.5a4.5 4.5 0 0 0-4.5-4.5H9a4.5 4.5 0 0 0-4.5 4.5v4.5a4.5 4.5 0 0 0 2.25 3.897v2.47a6.752 6.752 0 0 1-4.5-6.367v-4.5A6.75 6.75 0 0 1 9 4.5h11.25A6.75 6.75 0 0 1 27 11.25v4.5a6.75 6.75 0 0 1-6.75 6.75H13.5Z"
    />
  </svg>
);
export default LinkIcon;
