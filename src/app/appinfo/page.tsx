import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import packageJson from "../../../package.json";

const MyHome: React.FC = () => {
  const nextVersion: string = packageJson.dependencies["next"];
  const tanstackVersion: string =
    packageJson.dependencies["@tanstack/react-query"];
  const prismaVersion: string = packageJson.dependencies["@prisma/client"];
  const trpcVersion: string = packageJson.dependencies["@trpc/client"];

  const tailwindcssVersion: string = packageJson.dependencies["tailwindcss"];
  const tsVersion: string = packageJson.dependencies["typescript"];

  const KeyValue = ({ keyName, value }) => (
    <div className="grid grid-cols-2">
      <div>{keyName}</div>
      <div>{value}</div>
    </div>
  );

  // Define the data for the stack and extras
  const stackData = [
    { keyName: "Node:", value: process.version },
    { keyName: "Next:", value: nextVersion },
    { keyName: "TypeScript:", value: tsVersion },
    { keyName: "Prisma:", value: prismaVersion },
    { keyName: "tRPC:", value: trpcVersion },
    { keyName: "React Query:", value: tanstackVersion },
    { keyName: "TailwindCSS:", value: tailwindcssVersion },
  ];

  const extrasData = [
    { keyName: "Docker smtp server", value: "schickling/mailcatcher" },
    { keyName: "Docker MySQL DB", value: "mysql:8.0" },
  ];

  return (
    <MaxWidthWrapper>
      <div className=" mx-auto my-12 flex w-[100%] flex-col items-center justify-center rounded-2xl border-gray-500  p-4 text-gray-900     dark:text-gray-300 lg:w-[80%]">
        <h1 className="text-4xl font-bold text-blue-600">APP INFO</h1>
        <div className=" my-12 w-[100%] rounded-2xl border-gray-900 bg-gray-100 p-6 text-lg shadow-inner ring ring-blue-500/50 ring-offset-8 ring-offset-white/45 dark:bg-gray-900 md:w-[75%] ">
          <div className=" divide-y-2 divide-slate-500/25 overflow-hidden  whitespace-nowrap dark:divide-popover/10">
            <div className="col-span-2 my-2 mb-4 divide-x-2 divide-solid text-center text-xl font-semibold text-blue-500">
              STACK
            </div>
            {stackData.map((item) => (
              <KeyValue
                key={item.keyName}
                keyName={item.keyName}
                value={item.value}
              />
            ))}
            <div className="col-span-2 my-4 divide-x-4 text-center text-xl font-semibold text-blue-500 dark:divide-solid">
              INFRA
            </div>
            {extrasData.map((item) => (
              <KeyValue
                key={item.keyName}
                keyName={item.keyName}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default MyHome;
