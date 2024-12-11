import { Button } from "@/components/ui/button";
import { FC } from "react";

interface ButtonProps {
  onClick?: () => void;
}

const ConnectWalletButton: FC<ButtonProps> = ({ onClick, ...rest }) => {
  return (
    <Button onClick={onClick} variant="gradient">
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
