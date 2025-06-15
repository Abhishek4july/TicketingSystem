import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import Spinner from './Spinner';

const TicketFullViewUser = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/tickets/${ticketId}`, { withCredentials: true })
        setTicket(res.data.data);
        setError("");
      } catch (error) {
        setError("Unable to get ticket details")
        setTicket(null);
      }
    }
    fetchTicket();
  }, [ticketId])

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!ticket) return (
    <div className="mt-20">
      <Spinner />
    </div>
  );

  const isImage = (url) => /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url);
  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-gray-800 to-gray-900 text-left text-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Ticket Details</h2>

      <div className=" sm:grid-cols-2 gap-x-8 gap-y-6">
        <Detail label="Subject" value={ticket.subject} />
        <Detail label="Priority" value={ticket.priority} />
        <Detail label="Status" value={ticket.status} />
        <Detail label="Tags" value={ticket.tags?.join(", ") || "-"} />
        <Detail label="Created At" value={dayjs(ticket.createdAt).format("DD MMM YYYY, hh:mm A")} />
        <Detail
          label="Assigned To"
          value={
            ticket.assignedTo
              ? `${ticket.assignedTo.FullName} (${ticket.assignedTo.email})`
              : "Not Assigned"
          }
        />
      </div>

      <div className="mt-6">
        <Detail label="Description" value={ticket.description} fullWidth />
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



      {isModalOpen && selectedAttachment && (isImage(selectedAttachment) || isVideo(selectedAttachment)) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full">
            <span
              className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            {isImage(selectedAttachment) ? (
              <img src={selectedAttachment} alt="fullscreen" className="max-h-[80vh] rounded-lg" />
            ) : isVideo(selectedAttachment) ? (
              <video src={selectedAttachment} controls className="max-h-[80vh] rounded-lg" />
            ) : null}
          </div>
        </div>
      )}


      <div className="mt-8 text-right">
        <Link to="/user/dashboard" className="text-blue-400 hover:underline font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

const Detail = ({ label, value, fullWidth = false }) => (
  <div className={`${fullWidth ? "col-span-2" : ""}`}>
    <p className="text-sm text-gray-400 uppercase font-semibold tracking-wide mb-1">{label}</p>
    <p className="text-lg text-gray-100 font-medium">{value}</p>
  </div>
);

export default TicketFullViewUser;
