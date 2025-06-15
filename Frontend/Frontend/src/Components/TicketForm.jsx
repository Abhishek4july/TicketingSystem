import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function TicketForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const isMobileOrTablet = window.innerWidth <= 1024;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [priorityOptions, setPriorityOptions] = useState([]);


  useEffect(() => {
    const fetchPriorityOptions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tickets/priority`,{withCredentials:true});
        console.log("Fetched priorities:", res.data);

        setPriorityOptions(res.data.data);
      } catch (err) {
        console.error("Failed to fetch priorities:", err);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/getUser`, {
          withCredentials: true,
        });

        console.log("User data fetched:", res.data);

        const role = res.data.data?.role;
        console.log("Fetched user role (direct):", role);
        setUserRole(role);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsRoleLoading(false);
      }
    };
    fetchPriorityOptions()
    fetchUser();
  }, []);


  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("description", data.description);
    formData.append("priority", data.priority.toLowerCase());


    if (data.tags) {
      data.tags
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => {
          formData.append("tags", tag);
        });
    }

    console.log("Sending files:", selectedFiles);
    selectedFiles.forEach(file => console.log(file.name));

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('attachments', selectedFiles[i]);
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/submitTicket`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("userRole at submission:", userRole);

      setSelectedFiles([]);
      if (userRole == 'user')
        navigate("/user/dashboard");
      else if (userRole == 'admin')
        navigate('/admin/tickets')
    } catch (err) {
      console.error("Error in submitTicket:", err);
  console.log("Response:", err?.response?.data);  
  setError("Error while submitting the ticket");
      setError("Error while submitting the ticket");
    } finally {
      setLoading(false);
    }
    reset();
  };


  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };


  // return isRoleLoading ? (
  //   <div>Loading user info...</div>
  // ) : (
  //   <div>
  //     {/* your full form JSX */}
  //   </div>
  // );

  // if (isRoleLoading) {
  //   return (
  //     <div className="text-center mt-10 text-white text-6xl">
  //       Loading user details...
  //     </div>
  //   );
  // }


  return (
    <div>
      <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-10 border-2 border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create a Ticket
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <Input
              label="Subject"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Description"
              type="textarea"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="w-full mb-4">
            <label className="inline-block mb-1 pl-1 text-white">Priority</label>
            <select
              {...register("priority", { required: "Priority is required" })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white outline-none focus:bg-gray-600 duration-200 border border-gray-600"
            >
              <option value="">Priority</option>
              {priorityOptions?.map((option, index) => (
                <option key={index} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <Input label="Tags (comma separated)" {...register("tags")} />
            {errors.tags && (
              <p className="text-red-500 text-sm">{errors.tags.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">
              Attach Files
            </label>
            {isMobileOrTablet && (
              <button
                type="button"
                onClick={() => document.getElementById("cameraInput").click()}
                className="mb-2 text-blue-300 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Open Camera
              </button>
            )}

            <input
              id="cameraInput"
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              capture="environment"
              onChange={handleFileChange}
              className={`w-full p-3 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobileOrTablet ? "block" : ""
                }`}
            />



            {selectedFiles.length > 0 && (
              <ul className="mt-2 text-white text-sm">
                {selectedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black"
            disabled={loading || isRoleLoading}
          >
            {loading
              ? "Submitting..."
              : isRoleLoading
                ? "Loading user info..."
                : "Submit Ticket"}
          </Button>

        </form>
      </div>

      <div className="mx-auto mt-4 w-fit">
        <Link
          to={userRole === "user" ? "/user/dashboard" : "/admin/tickets"}
          className="text-blue-400 hover:underline text-base font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>


    </div>
  );
}
