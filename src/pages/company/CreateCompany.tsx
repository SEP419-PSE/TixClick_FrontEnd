import { useState } from "react";
import { toast } from "sonner";
import ButtonNeon from "../../components/Button/ButtonNeon";
import ImageUpload from "../../components/CreateEvent/ImageUpload";
import TextInput from "../../components/CreateEvent/InputText";
import companyApi from "../../services/companyApi";

import { XCircle } from "lucide-react";

const CreateCompany = () => {
  const [logoCompany, setLogoCompany] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [codeTax, setCodeTax] = useState("");
  const [bankingName, setBankingName] = useState("");
  const [bankingCode, setBankingCode] = useState("");
  const [cccd, setCccd] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  // console.log(files);

  // Xử lý khi chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Loại bỏ file trùng lặp
      const newFiles = selectedFiles.filter(
        (file) => !files.some((f) => f.name === file.name)
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Xóa file khỏi danh sách
  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleRegisterCompany = async () => {
    setLoading(true);

    // Kiểm tra dữ liệu đầu vào
    if (
      !logoCompany ||
      !address ||
      !companyName ||
      !description ||
      !codeTax ||
      !bankingName ||
      !bankingCode ||
      !cccd ||
      files.length === 0
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      // Tạo FormData để gửi API tạo công ty
      const companyData = new FormData();
      companyData.append("file", logoCompany);
      companyData.append("companyName", companyName);
      companyData.append("address", address);
      companyData.append("description", description);
      companyData.append("codeTax", codeTax);
      companyData.append("bankingName", bankingName);
      companyData.append("bankingCode", bankingCode);
      companyData.append("nationalId", cccd);

      // Gửi API đầu tiên (tạo công ty) và chờ kết quả
      const response = await companyApi.create(companyData);
      console.log(response);
      // const companyId = response.data.result.companyId;

      // Hiển thị thông báo nếu thành công
      toast.success("Tạo công ty thành công", { position: "top-center" });

      // Tạo FormData để upload tài liệu
      // const documentData = new FormData();
      // files.forEach((file) => {
      //   documentData.append("files", file);
      // });
      // documentData.append("companyId", companyId);
      // documentData.append("uploadDate", new Date().toISOString());

      // // Gửi API thứ hai (upload tài liệu) sau khi API đầu tiên hoàn tất
      // await companyApi.createDocumentCompany(documentData);

      // toast.success("Tài liệu đã được tải lên thành công!", {
      //   position: "top-center",
      // });
    } catch (error) {
      console.error("Error khi tạo công ty hoặc upload tài liệu:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-pse-black-light flex flex-col items-center justify-center my-10 p-4 w-[350px] md:w-[500px] lg:w-[700px] rounded-xl shadow-neon-green">
        <p className="font-semibold text-[18px] mb-4">Đăng ký công ty</p>
        <ImageUpload
          height={275}
          width={275}
          label="Thêm ảnh công ty"
          image={logoCompany}
          setImage={setLogoCompany}
        />
        <TextInput
          label="Tên công ty"
          maxLength={50}
          text={companyName}
          setText={setCompanyName}
          className="mt-4"
        />
        <TextInput
          label="Địa chỉ"
          maxLength={100}
          text={address}
          setText={setAddress}
          className="mt-4"
        />
        <TextInput
          label="Mô tả công ty"
          maxLength={100}
          text={description}
          setText={setDescription}
        />
        <TextInput
          label="Mã số thuế"
          maxLength={50}
          text={codeTax}
          setText={setCodeTax}
        />
        <TextInput
          label="Tên ngân hàng"
          maxLength={50}
          text={bankingName}
          setText={setBankingName}
        />
        <TextInput
          label="Số tài khoản"
          maxLength={50}
          text={bankingCode}
          setText={setBankingCode}
        />
        <TextInput
          label="Căn cước công dân"
          maxLength={12}
          text={cccd}
          setText={setCccd}
        />
        <div className="w-full mx-auto my-4 p-5 bg-white rounded-lg shadow-lg border">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            📂 Tài liệu xác thực (PDF, DOC)
          </h2>

          {/* File Input */}
          <input
            type="file"
            multiple
            accept=".pdf, .doc, .docx"
            onChange={handleFileChange}
            className="mb-4 w-full text-sm text-gray-700 file:bg-blue-500 file:text-white file:px-3 file:py-2 file:rounded-lg file:border-none file:cursor-pointer hover:file:bg-blue-600"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-800">
                📑 Danh sách file đã chọn:
              </h3>
              <ul>
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center bg-gray-200 hover:bg-blue-100 p-3 mb-2 rounded-lg transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-700">
                        {file.type} • {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button onClick={() => handleRemoveFile(file.name)}>
                      <XCircle
                        size={22}
                        className="text-red-600 hover:text-red-800 transition-all"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <ButtonNeon onClick={handleRegisterCompany}>
          {loading ? "Đang thực hiện ..." : "Đăng ký"}
        </ButtonNeon>
      </div>
    </div>
  );
};

export default CreateCompany;
