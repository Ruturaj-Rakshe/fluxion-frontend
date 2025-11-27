import React from "react";
import DottedGlowBackground, {DottedGlowBackgroundProps} from "@/components/ui/dotted-glow-background";
import ButtonFooter from "./ButtonFooter";

interface DemoProps extends Partial<DottedGlowBackgroundProps> {
  className?: string;
}


export function DottedGlowBackgroundDemoSecond(props: DemoProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={3.2}
        speedScale={1}
        firstString=""
        secondString=""
        Button={<ButtonFooter title="Enter" href="/signup" />}

        {...props}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center md:flex-row">
        <div>
          <h2 className="text-center text-3xl font-normal tracking-tight sm:text-3xl md:text-left text-gradient bbh-sans-bartle">
            {props.firstString}
          </h2>
          <p className="mt-4 max-w-2xl text-white md:text-left dark:text-neutral-300">
            {props.secondString}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
             {props.Button}
        </div>
      </div>
    </div>
  );
}
