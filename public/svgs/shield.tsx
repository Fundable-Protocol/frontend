import * as React from "react";
import { SVGProps } from "react";
const ShieldIcon = (
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
      stroke={props.color || "currentColor"} // Use "currentColor" for easier color control
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M33 13.5v-3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v15a3 3 0 0 0 3 3h12m15-15H9m24 0v3"
    />
    <path
      stroke={props.color || "currentColor"} // Use "currentColor" for easier color control
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m28.488 21.188 3.834.973c.4.102.68.465.668.876C32.732 31.674 27.75 33 27.75 33s-4.981-1.326-5.24-9.963a.885.885 0 0 1 .668-.876l3.834-.974a2.998 2.998 0 0 1 1.476 0Z"
    />
  </svg>
);
export default ShieldIcon;
