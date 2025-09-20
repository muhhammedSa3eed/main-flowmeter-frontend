import * as motion from "motion/react-client";

interface LoginButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function ViewButton({
  type = "button",
  className = "",
  children,
  onClick,
}: LoginButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 0.8 }}
      whileTap={{ scale: 0.8 }}
      type={type}
      onClick={onClick}
      style={box}
      className={`flex items-center justify-center p-2 ${className}`}
    >
      {children}
    </motion.button>
  );
}

/**
 * ==============   Styles   ================
 */
const box = {
  backgroundColor: 'rgba(72, 195, 137, 1)',
  borderRadius: 5,
  color: "black",
  border: "none",
  cursor: "pointer",
  width: '100%',
  padding: '8px 16px', 
};

