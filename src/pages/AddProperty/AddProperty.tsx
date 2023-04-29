import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";

import { v4 } from "uuid";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPropertyForm } from "../../helper/formSchema";
import { TPropertyForm } from "../../types/form";
import { toast } from "react-toastify";
import axiosInstance from "../../services/api";
import PropertyGallery from "../../components/Modals/PropertyGallery.modal";
import PropertyAmenities from "../../components/Modals/PropertyAmenities.modal";
import { TAmenitiesInput, TGalleryInput } from "../../types/modals";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import { TAgent } from "../../types/user";
import ReactSelect from "react-select";

function AddProperty() {
  const [galleryModalToggle, setGalleryModalToggle] = useState<boolean>(false);
  const [galleryInputs, setGalleryInputs] = useState<TGalleryInput[]>([]);
  const [amenitiesModalToggle, setAmenitiesModalToggle] =
    useState<boolean>(false);
  const [amenitiesInputs, setAmenitiesInputs] = useState<TAmenitiesInput[]>([]);
  const [agents, setAgents] = useState<[] | null>(null);
  const loggedUserRole = useSelector(
    (state: RootState) => state.userSlice.role
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    getValues,
    setValue,
    reset,
  } = useForm<TPropertyForm>({
    resolver: zodResolver(createPropertyForm),
  });

  console.log(getValues());

  useEffect(() => {
    const getAgents = async () => {
      if (loggedUserRole === "agent") {
        setValue("agent", "");
        return false;
      }
      const { data } = await axiosInstance.get("agent");
      setAgents(data.agents);
    };
    getAgents();

    setGalleryInputs([{ key: v4(), value: "", isValid: false }]);
    setAmenitiesInputs([{ key: v4(), title: "", value: "" }]);
  }, []);

  const isGalleryOK = () => {
    const find = galleryInputs.findIndex(
      (input: TGalleryInput) => input.isValid === false
    );
    if (find !== -1) return false;
    return true;
  };

  const isAmenityOK = () => {
    const find = amenitiesInputs.findIndex(
      (input: TAmenitiesInput) => input.title === "" || input.value === ""
    );
    if (find !== -1) return false;
    return true;
  };

  const createSubmitBody = () => {
    const data = getValues();
    return {
      address: data.address,
      furnished: Boolean(data.furnished),
      exclusivity: data.exclusivity.split(","),
      price: data.price,
      offPercent: data.offPercent,
      about: data.about,
      agent: data.agent,
      location: { lat: data.map.split(",")[0], long: data.map.split(",")[1] },
      amenities: amenitiesInputs.map((input: TAmenitiesInput) => {
        return {
          amenityTitle: input.title,
          amenity: input.value,
        };
      }),
      gallery: galleryInputs.map((input: TGalleryInput) => {
        return { url: input.value };
      }),
    };
  };

  const submitHandler = async () => {
    try {
      if (!isGalleryOK()) throw Error("Look at gallery!");
      if (!isAmenityOK()) throw Error("Look at amenity!");
      setIsLoading(true);
      const { data } = await axiosInstance.post("property", createSubmitBody());
      setIsLoading(false);
      toast.success(data.message);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message, {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <div>
        <form
          tw="grid-cols-12 gap-4 grid"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Input placeholder="address" {...register("address")} />
          <Select
            defaultValue=""
            tw="col-span-4 border border-gray-300"
            {...register("furnished")}
          >
            <Option value="" disabled hidden>
              is furnished
            </Option>
            <Option value="true">Yes</Option>
            <Option value="false">No</Option>
          </Select>
          <Select
            defaultValue=""
            tw="col-span-4 border border-gray-300"
            {...register("status")}
            required
          >
            <Option value="" disabled hidden>
              Status
            </Option>
            <Option value="rent">For Rent</Option>
            <Option value="buy">For Buy</Option>
          </Select>
          {loggedUserRole && loggedUserRole !== "agent" && (
            <ReactSelect
              tw="col-span-4 h-full hover:border-none"
              isSearchable={false}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: "100%",
                  border: "1px solid rgb(209 213 219)",
                  boxShadow: state.isFocused ? "none" : "none",
                  outline: "none",
                  "&:hover": { border: "1px solid rgb(209 213 219)" },
                }),
              }}
              placeholder="Select Agent..."
              options={agents?.map((agent: TAgent) => {
                return {
                  label: agent.name,
                  value: agent._id,
                  cover: agent.cover,
                };
              })}
              onChange={(e) => setValue("agent", e.value)}
              formatOptionLabel={(agent: any) => (
                <div tw="flex items-center">
                  <img
                    src={agent.cover}
                    alt="country-image"
                    tw="h-9 w-9 rounded-full mr-3"
                  />
                  <span>{agent.label}</span>
                </div>
              )}
            />
          )}

          <Input
            placeholder="exclusivity (split with comma)"
            {...register("exclusivity")}
          />
          <Input placeholder="price" {...register("price")} />
          <Input
            type="number"
            min={0}
            max={100}
            defaultValue={0}
            placeholder="off percent (leave it if you don't need it)"
            {...register("offPercent", { valueAsNumber: true })}
          />
          <Input placeholder="about" {...register("about")} />
          <Input
            placeholder="lat and long (split with comma)"
            {...register("map")}
          />
          <Button
            type="button"
            tw="col-span-4 !bg-blue-800 justify-center py-2.5"
            onClick={() => setAmenitiesModalToggle(true)}
          >
            Amenities
          </Button>
          <Button
            type="button"
            tw="col-span-4 !bg-purple-800 justify-center py-2.5"
            onClick={() => setGalleryModalToggle(true)}
          >
            Gallery
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            tw="col-span-12 w-40 mt-6 h-fit justify-self-end justify-center disabled:opacity-75"
          >
            Add
          </Button>
        </form>
      </div>
      <PropertyGallery
        toggle={{ galleryModalToggle, setGalleryModalToggle }}
        inputs={{ galleryInputs, setGalleryInputs }}
      />
      <PropertyAmenities
        toggle={{ amenitiesModalToggle, setAmenitiesModalToggle }}
        inputs={{ amenitiesInputs, setAmenitiesInputs }}
      />
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8 relative`;

const Input = tw.input`col-span-4 py-2 px-2 rounded-md border border-gray-300 border-solid`;

const Select = tw.select`col-span-4 py-2 px-2 rounded-md outline-none`;
const Option = tw.option`text-lg px-1`;
const Button = tw.button`rounded-md !bg-teal-600 text-white text-sm flex items-center font-semibold h-full  py-2 px-2`;

export default AddProperty;
