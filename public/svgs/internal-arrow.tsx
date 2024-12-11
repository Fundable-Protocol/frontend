import * as React from "react";
import { SVGProps } from "react";

const InternalArrowIcon = (
  props: SVGProps<SVGSVGElement> & { color?: string; className?: string }
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    className={props.className} // Allow Tailwind classes to be passed
    {...props}
  >
    <path
      stroke={props.color || "currentColor"} // Use "currentColor" for easier color control
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M1 19c0 8.485 0 12.726 2.637 15.363 2.635 2.635 6.878 2.635 15.363 2.635s12.728 0 15.365-2.635c2.442-2.443 2.62-6.264 2.635-13.565M17.2 1c-7.299.013-11.12.193-13.563 2.635C2.167 5.104 1.517 7.073 1.229 10"
    />
    <path
      stroke={props.color || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.8 17.2 37 1m0 0h-9.62M37 1v9.62M35.2 2.8 19 19m0 0h7.2M19 19v-7.2"
    />
  </svg>
);

export default InternalArrowIcon;
