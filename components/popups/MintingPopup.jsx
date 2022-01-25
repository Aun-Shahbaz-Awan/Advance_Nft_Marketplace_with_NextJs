import { React, Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
// React icons
import { AiFillCheckCircle } from "react-icons/ai";
import { RiArrowDropUpLine, RiLoader5Fill } from "react-icons/ri";
import { FaEthereum } from "react-icons/fa";

const MintingPopup = ({ isPopupOpen, closeModal, tokenDetail, imageUrl }) => {
  return (
    <>
      <Transition appear show={isPopupOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto bg-gray-900 bg-opacity-75"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-12 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-white">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 flex justify-center mb-6"
                >
                  Complete your listing
                </Dialog.Title>
                {/* Token Deatils */}
                <div>
                  <div className="p-2 mb-2 font-bold w-full flex items-center rounded-md border border-gray-500  hover:text-secondary hover:bg-primary hover:border-primary">
                    <Image src={imageUrl} width="50" height="50" />
                    <div className="flex flex-col ml-3">
                      <span className="text-xs font-medium text-gray-500 leading-3 pb-0.5">
                        keto
                      </span>
                      <span className="text-sm leading-none">
                        {tokenDetail?.name}
                      </span>
                    </div>
                    <div className="flex flex-col ml-auto pr-3">
                      <span className="text-xs font-medium text-gray-500 leading-3 pb-0.5 ml-auto">
                        Price
                      </span>
                      <span className=" text-sm leading-none flex">
                        <FaEthereum />
                        {tokenDetail?.price}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="w-full mx-auto bg-white rounded-2xl">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full p-3 text-sm font-medium text-left border border-indigo-700 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                            <div className="font-bold w-full flex items-center rounded-md hover:text-secondary hover:bg-primary hover:border-primary">
                              <AiFillCheckCircle className=" text-indigo-700 text-2xl mr-2" />
                              Initialize your wallet
                            </div>

                            <RiArrowDropUpLine
                              className={`${
                                open ? "transform rotate-180" : ""
                              } w-5 h-5 text-indigo-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            To get set up for selling on OpenSea for the first
                            time, you must initialize your wallet, which
                            requires a one-time gas fee.
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="mt-2">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full p-3 text-sm font-medium text-left border border-indigo-700 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                            <div className="font-bold w-full flex items-center rounded-md hover:text-secondary hover:bg-primary hover:border-primary">
                              <AiFillCheckCircle className=" text-indigo-700 text-2xl mr-2" />
                              Approve this item for sale
                            </div>

                            <RiArrowDropUpLine
                              className={`${
                                open ? "transform rotate-180" : ""
                              } w-5 h-5 text-indigo-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            To get set up for auction listings for the first
                            time, you must approve this item for sale, which
                            requires a one-time gas fee.
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as="div" className="mt-2">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full p-3 text-sm font-medium text-left border border-indigo-700 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                            <div className="font-bold w-full flex items-center rounded-md hover:text-secondary hover:bg-primary hover:border-primary">
                              <RiLoader5Fill className="animate-spin text-indigo-700 text-xl mr-2 border border-indigo-700 rounded-full" />
                              Confirming {tokenDetail?.price} ETH Listing
                            </div>

                            <RiArrowDropUpLine
                              className={`${
                                open ? "transform rotate-180" : ""
                              } w-5 h-5 text-indigo-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            Accept the signature request in your wallet and wait
                            for your listing to process.
                            <p className="text-xs mt-1 text-indigo-700">
                              Waiting for signature...
                            </p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>

                <p className="mt-4 text-xs text-center ">
                  By connecting, you agree to our{" "}
                  <span className=" text-primary cursor-pointer">Terms</span>{" "}
                  and{" "}
                  <span className="text-primary cursor-pointer">
                    Protocol Disclaimer
                  </span>
                  .
                </p>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MintingPopup;
