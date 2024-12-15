import { Button } from "@/components/ui/button";
import { FC } from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const ConnectWalletButton: FC<ButtonProps> = ({ onClick, className, ...rest }) => {
  return (
    <Button onClick={onClick} variant="gradient" className={className} {...rest}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
