"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {IconBrandGoogle} from "@tabler/icons-react";

interface SignupFormDemoProps {
  EmailAddressText: string;
  PasswordText: string;
  NameText?: string;
  RoleText?: string;
  ButtonText: string;
  HeaderText: string;
  TextBelowHeader: string;
  LoginText: string;
  
}

export default function SignupFormDemo({EmailAddressText,PasswordText,NameText,RoleText,ButtonText,HeaderText,TextBelowHeader,LoginText}: SignupFormDemoProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-slate-400 p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        {HeaderText}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        {TextBelowHeader}
      </p>

      <form className="my-8 top-2.5 " onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          {NameText && (
          <LabelInputContainer>
            <Label htmlFor="firstname">{NameText}</Label>
            
            <Input id="firstname" className="cursor-pointer" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          )}
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">{EmailAddressText}</Label>
          <Input id="email" className="cursor-pointer" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        {RoleText && (
        <LabelInputContainer className="mb-4">
          <Label htmlFor="role">{RoleText}</Label>
          <Input id="role" className="cursor-pointer" type="text" />
        </LabelInputContainer>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">{PasswordText}</Label>
          <Input id="password" className="cursor-pointer" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="group/btn cursor-pointer relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 bbh-sans-bartle font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          {ButtonText}
          <BottomGradient />
        </button>

        <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-row space-y-4 space-x-2">
          <button
            className="group/btn cursor-pointer shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300 justify-center">
              {LoginText}
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
