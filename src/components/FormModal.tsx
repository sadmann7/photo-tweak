import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";

const FormModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Open dialog
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="grid w-full max-w-md transform place-items-center gap-5 overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-100"
                  >
                    Edit portrait
                  </Dialog.Title>
                  <div className="w-full max-w-md px-2 sm:px-0">
                    <Tab.Group
                      selectedIndex={selectedIndex}
                      onChange={setSelectedIndex}
                    >
                      <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {Array.from({ length: 2 }, (_, i) => (
                          <Tab
                            key={i}
                            className={twMerge(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",

                              "ui-selected:bg-white ui-selected:shadow",
                              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-white"
                            )}
                          >
                            Tab {i + 1}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel>Content 1</Tab.Panel>
                        <Tab.Panel>Content 2</Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FormModal;
