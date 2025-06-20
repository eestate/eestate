"use client";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function MenuModal({ isOpen, onClose, onLoginClick }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Background overlay (optional fade) */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white" aria-hidden="true" />
        </Transition.Child>

        {/* Slide panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 flex">
            <DialogPanel className="close w-full h-full bg-white p-8 lg:p-16">
              <div className="flex justify-end mb-8 mr-[30px]">
                <button
                  onClick={onClose}
                  className="font-mplus text-sm mt-[-20px] cursor-pointer lg:text-base font-bold"
                >
                  CLOSE ×
                </button>
              </div>

              <div className="flex flex-col lg:flex-row h-full">
                <div className="flex-1 flex flex-col justify-center space-y-8 lg:space-y-12">
                  <div className="space-y-6 lg:space-y-8">
                    <Link to="/" onClick={onClose}>
                      <h1 className="text-4xl lg:text-8xl font-bold leading-none">HOME</h1>
                    </Link>
                    <Link to="/properties" onClick={onClose}>
                      <h1 className="text-4xl lg:text-8xl font-bold leading-none">PROPERTY</h1>
                    </Link>
                    <Link to="/listingagents" onClick={onClose}>
                      <h1 className="text-4xl lg:text-8xl font-bold leading-none">AGENTS</h1>
                    </Link>
                    <Link to="/about" onClick={onClose}>
                      <h1 className="text-4xl lg:text-8xl font-bold leading-none">ABOUT</h1>
                    </Link>
                  </div>

                  <div className="mt-8 lg:mt-16">
                    <p className="text-gray-600 text-sm lg:text-base mb-6">
                      Your smart gateway to trusted property
                      <br />
                      deals, fast, simple, secure.
                    </p>
                    <button
                      onClick={() => {
                        onLoginClick();
                        onClose();
                      }}
                      className="flex items-center text-lg lg:text-2xl font-semibold hover:opacity-70 transition-opacity"
                    >
                      CONTACT AS <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>

                <div className="hidden lg:flex flex-1 items-center justify-center mt-130">
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">
                      © 2025 eestate. All rights reserved
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
