import { PropertyViewModel } from "../models/InsightsModel.js";
import PropertyModel from "../models/PropertyModel.js";
import TourRequestModel from "../models/TourRequestModel.js";
import AgentModel from "../models/AgentModel.js";

export const getInitialData = async (req, res) => {
  const { role } = req;
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    const getViews = await PropertyViewModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $subtract: [
              { $subtract: ["$createdAt", new Date("1970-01-01")] },
              {
                $mod: [
                  { $subtract: ["$createdAt", new Date("1970-01-01")] },
                  1000 * 60 * 60 * 24,
                ],
              },
            ],
          },
          count: { $sum: "$count" },
        },
      },
    ]);

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const viewsByDay = getViews.reduce(
      (acc, view) => {
        const date = new Date(view._id);
        const dayName = dayNames[date.getDay()];
        const existingDay = acc.find((item) => item._id === dayName);

        if (existingDay) {
          existingDay.count += view.count;
        } else {
          acc.push({ _id: dayName, count: view.count });
        }

        return acc;
      },
      dayNames.map((day) => ({ _id: day, count: 0 }))
    );

    const getLatestProducts = await PropertyModel.find({})
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("agent");
    const mostPropertyTourRequest = await TourRequestModel.aggregate([
      {
        $group: {
          _id: "$property",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: PropertyModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: "$property",
      },
      {
        $lookup: {
          from: AgentModel.collection.name,
          localField: "property.agent",
          foreignField: "_id",
          as: "property.agent",
        },
      },
      {
        $unwind: "$property.agent",
      },
      {
        $project: {
          property: 1,
          count: 1,
        },
      },
    ]);
    const topAgent = await PropertyModel.aggregate([
      {
        $group: {
          _id: "$agent",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: AgentModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
    ]);
    const topProperties = await PropertyViewModel.aggregate([
      {
        $group: {
          _id: "$property",
          totalCount: { $sum: "$count" },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
      {
        $lookup: {
          from: PropertyModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: "$property",
      },
    ]);
    console.log(topProperties);
    return res.status(200).json({
      error: false,
      viewsCountPerDay: viewsByDay,
      latestProperty: getLatestProducts,
      mostTourRequest: mostPropertyTourRequest,
      topAgent,
      topProperties,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
