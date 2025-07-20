"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
// Update the import path below if your types file is located elsewhere, e.g. '../../types' or 'types'
import { Video } from '@/types'
function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error(" Unexpected response format");

            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = useCallback((url: string, title: string) => {
        () => {
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title}.mp4`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }

    }, [])

    if(loading){
        return <div>Loading...</div>
    }

    return (
  <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white transition-colors duration-300">
    <h1 className="text-3xl font-bold mb-6 text-center text-white">📼 Videos</h1>

    {videos.length === 0 ? (
      <div className="text-center text-lg text-gray-400">
        No videos available
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={{
              ...video,
              originalSize: String(video.originalSize),
              compressedSize: String(video.compressedSize),
            }}
            onDownload={handleDownload}
          />
        ))}
      </div>
    )}
  </div>
);
}

export default Home