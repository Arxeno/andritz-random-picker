import { cn } from "@/lib/utils";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Stack = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={twMerge(
        "grid h-full w-full grid-cols-3 grid-rows-1",
        className,
      )}
      {...props}
    >
      {React.Children.map(
        children,
        (child: React.ReactNode): React.ReactNode => {
          if (!React.isValidElement(child)) {
            throw new Error("Stack error: this child is not a valid element.");
          }

          const modifiedClassName = cn(
            (child.props as React.HTMLAttributes<HTMLElement>).className,
            "row-start-1 row-end-1 col-start-1 -col-end-1 z-10",
          );

          console.log(modifiedClassName);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.cloneElement(child as any, {
            className: modifiedClassName,
          });
        },
      )}
    </div>
  );
};

export default Stack;
