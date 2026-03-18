import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteors, setMeteors] = useState<
    Array<{
      id: number;
      left: string;
      top: string;
      animationDelay: string;
      animationDuration: string;
    }>
  >([]);

  useEffect(() => {
    const defaultNumber = number || 20;
    const generateMeteors = () => {
      const meteorsArr = new Array(defaultNumber).fill(true).map((_, i) => ({
        id: i,
        left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
        top: Math.floor(Math.random() * 200) + "px",
        animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
        animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
      }));
      setMeteors(meteorsArr);
    };
    generateMeteors();
  }, [number]);

  return (
    <>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            left: meteor.left,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        ></span>
      ))}
    </>
  );
};
