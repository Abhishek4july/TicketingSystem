import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const TicketFullViewAdmin = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [assignMessage1, setAssignMessage1] = useState("");
  const [supportStaffList, setSupportStaffList] = useState([]);
  const [priorityOptions,setPriorityOptions]=useState([])
  const [statusOptions,setStatusOptions]=useState([])
  
  const getFixedUrl = (url) => url?.startsWith("//") ? `https:${url}` : url;

const isImage = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

    useEffect(() => {
    const fetchPriorityOptions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tickets/priority`);
              console.log("Fetched priorities:", res.data); 
  
        setPriorityOptions(res.data.data);
      } catch (err) {
        console.error("Failed to fetch priorities:", err);
      }
    };
    const fetchStatusOptions = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tickets/statusOptions`);
                console.log("Fetched options:", res.data); 
    
          setStatusOptions(res.data.data);
        } catch (err) {
          console.error("Failed to fetch statusOptions:", err);
        }
      };
     fetchStatusOptions();
    fetchPriorityOptions();
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/${ticketId}`);
        setTicket(res.data.data);
        console.log("Ticket Data:", res);
         console.log("Ticket Data attachments:", res.data.data.attachments);

        setError("");
      } catch (error) {
        setError("Ticket not found or failed to fetch");
        setTicket(null);
      }
    };

    
    const fetchSupportstaff=async()=>{
      try {
        const res=await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/support-staff`,{
          withCredentials:true,
        })
              console.log("Support Staff List:", res.data.data);

        setSupportStaffList(res.data.data);
      } catch (error) {
        setError("Failed to fetch the support staffs",error)
        console.log("Failed to fetch support staffs")
      }
    }
    fetchSupportstaff()
    fetchTicket();
  }, [ticketId]);

  const handleAssign = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/${ticketId}/assign`, {
        assignedTo: selectedUser,
      });

      setTicket(res.data.data); 
      setAssignMessage("Ticket assigned successfully!");
    } catch (err) {
      setAssignMessage("Failed to assign ticket");
    }
  };

  if (error)
    return (
      <div className="text-red-500 text-center mt-10 text-lg font-medium">
        {error}
      </div>
    );

  if (!ticket)
    return (
      <div className="text-center text-white mt-10 text-4xl">
        Loading ticket details...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold text-cyan-400 mb-6 border-b border-gray-700 pb-3">
        Ticket Details
      </h2>

      <div className="sm:grid-cols-2 gap-x-8 gap-y-6 text-left">
        <Detail label="Subject" value={ticket.subject} />
        <Detail label="Priority" value={ticket.priority} />
        <Detail label="Status" value={ticket.status} />
        <Detail label="Tags" value={ticket.tags?.join(", ") || "-"} />
        <Detail label="Created By" value={ticket.createdBy?.FullName || "N/A"} />
        <Detail label="Assigned To" value={ticket.assignedTo?.FullName || "Not Assigned"} />
        <Detail
          label="Created At"
          value={dayjs(ticket.createdAt).format("DD MMM YYYY, hh:mm A")}
        />
      </div>

      <div className="mt-6 text-left">
        <Detail label="Description" value={ticket.description} fullWidth={true} />
      </div>


{ticket.attachments && ticket.attachments.length > 0 && (
  <div className="mt-6">
    <p className="text-sm text-gray-400 uppercase font-semibold tracking-wide mb-2">Attachments</p>
{ticket.attachments?.map((att, idx) => {
  const url = att.url;

  const isImg = isImage(url);
  const isVid = isVideo(url);
  const isPDF = /\.pdf$/i.test(url);
 const getFixedUrl = (url) => {
  if (!url) return "";

  // If it's already raw, return as-is
  if (/\/raw\/upload\//.test(url)) return url;

  // If it's a PDF and not raw yet
  if (/\.pdf$/i.test(url) && /\/upload\//.test(url)) {
    return url.replace("/upload/", "/raw/upload/");
  }

  return url;
};


const fixedUrl = getFixedUrl(url);

  const handleClick = () => {
    if (isImg) {
      setSelectedAttachment(url);
      setIsModalOpen(true);
    }
  };

return (
  <div key={idx} className="mb-4">
    {isImg ? (
      <img
        src={url}
        alt={`attachment-${idx}`}
        className="max-w-xs cursor-pointer rounded-lg border border-gray-600"
        onClick={handleClick}
      />
    ) : isVid ? (
      <video
        src={url}
        controls
        className="max-w-xs rounded-lg border border-gray-600"
      />
    ) : isPDF ? (
      <div>
       <a
  href={getFixedUrl(url)}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block px-4 py-2 bg-black rounded-2xl text-white hover:bg-cyan-700 transition"
>
  View PDF {idx + 1}
</a>


      </div>
    ) : (
    <a
  href={url.replace("/upload/", "/upload/fl_attachment/")}
  className="inline-block px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
>
  Download PDF {idx + 1}
</a>



    )}
  </div>
);

})}


  </div>
)}


      <div className="mt-10 bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
          User Contact Info
        </h3>
        <div className="text-gray-200 space-y-2">
          <div>
            <span className="font-semibold text-gray-300">Full Name:</span>{" "}
            {ticket.createdBy?.FullName || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-300">Email:</span>{" "}
            {ticket.createdBy?.email || "N/A"}
          </div>
        </div>
      </div>

      {/* 🔽 Assignment Section */}
      {!assignMessage&&
         <div className="mt-10 bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">
          Assign Ticket To User
        </h3>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 rounded-md text-cyan-300 text-xl"
        >
          <option className='text-black' value="">Select a user</option>
          {supportStaffList?.map((supportStaff) => (
            <option key={supportStaff._id} value={supportStaff._id} className="text-black">
              {supportStaff.FullName} ({supportStaff.email})
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          className="mt-3 px-6 py-2 bg-cyan-600 text-black rounded-lg hover:bg-cyan-700"
        >
          Assign
        </button>
        {assignMessage && (
          <p className="mt-3 text-sm text-green-400">{assignMessage}</p>
        )}
      </div>
      }

      {!assignMessage1&&
      <div className="mt-10 bg-gray-800 p-5 rounded-xl shadow-md">
  <h3 className="text-xl font-semibold text-cyan-400 mb-4">Update Status & Priority</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <select
  className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
  value={ticket.status}
  onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
>
  <option value="">Status</option>
  {statusOptions?.map((option, index) => (
    <option key={index} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ))}
</select>

        <select
  className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
  value={ticket.priority}
  onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
>
  <option value="">Priority</option>
  {priorityOptions?.map((option, index) => (
    <option key={index} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ))}
</select>

  </div>

  <button
    onClick={async () => {
      try {
        const res = await axios.put(`/api/v1/admin/tickets/${ticketId}/update`, {
          status: ticket.status,
          priority: ticket.priority,
        });
        setTicket(res.data.data);
        setAssignMessage1("Ticket updated successfully!");
      } catch (err) {
        setAssignMessage1("Failed to update ticket");
      }
    }}
    className="mt-3 px-6 py-2 bg-cyan-600 text-black rounded-lg hover:bg-cyan-700"
  >
    Update
  </button>

  {assignMessage1 && (
    <p className="mt-3 text-sm text-green-400">{assignMessage1}</p>
  )}
     </div>}


      <div className="mt-8 flex justify-between items-center">
        <Link
          to="/admin/tickets"
          className="text-blue-400 hover:underline text-base font-medium"
        >
          ← Back to Dashboard
        </Link>
        <Link
          to={`/admin/tickets/${ticketId}/comments`}
          className="text-blue-200 bg-blue-950 hover:bg-cyan-700 transition px-6 py-2 rounded-xl font-semibold shadow-md"
        >
          View Comments →
        </Link>
      </div>
    </div>
  );
};

const Detail = ({ label, value, fullWidth = false }) => (
  <div className={`${fullWidth ? "col-span-2" : ""}`}>
    <p className="text-sm text-gray-400 uppercase font-semibold tracking-wide mb-1">
      {label}
    </p>
    <p className="text-lg text-gray-100 font-medium">{value}</p>
  </div>
);

export default TicketFullViewAdmin;
