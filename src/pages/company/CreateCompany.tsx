import { useState } from "react";
import TextInput from "../../components/CreateEvent/InputText";
import ImageUpload from "../../components/CreateEvent/ImageUpload";
import ButtonNeon from "../../components/Button/ButtonNeon";
import { toast } from "sonner";
import companyApi from "../../services/companyApi";

import { XCircle } from "lucide-react";

interface FileItem {
  name: string;
  type: string;
  size: number;
}

const CreateCompany = () => {
  const [logoCompany, setLogoCompany] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [codeTax, setCodeTax] = useState("");
  const [bankingName, setBankingName] = useState("");
  const [bankingCode, setBankingCode] = useState("");
  const [cccd, setCccd] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  console.log(files);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleRegisterCompany = async () => {
    setLoading(true);
    if (
      logoCompany == null ||
      companyName == "" ||
      description == "" ||
      codeTax == "" ||
      bankingName == "" ||
      bankingCode == "" ||
      cccd == ""
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin", { position: "top-center" });
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      if (logoCompany) data.append("file", logoCompany);
      data.append("companyName", companyName);
      data.append("description", description);
      data.append("codeTax", codeTax);
      data.append("bankingName", bankingName);
      data.append("bankingCode", bankingCode);
      data.append("nationalId", cccd);

      const response = await companyApi.create(data);
      // console.log(response);
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      console.log("Error create company", error);
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
            📂 Tài liệu xác thưc (PDF, DOC)
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
