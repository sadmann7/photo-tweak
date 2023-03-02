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
    <div className="w-full max-w-xl px-2 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-violet-900 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={twMerge(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-violet-700",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                "ui-selected:bg-white ui-selected:shadow",
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
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ImageTabs;
