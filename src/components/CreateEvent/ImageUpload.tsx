import { useState } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploadProps {
  width: number;
  height: number;
  label: string;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageUpload({
  width,
  height,
  label,
  image,
  setImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === width && img.height === height) {
        setImage(file);
        setError(null);

        // Tạo preview từ file
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImage(null);
        setPreview(null);
        setError(`Image must be ${width}x${height} pixels.`);
      }
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4 border-2 border-dashed border-white bg-gray-500 p-6 rounded-lg w-[300px] text-center">
      <label className="cursor-pointer flex flex-col items-center">
        <UploadCloud className="w-12 h-12 text-pse-green" />
        <span className="text-white font-extralight mt-2">{label}</span>
        <span className="text-white">{`${width}x${height}`}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {preview && (
        <img
          src={preview}
          alt="Uploaded preview"
          className="border rounded-lg max-w-full"
        />
      )}
    </div>
  );
}
