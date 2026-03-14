"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface AnimatedCheckboxProps {
  readonly checked: boolean;
  readonly onChange: () => void;
  readonly label?: string;
  readonly disabled?: boolean;
}

const checkboxVariants = {
  unchecked: {
    scale: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  checked: {
    scale: [1, 1.2, 1] as number[],
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
};

const checkmarkVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -45,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
} as const;

const labelVariants = {
  unchecked: {
    textDecoration: "none",
    color: "#000000",
  },
  checked: {
    textDecoration: "line-through",
    color: "#9CA3AF",
  },
} as const;

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
}: AnimatedCheckboxProps) {
  return (
    <label
      className={`flex items-center gap-3 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <motion.button
        type="button"
        onClick={disabled ? undefined : onChange}
        className="flex size-5 shrink-0 items-center justify-center rounded border-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
        variants={checkboxVariants}
        animate={checked ? "checked" : "unchecked"}
        transition={{ duration: 0.25, ease: "easeOut" }}
        whileTap={disabled ? undefined : { scale: 0.85 }}
        disabled={disabled}
        aria-checked={checked}
        role="checkbox"
      >
        <motion.div
          variants={checkmarkVariants}
          initial="hidden"
          animate={checked ? "visible" : "hidden"}
          transition={{ duration: 0.2, delay: checked ? 0.1 : 0 }}
        >
          <Check className="size-3 text-white" strokeWidth={3} />
        </motion.div>
      </motion.button>

      {label !== undefined && (
        <motion.span
          className="select-none text-sm"
          variants={labelVariants}
          animate={checked ? "checked" : "unchecked"}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </label>
  );
}
