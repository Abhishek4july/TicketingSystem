import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

function TicketCommentsUser() {
  const { ticketId } = useParams();
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [ticketStatusLoading, setTicketStatusLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/tickets/${ticketId}/comments`, {
        withCredentials: true,
      });
      setComments(res.data.data);
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setCommentsLoading(false); 
    }
  };

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/tickets/${ticketId}`, {
        withCredentials: true,
      });
      setTicketStatus(res.data.data.status);
      console.log(res.data.data.status);
    } catch (err) {
      setError('Failed to fetch ticket details');
    } finally {
      setTicketStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchTicket();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !file) {
      setError('You must provide either text or an attachment');
      return;
    }

    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('attachments', file);

    setLoading(true);
    setError('');
    setSubmitMessage('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/tickets/${ticketId}/comments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setContent('');
      setFile(null);
      setSubmitMessage('Comment posted successfully');
      fetchComments();
    } catch (err) {
      setError(err.response?.data.message || 'Failed to submit comment');
    } finally {
      setLoading(false);
    }
  };

  const isCommentingAllowed = ticketStatus === 'open' || ticketStatus === 'in-progress';

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Ticket Comments</h2>

      {/* Comments List */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-md space-y-6">
        {commentsLoading ? (
          <div className="text-gray-400 text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-700 pb-4">
              <div className="text-sm text-gray-400 mb-1">
                <span className="font-semibold text-white">
                  {comment.authorId?.FullName || 'Unknown'}:
                </span>{' '}
                {dayjs(comment.createdAt).format('DD MMM YYYY, hh:mm A')}
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
      {!ticketStatusLoading ? (
        isCommentingAllowed ? (
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
              placeholder="Choose a file"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {submitMessage && <p className="text-green-500 text-sm">{submitMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 px-4 text-white md:text-black sm:bg-black sm:text-white py-2 rounded hover:bg-cyan-700 transition font-semibold"
            >
              {loading ? 'Submitting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="text-red-500 mt-4">You cannot comment on this ticket as it's either resolved or closed.</p>
        )
      ) : (
        <p className="text-gray-400 text-3xl mt-4">Loading ticket status...</p>
      )}

      <div className="mt-6">
        <Link to={`/user/tickets/${ticketId}`} className="text-blue-400 hover:underline">
          ← Back to Ticket
        </Link>
      </div>
    </div>
  );
}

export default TicketCommentsUser;
