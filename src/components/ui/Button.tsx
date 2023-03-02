import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef } from "react";
import LoadingDots from "./LoadingDots";

type ButtonProps = {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  loadingVariant?: "spinner" | "dots";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      isLoading = false,
      loadingVariant = "spinner",
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={`${
          variant === "primary"
            ? "bg-violet-600 text-white enabled:hover:bg-violet-700 enabled:active:bg-violet-600"
            : "bg-gray-500 text-white enabled:hover:bg-gray-600 enabled:active:bg-gray-500"
        } flex h-10 w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-violet-100 disabled:cursor-not-allowed disabled:bg-opacity-60 ${className}`}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          loadingVariant === "spinner" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LoadingDots />
          )
        ) : null}
        {isLoading
          ? loadingVariant === "spinner"
            ? "Loading..."
            : null
          : props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
