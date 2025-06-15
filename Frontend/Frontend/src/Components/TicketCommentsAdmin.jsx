import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'

function TicketCommentsAdmin() {
    const {ticketId}=useParams();
    const [comments,setComments]=useState([])
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [content,setContent]=useState("")
    const [file,setFile]=useState(null)
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false)
    const [submitMessage,setSubmitMessage]=useState("");

    const fetchComments=async()=>{
        try {
            setCommentsLoading(true);
            const res=await axios.get(`/api/v1/admin/tickets/${ticketId}/comments`, {
                withCredentials: true,
            })
            setComments(res.data.data);
        } catch (error) {
            setError("Failed to fetch comments")
        } finally {
            setCommentsLoading(false); 
        }
    }

    useEffect(()=>{
        fetchComments();
    },[ticketId])

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!content&&!file){
            setError("You must provide either text or an attachment")
            return;
        }

        const formData=new FormData();
        if(content)
            formData.append("content",content);
        if(file)
            formData.append("attachments",file);

        setLoading(true);
        setError("")
        setSubmitMessage("");

        try {
            const res=await axios.post(`/api/v1/admin/tickets/${ticketId}/comments`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
                withCredentials: true, 
            })
            setContent("");
            setSubmitMessage("");
            setComments([]);
            setFile(null)
            fetchComments()
        } catch (error) {
            setError(error.response?.data.message||"Failed to submit commment")
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Ticket Comments</h2>

      {/* Comments List */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-md space-y-6">
        {commentsLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-700 pb-4">
              <div className="text-sm text-gray-400 mb-1">
                <span className="font-semibold text-white">
                  {comment.authorId?.FullName || "Unknown"}:
                </span>{" "}
                {dayjs(comment.createdAt).format("DD MMM YYYY, hh:mm A")}
              </div>
              <div className="text-base">{comment.content}</div>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2">
                  {comment.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline text-sm block"
                    >
                      📎 {file.fileName}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 shadow-lg space-y-4">
        <textarea
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white resize-none"
          rows="4"
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          accept="*/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-sm file-input-bordered bg-gray-800 text-white"
          placeholder="Choose a file to upload"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {submitMessage && <p className="text-green-500 text-sm">{submitMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-950 text-black px-4 py-2 rounded hover:bg-cyan-700 transition font-semibold"
        >
          {loading ? "Submitting..." : "Post Comment"}
        </button>
      </form>

      <div className="mt-6">
        <Link to={`/admin/tickets/${ticketId}`} className="text-blue-400 hover:underline">
          ← Back to Ticket
        </Link>
      </div>
    </div>
  )
}

export default TicketCommentsAdmin
