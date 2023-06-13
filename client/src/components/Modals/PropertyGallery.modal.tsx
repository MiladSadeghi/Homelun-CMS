import React, { useState } from "react";
import tw from "twin.macro";
import { styled } from "twin.macro";
import { IoMdCloseCircle } from "react-icons/io";
import { GrFormClose } from "react-icons/gr";
import { v4 } from "uuid";
import { TGalleryInput } from "../../types/modals";

function PropertyGallery({ toggle, tab, inputs }: any) {
  const { galleryModalToggle, setGalleryModalToggle } = toggle;
  const { galleryInputs, setGalleryInputs } = inputs;
  const [galleryTab, setGalleryTab] = useState<"view" | "upload">("upload");

  const addGalleryInput = () => {
    setGalleryInputs((prevState: any) => [
      ...prevState,
      { key: v4(), value: "", isValid: false },
    ]);
  };

  const removeGalleryInput = (inputId: string) => {
    setGalleryInputs((prevState: any) =>
      prevState.filter((data: TGalleryInput) => data.key !== inputId)
    );
  };

  const changeGalleryInputValue = (inputId: string, inputValue: string) => {
    const isValid: boolean = /^https?:\/\/.+(\.jpg|\.jpeg|\.png)$/i.test(
      inputValue
    );
    setGalleryInputs((inputs: any) =>
      inputs.map((input: any) => {
        return input.key === inputId
          ? { ...input, value: inputValue, isValid }
          : input;
      })
    );
  };

  const isGalleryReady = (): boolean => {
    const find = galleryInputs.findIndex(
      (input: TGalleryInput) => input.isValid === false
    );
    if (find === -1) return false;
    return true;
  };

  return (
    <GalleryModal show={galleryModalToggle}>
      <div tw="bg-white w-full h-full rounded-md">
        <GalleryHeader>
          <h3 tw="font-semibold text-lg">Gallery</h3>
          <GrFormClose
            tw="cursor-pointer"
            size={27}
            onClick={() => setGalleryModalToggle(false)}
          />
        </GalleryHeader>
        <GalleryTabs>
          <GalleryTab
            active={galleryTab === "upload"}
            onClick={() => setGalleryTab("upload")}
          >
            Upload Photos
          </GalleryTab>
          <GalleryTab
            active={galleryTab === "view"}
            onClick={() => setGalleryTab("view")}
          >
            View Photos
          </GalleryTab>
        </GalleryTabs>
        <GalleryBody>
          {galleryTab === "upload" ? (
            <>
              <Button
                tw="ml-auto cursor-pointer mb-4 mr-[36.6px]"
                onClick={() => addGalleryInput()}
              >
                Add Input
              </Button>
              {galleryInputs.map((data: TGalleryInput) => (
                <div tw="flex items-center mb-2" key={data.key}>
                  <GalleryInput
                    tw="w-full"
                    error={!data.isValid}
                    value={data.value}
                    onChange={(e) =>
                      changeGalleryInputValue(data.key, e.target.value)
                    }
                  />
                  <div tw="flex ml-4 w-[92px] items-center">
                    <IoMdCloseCircle
                      size={26}
                      tw="text-red-700 ml-1 mr-2 cursor-pointer"
                      onClick={() => removeGalleryInput(data.key)}
                    />
                  </div>
                </div>
              ))}
            </>
          ) : isGalleryReady() ? (
            <div tw="flex justify-center items-center">
              <h1 tw="text-gray-500 my-auto text-2xl font-semibold mt-80">
                Cant Find Any Image!
              </h1>
            </div>
          ) : (
            <div tw="grid grid-cols-4 gap-3">
              {galleryInputs.map((input: TGalleryInput) => (
                <div key={input.key} tw="relative">
                  <img
                    tw="w-[300px] h-[300px] mx-auto p-1 border border-gray-500 object-cover"
                    src={input.value}
                  />
                  <IoMdCloseCircle
                    tw="absolute right-[24px] -top-[9px] bg-white rounded-full cursor-pointer"
                    size={20}
                    onClick={() => removeGalleryInput(input.key)}
                  />
                </div>
              ))}
            </div>
          )}
        </GalleryBody>
      </div>
    </GalleryModal>
  );
}

const Button = tw.button`rounded-md !bg-teal-600 text-white text-sm flex items-center font-semibold py-2 px-2`;
const GalleryModal = styled.div<{ show: boolean }>`
  ${tw`bg-slate-600 p-8 bg-opacity-60 absolute left-0 top-0 w-full h-full`} ${({
    show,
  }) => (show ? tw`block` : tw`hidden`)}
`;
const GalleryHeader = tw.div`py-3 px-7 border-b flex justify-between items-center`;
const GalleryTabs = tw.div`flex w-full`;
const GalleryTab = styled.h3<{ active: boolean }>`
  ${tw`font-bold w-full text-center py-3 text-gray-400 cursor-pointer`} ${({
    active,
  }) => active && tw`border-b bg-purple-900 text-white`}
`;
const GalleryBody = tw.div`p-7 overflow-y-auto h-[87%]`;
const GalleryInput = styled.input<{ error: boolean }>`
  ${tw`col-span-4 py-2 px-2 rounded-md border border-gray-300 border-solid`}
  ${({ error = false }) =>
    error ? tw`!border-red-500` : tw`!border-green-700`}
`;

export default PropertyGallery;
