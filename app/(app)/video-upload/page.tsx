"use client"
import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function VideoUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    const router = useRouter()
    //max file size of 60 mb

    const MAX_FILE_SIZE = 70 * 1024 * 1024

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        // Show notification for file size too large
        window.alert("File size too large. Maximum allowed is 70MB.");
        return;
      }

      setIsUploading(true)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("originalSize", file.size.toString());

      try {
        const response = await axios.post("/api/video-upload", formData)
        // Check for 200 response
        if (response.status === 200) {
          router.push("/")
        } else {
          window.alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.log(error)
        // Notification for failure
        window.alert("An error occurred during upload. Please try again.");
      } finally{
        setIsUploading(false)
      }
    }


    return (
  <div className="bg-[#1E1E2F] text-white min-h-screen py-10 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-10">📹 Upload Video</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#2A2A40] p-6 rounded-2xl shadow-lg border border-[#3A3A5C] space-y-6"
      >
        {/* Title Input */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1E1E2F] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1E1E2F] border border-gray-600 text-white resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full p-2 rounded-lg bg-[#1E1E2F] border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4C84FF] file:text-white hover:file:bg-[#3a6cd9]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default VideoUpload