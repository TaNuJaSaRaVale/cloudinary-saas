import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from 'dayjs';
import realtiveTime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
import { Video } from '@prisma/client';


dayjs.extend(realtiveTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

const  VideoCard: React.FC<VideoCardProps> = ({video, onDownload}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,

        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]

        })
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }, []);

      const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
      );

      useEffect(() => {
        setPreviewError(false);
      }, [isHovered]);

      const handlePreviewError = () => {
        setPreviewError(true);
      };

      return (
  <div
    className="bg-[#2A2A40] rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-[#3A3A5C] overflow-hidden"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Video / Thumbnail Section */}
    <figure className="aspect-video relative">
      {isHovered ? (
        previewError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-400">
            <p>Preview not available</p>
          </div>
        ) : (
          <video
            src={getPreviewVideoUrl(video.publicId)}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            onError={handlePreviewError}
          />
        )
      ) : (
        <img
          src={getThumbnailUrl(video.publicId)}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Duration Overlay */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-3 py-1 rounded-lg text-sm text-white flex items-center">
        <Clock size={16} className="mr-1" />
        {formatDuration(video.duration)}
      </div>
    </figure>

    {/* Card Body */}
    <div className="p-4">
      <h2 className="text-lg font-semibold text-white">{video.title}</h2>
      <p className="text-sm text-gray-400 mt-1">{video.description}</p>
      <p className="text-sm text-gray-500 mt-1">
        Uploaded {dayjs(video.createdAt).fromNow()}
      </p>

      {/* File Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
        <div className="flex items-center">
          <FileUp size={18} className="mr-2 text-blue-400" />
          <div>
            <div className="font-semibold text-white">Original</div>
            <div className="text-gray-400">{formatSize(Number(video.originalSize))}</div>
          </div>
        </div>
        <div className="flex items-center">
          <FileDown size={18} className="mr-2 text-green-400" />
          <div>
            <div className="font-semibold text-white">Compressed</div>
            <div className="text-gray-400">{formatSize(Number(video.compressedSize))}</div>
          </div>
        </div>
      </div>

      {/* Footer: Compression + Download */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm font-semibold text-white">
          Compression:{" "}
          <span className="text-purple-400">{compressionPercentage}%</span>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-all"
          onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  </div>
);
}

export default VideoCard