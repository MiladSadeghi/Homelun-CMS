import React from "react";
import {
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import tw from "twin.macro";
import axiosInstance from "../../services/api";
import { TProperty } from "../../types/property";
import { TAgent } from "../../types/user";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";

type TDashboardData = {
  viewsCountPerDay: {
    _id: string;
    count: number;
  }[];
  latestProperty: TProperty[];
  mostTourRequest: {
    _id: string;
    count: number;
    property: TProperty;
  }[];
  topAgent: {
    _id: string;
    count: number;
    agent: TAgent;
  }[];
  topProperties: {
    _id: string;
    totalCount: number;
    property: TProperty;
  }[];
};

function Dashboard() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dashboardData, setDashboardData] =
    React.useState<TDashboardData | null>();
  const isAgent = useSelector(
    (state: RootState) => state.userSlice.role === "agent"
  );

  React.useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/dashboard/views")
      .then((response) => setDashboardData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <>Loading...</>;
  console.log(dashboardData);
  return (
    <Wrapper>
      <div className="col-span-8 row-span-3 bg-white rounded-lg py-4 pr-10 flex flex-col">
        <h5 className="font-bold text-xl mb-2 px-4">Views</h5>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              dashboardData?.viewsCountPerDay as TDashboardData["viewsCountPerDay"]
            }
          >
            <XAxis dataKey="_id" />
            <YAxis tickCount={5} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="rgb(88 28 135)"
              fill="rgba(88,28 ,135, 50%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-4 row-span-3 bg-white rounded-lg p-4">
        <h5 className="font-bold text-xl mb-2">Latest Property</h5>
        <div className="overflow-y-scroll h-[90%]">
          {dashboardData?.latestProperty.length !== 0 ? (
            dashboardData?.latestProperty.map((property: TProperty) => (
              <div className="flex mb-6" key={property._id}>
                <img src={property.gallery[0].url} className="w-24" />
                <div className="flex flex-col justify-around ml-3">
                  <h4 className="text-sm font-semibold">{property.address}</h4>
                  {!isAgent && (
                    <div className="flex items-center">
                      <img
                        className="w-8 rounded-full mr-2"
                        src={property.agent.cover}
                      />
                      <h5 className="">{property.agent.name}</h5>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h5 className="font-bold text-gray-400">Cant Find Any Property!</h5>
          )}
        </div>
      </div>
      <div className="bg-white p-4 col-span-4 row-span-2 rounded-lg last:mb-0 overflow-y-auto">
        <h5 className="font-bold text-xl mb-2">Most Tour Request Property</h5>

        {dashboardData?.mostTourRequest.length !== 0 ? (
          dashboardData?.mostTourRequest.map((tourRequest: any) => (
            <div className="flex mb-6 items-center " key={tourRequest._id}>
              <img src={tourRequest.property.gallery[0].url} className="w-24" />
              <div className="flex flex-col justify-around ml-2">
                <h4 className="text-sm font-semibold mb-2">
                  {tourRequest.property.address}
                </h4>
                {!isAgent && (
                  <div className="flex items-center">
                    <img
                      className="w-8 rounded-full mr-2"
                      src={tourRequest.property.agent.cover}
                    />
                    <h5>{tourRequest.property.agent.name}</h5>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <h5 className="font-bold text-gray-400 text-center mt-7">
            {isAgent
              ? "You Don't Have Any Tour Request"
              : "Cant Find Any Tour Request"}
          </h5>
        )}
      </div>
      {!isAgent && (
        <div className="bg-white p-4 col-span-4 row-span-2 rounded-lg last:mb-0">
          <h5 className="font-bold text-xl mb-4">Top Agents</h5>
          {dashboardData?.topAgent.length !== 0 ? (
            <div className="overflow-y-auto h-[90%]">
              {dashboardData?.topAgent.map((agent: any) => (
                <div className="flex mb-2 items-center" key={agent._id}>
                  <img className="h-16 rounded-full " src={agent.agent.cover} />
                  <h4 className="ml-4 font-semibold text-base ">
                    {agent.agent.name}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <h5 className="font-bold text-gray-400 text-center mt-7">
              Top Agents are died
            </h5>
          )}
        </div>
      )}
      <div className="bg-white p-4 col-span-4 row-span-2 rounded-lg last:mb-0">
        <h5 className="font-bold text-xl mb-2">Top Properties</h5>
        {dashboardData?.topProperties.length !== 0 ? (
          dashboardData?.topProperties.map((property: any) => (
            <div className="overflow-y-auto h-[90%]">
              <div className="flex mb-6" key={property._id}>
                <img src={property.property.gallery[0].url} className="w-24" />
                <div className="flex flex-col justify-around ml-3">
                  <h4 className="text-base font-semibold">
                    {property.property.address}
                  </h4>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h5 className="font-bold text-gray-400 text-center mt-7">
            {isAgent
              ? "Sorry! Can't Find Your Top Properties"
              : "Cant Find Top Properties"}
          </h5>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`col-span-10 grid grid-cols-12 grid-rows-5 bg-[#F4F7FE] h-screen relative overflow-y-auto p-8 gap-4`;

export default Dashboard;
