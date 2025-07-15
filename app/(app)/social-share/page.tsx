"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  };

  type SocialFormat = keyof typeof socialFormats;

  export default function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        if(uploadedImage){
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData
            })

            if(!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setUploadedImage(data.publicId);


        } catch (error) {
            console.log(error)
            alert("Failed to upload image");
        } finally{
            setIsUploading(false);
        }
    };

    const handleDownload = () => {
        if(!imageRef.current) return;

        fetch(imageRef.current.src)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        })
    }


    return (
  <div className="bg-[#1E1E2F] text-white min-h-screen py-10 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Social Media Image Creator
      </h1>

      <div className="bg-[#2A2A40] p-6 rounded-2xl shadow-lg border border-[#3A3A5C]">
        <h2 className="text-2xl font-medium mb-6">📤 Upload an Image</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-300">
            Choose an image file
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 rounded-lg bg-[#1E1E2F] border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4C84FF] file:text-white hover:file:bg-[#3a6cd9]"
          />
        </div>

        {isUploading && (
          <div className="mt-4">
            <progress className="w-full h-2 bg-gray-700 rounded-full" />
          </div>
        )}

        {uploadedImage && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📐 Select Format</h2>
            <select
              className="w-full p-3 bg-[#1E1E2F] border border-gray-600 rounded-lg text-white"
              value={selectedFormat}
              onChange={(e) =>
                setSelectedFormat(e.target.value as SocialFormat)
              }
            >
              {Object.keys(socialFormats).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>

            <div className="mt-8 relative">
              <h3 className="text-lg font-medium mb-3">🖼 Preview</h3>
              <div className="flex justify-center">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 rounded-lg">
                    <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                  </div>
                )}
                <CldImage
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  sizes="100vw"
                  alt="transformed image"
                  crop="fill"
                  aspectRatio={socialFormats[selectedFormat].aspectRatio}
                  gravity="auto"
                  ref={imageRef}
                  onLoad={() => setIsTransforming(false)}
                  className="rounded-xl border border-gray-700 shadow-md"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all"
                onClick={handleDownload}
              >
                Download for {selectedFormat}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}