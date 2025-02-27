import { useState } from "react";
import TextInput from "../../components/CreateEvent/InputText";
import ImageUpload from "../../components/CreateEvent/ImageUpload";
import ButtonNeon from "../../components/Button/ButtonNeon";
import { toast } from "sonner";
import companyApi from "../../services/companyApi";

const CreateCompany = () => {
  const [logoCompany, setLogoCompany] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [codeTax, setCodeTax] = useState("");
  const [bankingName, setBankingName] = useState("");
  const [bankingCode, setBankingCode] = useState("");
  const [cccd, setCccd] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

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
        <ButtonNeon onClick={handleRegisterCompany}>
          {loading ? "Đang thực hiện ..." : "Đăng ký"}
        </ButtonNeon>
      </div>
    </div>
  );
};

export default CreateCompany;
