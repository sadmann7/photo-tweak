import { Tab } from "@headlessui/react";
import { ReactNode, type Dispatch, type SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

type ImageTabsProps = {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  tabs: {
    name: string;
    content: ReactNode;
  }[];
};

const ImageTabs = ({
  selectedIndex,
  setSelectedIndex,
  tabs,
}: ImageTabsProps) => {
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="flex max-w-[15rem] space-x-1 rounded-md bg-slate-700 p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            className={twMerge(
              "w-full rounded-sm py-2 text-sm font-medium leading-5 text-gray-100",
              "ring-white ring-opacity-60 ring-offset-1 ring-offset-violet-400 focus:outline-none focus:ring-1",
              "ui-selected:bg-slate-900/75 ui-selected:shadow",
              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-white"
            )}
          >
            {tab.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {tabs.map((tab) => (
          <Tab.Panel
            key={tab.name}
            className={twMerge(
              "rounded-md bg-slate-700 p-1",
              "ring-white ring-opacity-60 ring-offset-1 ring-offset-violet-400 focus:outline-none focus:ring-1"
            )}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ImageTabs;
