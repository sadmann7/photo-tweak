import { Toaster } from "react-hot-toast";

const ToasterWrapper = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 3000,
        style: {
          background: "#111827",
          color: "#ffffff",
        },
      }}
    />
  );
};

export default ToasterWrapper;
