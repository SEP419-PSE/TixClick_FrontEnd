import { useState } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploadProps {
  width: number;
  height: number;
  label: string;
}

export default function ImageUpload({
  width,
  height,
  label,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === width && img.height === height) {
        setImage(img.src);
        setError(null);
      } else {
        setImage(null);
        setError(`Image must be ${width}x${height} pixels.`);
      }
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4 border-2 border-dashed border-white bg-gray-500 p-6 rounded-lg w-80 text-center">
      <label className="cursor-pointer flex flex-col items-center">
        <UploadCloud className="w-12 h-12 text-pse-green" />
        <span className="text-white font-extralight mt-2">{label}</span>
        <span className="text-white">{width + "x" + height}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="border rounded-lg max-w-full"
        />
      )}
    </div>
  );
}
