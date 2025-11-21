"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { IconMail, IconMapPin, IconPhone, IconAlarm, IconWritingSignOff } from "@tabler/icons-react";
import {motion} from 'framer-motion';

export default function SignupFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black dark:bg-black p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-6 shadow-input w-full max-w-md rounded-2xl bg-white p-8 dark:bg-zinc-900">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 bbh-sans-bartle">
              Let's Connect
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
            If you have any questions, no biggie, feel free to reach out to us.
          </p>

          <form className="mt-4 flex flex-col w-full gap-4" onSubmit={handleSubmit}>
            <LabelInputContainer>
              <Label htmlFor="firstname">Username</Label>
              <Input id="firstname" placeholder="Tyler" type="text" />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                className="h-25 resize-none text-black dark:text-white"
                placeholder="Type your message here..."
              />
            </LabelInputContainer>

<button
  type="Submit"
  className="group cursor-pointer relative block h-10 w-full rounded-md bg-linear-to-br bbh-sans-bartle from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
>
  Submit &rarr;
  <BottomGradient />
</button>
          </form>
        </div>
        </motion.div>

        {/* Right: Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center gap-6 w-full max-w-lg">
            <ContactCard

              Icon={IconMail}
              title="Email"
              content="rutu.bahrain@gmail.com"
              className="bbh-sans-bartle"
              href="#"
          />
          <ContactCard
            className="bbh-sans-bartle"
            Icon={IconPhone}
            title="Phone"
            content="+1 (234) 567-890"
            href="#"
          />
          <ContactCard
            className="bbh-sans-bartle"
            Icon={IconMapPin}
            title="Address"
            content="123 Main Street, City, Country"
          />

          <ContactCard
            className="bbh-sans-bartle"
            Icon={IconAlarm}
            title="Working Hours"
            content="Mon - Fri: 9am - 5pm"
          />

          <ContactCard
            className="bbh-sans-bartle"
            Icon={IconWritingSignOff}
            title="Helpers"
            content="For more questions, scroll down to FAQs"
          />

          <ContactCard
            className="bbh-sans-bartle"
            Icon={IconWritingSignOff}
            title="Collab"
            content="Reach out for partnerships and projects"
            href="#"
          />
        </div>
        </motion.div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-0.5 w-full bg-linear-to from-transparent to-transparent opacity-100 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-0.5 w-1/2 bg-linear-to from-transparent via-indigo-500 to-transparent opacity-70 blur-sm transition duration-500 group-hover:opacity-100" />
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
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};


const ContactCard = ({
  className,
  Icon,
  title,
  content,
  href,
}: {
  className: string;
  Icon: React.ElementType;
  title: string;
  content: string;
  href?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-lg w-full">
      <Icon className="w-6 h-6 text-black mb-2" />
      <span className={cn("text-lg font-semibold text-neutral-800 dark:text-neutral-200", className)}>{title}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-md text-black hover:underline"
        >
          {content}
        </a>
      ) : (
        <span className="text-md text-neutral-600 dark:text-neutral-300 text-center">{content}</span>
      )}
    </div>
  );
};
