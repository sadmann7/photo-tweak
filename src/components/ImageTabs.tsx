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
        <Tab.List className="flex space-x-1 rounded-t-xl bg-gray-200 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={twMerge(
                "w-full rounded-lg py-2.5 px-2 text-sm font-medium leading-5 text-white",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                "ui-selected:bg-violet-800 ui-selected:shadow",
                "ui-not-selected:text-gray-800 ui-not-selected:hover:bg-gray-900/20 ui-not-selected:hover:text-black"
              )}
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="overflow-hidden rounded-b-xl bg-gray-200 px-1 pt-0.5 pb-1 ">
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.name}
              className="rounded-xl ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
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
