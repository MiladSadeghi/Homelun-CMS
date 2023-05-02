import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";
import axiosInstance from "../../services/api";
import { toast } from "react-toastify";
import { TProperty } from "../../types/property";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../feature/store";
import {
  publishProperty,
  setProperties,
  unPublishProperty,
} from "../../feature/lists/propertyListSlice";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Properties() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const properties = useSelector(
    (state: RootState) => state.propertiesListSlice.properties
  );
  const dispatch: AppDispatch = useDispatch();
  const isAgent: boolean =
    useSelector((state: RootState) => state.userSlice.role) === "agent";
  const [selectedProperty, setSelectedProperty] = useState<TProperty | null>();
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.getAll("search"));
  const [search, setSearch] = useState<string>(urlParams.get("search") || "");
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchProperty, setSearchProperty] = useState<TProperty[]>();
  const [isStatusLoading, isSetStatusLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProperties = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("property");
        dispatch(setProperties(data.properties));
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    };
    getProperties();
  }, []);

  useEffect(() => {
    if (search !== "") {
      setIsSearching(true);
      urlParams.set("search", search);
      navigate(`?${urlParams.toString()}`, { replace: true });
      const searchResult = properties.filter((property: TProperty) =>
        property.address.toLowerCase()?.includes(search)
      );
      setSelectedProperty(null);
      setSearchProperty(searchResult);
    } else {
      setIsSearching(false);
      urlParams.delete("search");
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
  }, [search, navigate]);

  const publishAgent = async () => {
    try {
      isSetStatusLoading(true);
      await axiosInstance.post("/property/publish", {
        propertyId: selectedProperty?._id!,
        status: true,
      });

      dispatch(publishProperty(selectedProperty?._id!));
      setSelectedProperty((prevState: any) => {
        return { ...prevState, publish: true };
      });
      updateSearchedProperty(true);
      isSetStatusLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      isSetStatusLoading(false);
    }
  };
  const unPublishAgent = async () => {
    try {
      isSetStatusLoading(true);
      await axiosInstance.post("/property/publish", {
        propertyId: selectedProperty?._id!,
        status: false,
      });
      dispatch(unPublishProperty(selectedProperty?._id!));
      setSelectedProperty((prevState: any) => {
        return { ...prevState, publish: false };
      });
      isSetStatusLoading(false);
      updateSearchedProperty(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      isSetStatusLoading(false);
    }
  };

  const updateSearchedProperty = async (value: boolean) => {
    if (isSearching) {
      setSearchProperty((prevProperty: any) => {
        const selectedPropertyIndex = prevProperty.findIndex(
          (property: TProperty) => property._id === selectedProperty?._id
        );
        const updatedUser = {
          ...prevProperty[selectedPropertyIndex],
          publish: value,
        };
        return [
          ...prevProperty.slice(0, selectedPropertyIndex),
          updatedUser,
          ...prevProperty.slice(selectedPropertyIndex + 1),
        ];
      });
    }
  };

  return (
    <Wrapper>
      <nav tw="grid-cols-12 gap-4 grid bg-white py-4 px-8">
        <Link
          to="/properties/add"
          tw="py-2 px-3 rounded-xl bg-cyan-600 text-white text-sm flex items-center font-semibold col-span-1 w-fit"
        >
          ADD NEW
          <BiPlus size={18} tw="ml-1" />
        </Link>
        <input
          tw="h-full rounded-lg w-full col-span-9 drop-shadow-lg bg-purple-800 text-white px-3"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        {selectedProperty && (
          <Button
            onClick={selectedProperty.publish ? unPublishAgent : publishAgent}
            disabled={isStatusLoading}
            isPublish={selectedProperty.publish}
          >
            {!selectedProperty.publish ? "Publish?" : "Un publish?"}
          </Button>
        )}
      </nav>
      <div tw="p-8">
        {isLoading ? (
          <h1 tw="w-full">Please Wait...</h1>
        ) : properties || searchProperty ? (
          <div tw="w-full">
            <table tw="w-full">
              <Thead>
                <Tr>
                  {!isAgent && <Th></Th>}
                  <Th>Property ID</Th>
                  <Th>Address</Th>
                  {!isAgent && <Th>Agent</Th>}
                  <Th>Created Date</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <tbody>
                {(properties![0] || searchProperty!) &&
                  (isSearching ? searchProperty : properties)?.map(
                    (property: TProperty) => (
                      <Tr key={property._id}>
                        {!isAgent && (
                          <Td>
                            <input
                              type="checkbox"
                              name="select-property"
                              checked={selectedProperty?._id === property?._id}
                              onChange={() => setSelectedProperty(property)}
                              tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 align-middle mx-auto"
                            />
                          </Td>
                        )}
                        <Td tw="font-bold">{property._id}</Td>
                        <Td>{property.address}</Td>
                        {!isAgent ? (
                          property.agent ? (
                            <Td tw="flex items-center">
                              <img
                                width={64}
                                height={64}
                                src={property?.agent?.cover}
                                alt={property.agent.name}
                                tw="rounded-full mr-3"
                              />
                              {property.agent.name}
                            </Td>
                          ) : (
                            <Td>null</Td>
                          )
                        ) : (
                          ""
                        )}
                        <Td>
                          {new Date(property.createdAt).toLocaleString(
                            "en-US",
                            {
                              timeZone:
                                Intl.DateTimeFormat().resolvedOptions()
                                  .timeZone,
                            }
                          )}
                        </Td>
                        <Td>
                          {property.publish ? (
                            <Badge tw="border-green-800 bg-green-600 text-green-800 bg-opacity-20">
                              Publish
                            </Badge>
                          ) : (
                            <Badge tw="border-yellow-600 bg-yellow-300 bg-opacity-20 text-yellow-600">
                              Unpublished
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          <Edit to={`/properties/${property._id}`}>
                            Edit <HiArrowRight tw="ml-2" />
                          </Edit>
                        </Td>
                      </Tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        ) : (
          <h1>Please Add Data First</h1>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen `;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Tr = tw.tr`border-[#F4F7FE] border-[5px] border-solid`;
const Td = tw.td`py-2 px-1 bg-white first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;

const Badge = tw.span`border border-solid rounded-lg  px-2 py-[2px] text-xs font-bold`;
const Edit = tw(
  Link
)` py-2 px-4 bg-blue-200 border border-solid border-blue-700 text-blue-700 text-sm font-bold rounded-xl flex items-center justify-center`;
const Button = styled.button`
  ${tw`py-2 px-3 rounded-xl  text-white text-sm flex items-center font-semibold col-span-2 disabled:opacity-60`} ${({
    isPublish,
  }: {
    isPublish: boolean;
  }) => (isPublish ? tw`bg-yellow-600` : tw`bg-green-700`)}
`;

export default Properties;
