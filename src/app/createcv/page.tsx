import React from "react";
import Instructions from "../components/CreateCV/Instructions";
import UploadCV from "../components/CreateCV/UploadCV";

const CreateCV = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-10 md:pt-1">
      {/* Left Section */}
      <div className="md:w-[50%] w-full h-full items-center justify-center mt-20">
        <Instructions />
      </div>

      {/* Right Section */}
      <div className="md:w-[50%] w-full flex items-center justify-center">
        <UploadCV/>
      </div>
    </div>
  );
};

export default CreateCV;
