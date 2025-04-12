import { useState } from "react";
import { toast } from "sonner";
import ButtonNeon from "../../components/Button/ButtonNeon";
import ImageUpload from "../../components/CreateEvent/ImageUpload";
import TextInput from "../../components/CreateEvent/InputText";
import companyApi from "../../services/companyApi";

import { XCircle } from "lucide-react";
import BankDropdown from "./components/BankDropDown";
import LoadingFullScreen from "../../components/Loading/LoadingFullScreen";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";

const banks = [
  { id: "970436", bankName: "Vietcombank" },
  { id: "970418", bankName: "BIDV" },
  { id: "970422", bankName: "MB Bank" },
  { id: "970415", bankName: "VietinBank" },
  { id: "970416", bankName: "ACB" },
  { id: "970432", bankName: "VPBank" },
  { id: "970403", bankName: "Sacombank" },
  { id: "970423", bankName: "Techcombank" },
  { id: "970441", bankName: "VIB" },
  { id: "970454", bankName: "TPBank" },
];

const CreateCompany = () => {
  const navigate = useNavigate();
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
      setLoading(true);
      // Tạo FormData để gửi API tạo công ty
      const companyData = new FormData();
      companyData.append("logoURL", logoCompany);
      companyData.append("companyName", companyName);
      companyData.append("address", address);
      companyData.append("description", description);
      companyData.append("codeTax", codeTax);
      companyData.append("bankingName", bankingName);
      companyData.append("bankingCode", bankingCode);
      companyData.append("nationalId", cccd);
      Array.from(files).forEach((file) => {
        companyData.append("companyDocument", file); // Append từng file
      });

      // companyData.forEach((key, value) => {
      //   console.log(key, value);
      // });

      // Gửi API đầu tiên (tạo công ty) và chờ kết quả
      const response = await companyApi.createCompanyandDocument(companyData);
      console.log(response);
      if (response.data.code == 200) {
        navigate("/create-event");
        toast.success("Tạo công ty thành công", { position: "top-center" });
      }
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
    <div className="min-h-screen mt-16 flex items-center justify-center">
      {loading && <LoadingFullScreen />}
      <Card className="bg-transparent bg-gradient-to-b from-black/20 to-pse-green/50 flex flex-col items-center justify-center my-10 p-4 w-[350px] md:w-[500px] lg:w-[700px] rounded-xl shadow-neon-green">
        <p className="font-semibold text-[18px] mb-4 text-white">
          Đăng ký công ty
        </p>
        <ImageUpload
          // previewImage={null}
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
        <BankDropdown
          banks={banks}
          selectedBankName={bankingName}
          onChange={setBankingName}
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
            📂 Tài liệu xác thực (PDF)
          </h2>

          {/* File Input */}
          <input
            type="file"
            multiple
            accept=".pdf"
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
      </Card>
    </div>
  );
};

export default CreateCompany;
