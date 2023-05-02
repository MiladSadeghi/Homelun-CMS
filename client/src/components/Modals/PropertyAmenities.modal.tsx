import React from "react";
import { GrFormClose } from "react-icons/gr";
import styled from "styled-components";
import tw from "twin.macro";
import { v4 } from "uuid";
import { TAmenitiesInput } from "../../types/modals";
import { IoMdCloseCircle } from "react-icons/io";

function PropertyAmenities({ toggle, inputs }: any) {
  const { amenitiesModalToggle, setAmenitiesModalToggle } = toggle;
  const { amenitiesInputs, setAmenitiesInputs } = inputs;

  const addInput = () => {
    setAmenitiesInputs((prevState: TAmenitiesInput[]) => [
      ...prevState,
      { key: v4(), title: "", value: "" },
    ]);
  };

  const removeInput = (inputId: string) => {
    setAmenitiesInputs((prevState: any) =>
      prevState.filter((data: TAmenitiesInput) => data.key !== inputId)
    );
  };

  const changeInputValue = (inputId: string, inputValue: string) => {
    setAmenitiesInputs((inputs: any) =>
      inputs.map((input: any) => {
        return input.key === inputId ? { ...input, value: inputValue } : input;
      })
    );
  };

  const changeTitleValue = (inputId: string, title: string) => {
    setAmenitiesInputs((inputs: any) =>
      inputs.map((input: any) => {
        return input.key === inputId ? { ...input, title: title } : input;
      })
    );
  };

  return (
    <AmenitiesModal show={amenitiesModalToggle}>
      <div tw="bg-white w-full h-full rounded-md">
        <AmenitiesHeader>
          <h3 tw="font-semibold text-lg">Amenities</h3>
          <GrFormClose
            tw="cursor-pointer"
            size={27}
            onClick={() => setAmenitiesModalToggle(false)}
          />
        </AmenitiesHeader>
        <AmenitiesBody>
          <Button
            tw="ml-auto cursor-pointer mb-4 mr-[36.6px]"
            onClick={() => addInput()}
          >
            Add Input
          </Button>
          {amenitiesInputs.map((data: TAmenitiesInput) => (
            <div tw="flex items-center mb-2" key={data.key}>
              <div tw="w-full flex gap-4">
                <AmenitiesInput
                  tw="w-1/4"
                  placeholder="title"
                  value={data.title}
                  onChange={(e) => changeTitleValue(data.key, e.target.value)}
                />
                <AmenitiesInput
                  tw="w-3/4"
                  placeholder="split with comma"
                  value={data.value}
                  onChange={(e) => changeInputValue(data.key, e.target.value)}
                />
              </div>
              <div tw="flex ml-4 w-[92px] items-center">
                <IoMdCloseCircle
                  size={26}
                  tw="text-red-700 ml-1 mr-2 cursor-pointer"
                  onClick={() => removeInput(data.key)}
                />
              </div>
            </div>
          ))}
        </AmenitiesBody>
      </div>
    </AmenitiesModal>
  );
}

const AmenitiesModal = styled.div`
  ${tw`bg-slate-600 p-8 bg-opacity-60 absolute left-0 top-0 w-full h-full`} ${({
    show,
  }: {
    show: boolean;
  }) => (show ? tw`block` : tw`hidden`)}
`;
const AmenitiesHeader = tw.div`py-3 px-7 border-b flex justify-between items-center`;

const AmenitiesBody = tw.div`p-2`;
const Button = tw.button`rounded-md !bg-teal-600 text-white text-sm flex items-center font-semibold h-full  py-2 px-2`;
const AmenitiesInput = tw.input`col-span-4 py-2 px-2 rounded-md border border-gray-300 border-solid`;

export default PropertyAmenities;
