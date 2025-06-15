import { Ticket } from "../models/ticket.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTicketAnalytics=asyncHandler(async(req,res)=>{

    const openCount=await Ticket.countDocuments({status:"open"});
    const closedCount=await Ticket.countDocuments({status:"closed"});



    const priorityAgg=await Ticket.aggregate([
        {$group:{_id:"$priority",count:{$sum:1}}},
    ]);
    const ticketsByPriority={};
    priorityAgg.forEach(item=>{
        ticketsByPriority[item._id]=item.count;
    });



    const tagsAgg=await Ticket.aggregate([
        {$unwind:"$tags"},
        {$group:{_id:"$tags",count:{$sum:1}}}
    ])


    const ticketsByTag={};
    tagsAgg.forEach(item=>{
        ticketsByTag[item._id]=item.count;
    });


    const resolutionAgg = await Ticket.aggregate([
      { $match: { status: "closed", closedAt: { $exists: true } } },
      {
        $project: {
          resolutionHours: {
            $divide: [{ $subtract: ["$closedAt", "$createdAt"] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResolutionTimeHours: { $avg: "$resolutionHours" },
        },
      },
    ]);


    const avgResolutionTimeHours=resolutionAgg[0]?.avgResolutionTimeHours||0;

    const ticketsPerDay=await Ticket.aggregate([
      {

        $group:{
          _id:{
            $dateToString:{format:"%Y-%m-%d",date:"$createdAt"},
          },
          count:{$sum:1},
        },
    },
    {$sort:{_id:1}},
  ]);

    res.status(200).json(
        new ApiResponse(200,{
            openVsClosed: { open: openCount, closed: closedCount },
          ticketsByPriority,
          ticketsByTag,
          avgResolutionTimeHours: parseFloat(avgResolutionTimeHours.toFixed(2)),
          ticketsPerDay
      },"Data fetched successfully")
    )
})


export default getTicketAnalytics