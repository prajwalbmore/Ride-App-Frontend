import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md", // sm | md | lg | xl
  showClose = true,
  footer, // optional JSX for footer
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl">
                <Dialog.Title className="text-lg font-semibold tracking-wide">
                  {title}
                </Dialog.Title>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-white/20 transition"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto flex-1 hide-scrollbar">{children}</div>

              {/* Footer */}
              {footer && <div className="px-5 py-3 border-t">{footer}</div>}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
