import {
  Bell,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import type {
  ContractDocumentDTO,
  ContractDTO,
  VietQR,
} from "../../../../interface/manager/Contracts";
import managerApi from "../../../../services/manager/ManagerApi";
import { banks } from "../../../company/CreateCompany";
import { formatMoney } from "../../../DataTranfer";
import { ManagerHeader } from "../ManagerHeader";

// Define the ContractDetail interface
interface ContractDetail {
  contractDetailId: number;
  contractDetailName: string;
  contractDetailCode: string;
  description: string;
  contractAmount: number;
  contractPayDate: string;
  status: string;
  contractId: number;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [contractDocument, setContractDocument] = useState<
    ContractDocumentDTO[]
  >([]);

  const [selectedContract, setSelectedContract] = useState<ContractDTO>();
  const [selectedContractDocument, setSelectedContractDocument] =
    useState<ContractDocumentDTO>();
  console.log(selectedContractDocument, setSelectedContractDocument);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const [paymentCode, setPaymentCode] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paymentInfor, setPaymentInfor] = useState<VietQR>();

  const [contractDetails, setContractDetails] = useState<ContractDetail[]>([]);

  // Add a state to track the selected contract detail
  const [selectedContractDetail, setSelectedContractDetail] =
    useState<ContractDetail | null>(null);

  const fetchContractDetails = async (contractId: number) => {
    try {
      const response = await managerApi.getContractDetails(contractId);
      console.log("Contract Details:", response.data.result);
      if (response.data.result) {
        setContractDetails(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching contract details:", error);
      toast.error("Failed to fetch contract details");
    }
  };

  const fetchQr = async () => {
    try {
      const contractResponse = await managerApi.getQrByContractId(
        selectedContract?.contractId
      );
      console.log("QR", contractResponse);
      if (contractResponse.data.result) {
        setPaymentInfor(contractResponse.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQr();
  }, [selectedContract]);

  // const generateVietQRUrl = () => {
  //   const xBankId = banks.find((x) => x.bankName == paymentInfor?.bankID)?.id;
  //   console.log(xBankId);

  //   if (!paymentInfor?.bankID || !paymentInfor?.accountID) {
  //     return null;
  //   }

  //   const encodedDescription = encodeURIComponent(
  //     paymentInfor.description || ""
  //   );
  //   const amount = paymentInfor.amount
  //     ? paymentInfor.amount
  //     : paymentInfor?.amount;

  //   return `https://img.vietqr.io/image/${xBankId}-${paymentInfor.accountID}-compact.png?amount=${amount}&addInfo=${encodedDescription}&accountName=Contract%20Payment`;
  // };

  // Replace the existing handlePaymentConfirmation function with this implementation:
  const handlePaymentConfirmation = async () => {
    if (paymentCode.trim() === "") {
      toast.error("Please enter a payment confirmation code");
      return;
    }

    try {
      // Get the selected contract detail's payment ID
      const selectedDetailId = selectedContractDetail?.contractDetailId;

      if (!selectedDetailId) {
        toast.error("No payment selected");
        return;
      }

      // Call the API to confirm payment with the correct parameter format
      const response = await managerApi.confirmContractPaymentPay(
        paymentCode,
        selectedDetailId
      );

      if (response.data.success) {
        toast.success("Payment confirmed", {
          description: `Payment for contract ${selectedContract?.accountId} has been confirmed.`,
        });

        // Refresh contract details to update payment status
        if (selectedContract?.contractId) {
          await fetchContractDetails(selectedContract.contractId);
        }

        setPaymentCode("");
      } else {
        toast.error(response.data.message || "Failed to confirm payment");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment. Please try again.");
    }
  };

  const fetchContractList = async () => {
    try {
      const res: any = await managerApi.getAllContract();
      console.log("Contract List:", res.data.result);
      if (res.data.result && res.data.result.length > 0) {
        setContracts(res.data.result);

        if (selectedContract) {
          const contractData = res.data.result.find(
            (item: any) =>
              item.contractDTO.contractId === selectedContract.contractId
          );
          if (contractData && contractData.contractDocumentDTOS) {
            setContractDocument(contractData.contractDocumentDTOS);
            setSelectedContractDocument(contractData.contractDocumentDTOS[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error("Failed to fetch contract");
    }
  };

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchContractList();
    };
    initUseEffect();
  }, []);

  const openContractModal = async (contract: ContractDTO) => {
    setSelectedContract(contract);
    const contractData = contracts.find(
      (item: any) => item.contractDTO.contractId === contract.contractId
    );

    if (contractData && contractData.contractDocumentDTOS) {
      setContractDocument(contractData.contractDocumentDTOS);
      if (contractData.contractDocumentDTOS.length > 0) {
        setSelectedContractDocument(contractData.contractDocumentDTOS[0]);
      }
    } else {
      setContractDocument([]);
      setSelectedContractDocument(undefined);
    }

    if (contract.contractId) {
      await fetchContractDetails(contract.contractId);
    }

    setIsContractModalOpen(true);
  };

  useEffect(() => {
    if (selectedContract && selectedContract.contractId) {
      // setVietQRParams({
      //   bankID: "BIDV",
      //   accountID: "31410001689304",
      //   amount: selectedContract.totalAmount,
      //   description: `Payment for contract #${selectedContract.contractId}`,
      // })
    }
  }, [selectedContract]);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
            Đang xử lý
          </span>
        );
      case "Expired":
        return (
          <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-500">
            {status}
          </span>
        );
    }
  };

  const getContractDetailStatusBadge = (status: string) => {
    let style = "";
    let label = status;

    switch (status) {
      case "PAID":
        style =
          "bg-green-900 text-green-300 border border-green-800 rounded px-2 py-0.5 text-sm";
        label = "Paid";
        break;
      case "PENDING":
        style =
          "bg-yellow-900 text-yellow-300 border border-yellow-800 rounded px-2 py-0.5 text-sm";
        label = "Pending";
        break;
      case "OVERDUE":
        style =
          "bg-red-900 text-red-300 border border-red-800 rounded px-2 py-0.5 text-sm";
        label = "Overdue";
        break;
      default:
        style = "bg-gray-500/20 text-gray-500 rounded px-2 py-0.5 text-sm";
        label = status;
        break;
    }

    return <span className={style}>{label}</span>;
  };

  const paginate = (items: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const paginatedContracts = paginate(contracts, currentPage, itemsPerPage);

  return (
    <>
      <ManagerHeader
        heading="Hợp đồng"
        text="Xem và quản lý các hợp đồng"
      />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              className="w-[300px] bg-[#2A2A2A] text-white"
              placeholder="Tìm kiếm hợp đồng ..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Xếp theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Xếp theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service Agreement</SelectItem>
                <SelectItem value="licensing">Licensing Agreement</SelectItem>
                <SelectItem value="partnership">
                  Partnership Agreement
                </SelectItem>
                <SelectItem value="maintenance">
                  Maintenance Agreement
                </SelectItem>
                <SelectItem value="consulting">Consulting Agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableHead className="text-white">Tên hợp đồng</TableHead>
                <TableHead className="text-white">Công ty</TableHead>
                <TableHead className="text-white">Loại hợp đồng</TableHead>
                <TableHead className="text-white">Ngày bắt đầu</TableHead>
                <TableHead className="text-white">Ngày kết thúc</TableHead>
                <TableHead className="text-white">Tổng giá trị</TableHead>
                <TableHead className="text-white">Trạng thái</TableHead>
                <TableHead className="text-white text-right">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContracts.map((contractItem) => {
                const contract = contractItem.contractDTO;
                return (
                  <TableRow
                    key={contract.contractId}
                    className="border-[#333333] hover:bg-[#2A2A2A]"
                  >
                    <TableCell className="font-medium text-white">
                      {contract.contractName}
                    </TableCell>
                    <TableCell className="text-white">
                      Company {contract.companyId}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.contractType}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.startDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.endDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatMoney(contract.totalAmount) || "0"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.status || "N/A")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#2A2A2A] text-white"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openContractModal(contract)}
                          >
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-yellow-500">
                            <Bell className="mr-2 h-4 w-4" />
                            Set reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            Terminate contract
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-6 border-t border-[#333333] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  Hiển thị{" "}
                  <span className="font-medium text-white">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      contracts.length
                    )}
                  </span>{" "}
                  từ{" "}
                  <span className="font-medium text-white">
                    {Math.min(currentPage * itemsPerPage, contracts.length)}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium text-white">
                    {contracts.length}
                  </span>{" "}
                  hợp đồng
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[110px] h-9 bg-[#2A2A2A] text-white border-[#333333]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / trang</SelectItem>
                    <SelectItem value="10">10 / trang</SelectItem>
                    <SelectItem value="15">15 / trang</SelectItem>
                    <SelectItem value="20">20 / trang</SelectItem>
                  </SelectContent>
                </Select>

                <nav
                  className="flex items-center space-x-1"
                  aria-label="Pagination"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">First page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-left"
                    >
                      <path d="m11 17-5-5 5-5" />
                      <path d="m18 17-5-5 5-5" />
                    </svg>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {totalPages <= 5 ? (
                    // If 5 or fewer pages, show all page numbers
                    Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === i + 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        <span>{i + 1}</span>
                      </Button>
                    ))
                  ) : (
                    <>
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(1)}
                      >
                        <span>1</span>
                      </Button>

                      {currentPage > 3 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      {currentPage > 2 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <span>{currentPage - 1}</span>
                        </Button>
                      )}

                      {currentPage !== 1 && currentPage !== totalPages && (
                        <Button
                          variant="default"
                          size="icon"
                          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 rounded-md"
                        >
                          <span>{currentPage}</span>
                        </Button>
                      )}

                      {currentPage < totalPages - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <span>{currentPage + 1}</span>
                        </Button>
                      )}

                      {currentPage < totalPages - 2 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      {/* Always show last page */}
                      <Button
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === totalPages
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        <span>{totalPages}</span>
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Last page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-right"
                    >
                      <path d="m6 17 5-5-5-5" />
                      <path d="m13 17 5-5-5-5" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              View and manage the details of the selected contract.
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs defaultValue="contractDetails" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contractDetails">
                  Payment Schedule
                </TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="contractDetails">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Payment Schedule
                  </h3>

                  {contractDetails && contractDetails.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                            <TableHead className="text-white">
                              Payment Name
                            </TableHead>
                            <TableHead className="text-white">Code</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">
                              Due Date
                            </TableHead>
                            <TableHead className="text-white">
                              Description
                            </TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">
                              Payment
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contractDetails.map((detail) => (
                            <TableRow
                              key={detail.contractDetailId}
                              className="border-[#333333] hover:bg-[#2A2A2A]"
                            >
                              <TableCell className="font-medium text-white">
                                {detail.contractDetailName}
                              </TableCell>
                              <TableCell className="text-white">
                                {detail.contractDetailCode}
                              </TableCell>
                              <TableCell className="text-white">
                                {detail.contractAmount?.toLocaleString() || "0"}
                              </TableCell>
                              <TableCell className="text-white">
                                {detail.contractPayDate || "N/A"}
                              </TableCell>
                              <TableCell className="text-white">
                                {detail.description || "N/A"}
                              </TableCell>
                              <TableCell>
                                {getContractDetailStatusBadge(detail.status)}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger
                                    asChild
                                    className="flex items-center justify-center"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        setSelectedContractDetail(detail)
                                      }
                                    >
                                      <DollarSign className="h-4 w-4 text-black" />
                                      <span className="sr-only">
                                        Show VietQR
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-[#2A2A2A] text-white max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Payment QR Code</DialogTitle>
                                      <DialogDescription>
                                        Scan this QR code to pay for{" "}
                                        {detail.contractDetailName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center justify-center p-4">
                                      <div className="bg-white p-4 rounded-lg mb-4">
                                        <img
                                          src={`https://img.vietqr.io/image/${
                                            paymentInfor?.bankID
                                              ? banks.find(
                                                  (x) =>
                                                    x.bankName ==
                                                    paymentInfor?.bankID
                                                )?.id
                                              : "BIDV"
                                          }-${
                                            paymentInfor?.accountID ||
                                            "31410001689304"
                                          }-compact.png?amount=${
                                            detail.contractAmount || 0
                                          }&addInfo=Payment for ${
                                            detail.contractDetailName
                                          }&accountName=Contract%20Payment`}
                                          alt="VietQR Payment Code"
                                          width={200}
                                          height={200}
                                          className="w-48 h-48"
                                        />
                                      </div>
                                      <div className="text-center space-y-2">
                                        <p className="text-sm">
                                          <span className="text-gray-400">
                                            Amount:
                                          </span>{" "}
                                          $
                                          {detail.contractAmount?.toLocaleString() ||
                                            "0"}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-gray-400">
                                            Due Date:
                                          </span>{" "}
                                          {detail.contractPayDate || "N/A"}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-gray-400">
                                            Reference:
                                          </span>{" "}
                                          {detail.contractDetailCode}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter className="flex flex-col gap-2 items-stretch">
                                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                                        <h4 className="text-md font-medium mb-2">
                                          Confirm Payment
                                        </h4>
                                        <div className="space-y-3">
                                          <p className="text-sm text-gray-400">
                                            After completing payment, enter the
                                            confirmation code below:
                                          </p>
                                          <div className="flex space-x-2">
                                            <Input
                                              placeholder="Enter payment code"
                                              value={paymentCode}
                                              onChange={(e) =>
                                                setPaymentCode(e.target.value)
                                              }
                                              className="bg-[#2A2A2A]"
                                            />
                                            <Button
                                              onClick={
                                                handlePaymentConfirmation
                                              }
                                            >
                                              Confirm
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <p className="mb-4 text-gray-400">
                        No payment schedule available for this contract.
                      </p>
                    </div>
                  )}

                  {contractDetails && contractDetails.length > 0 && (
                    <div className="mt-6 p-4 bg-[#1E1E1E] rounded-lg">
                      <h4 className="text-md font-medium mb-3">
                        Payment Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Contract Value:
                          </p>
                          <p className="text-lg font-semibold">
                            $
                            {selectedContract?.totalAmount?.toLocaleString() ||
                              "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Payments:
                          </p>
                          <p className="text-lg font-semibold">
                            $
                            {contractDetails
                              .reduce(
                                (sum, detail) =>
                                  sum + (detail.contractAmount || 0),
                                0
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Paid Amount:</p>
                          <p className="text-lg font-semibold text-green-500">
                            $
                            {contractDetails
                              .filter((detail) => detail.status === "PAID")
                              .reduce(
                                (sum, detail) =>
                                  sum + (detail.contractAmount || 0),
                                0
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Pending Amount:
                          </p>
                          <p className="text-lg font-semibold text-yellow-500">
                            $
                            {contractDetails
                              .filter((detail) => detail.status === "PENDING")
                              .reduce(
                                (sum, detail) =>
                                  sum + (detail.contractAmount || 0),
                                0
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Contract Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-gray-600 space-y-6 ml-4">
                    {/* Contract Start */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-green-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Contract Start
                      </div>
                      <div className="text-sm text-gray-400">
                        {selectedContract?.startDate || "Not specified"}
                      </div>
                    </div>

                    {contractDocument && contractDocument.length > 0 ? (
                      contractDocument.map((doc, index) => (
                        <div className="relative" key={index}>
                          <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[18px]"></div>
                          <div className="mb-1 text-sm font-medium">
                            Document Uploaded: {doc.fileName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {doc.uploadDate ||
                              new Date().toISOString().split("T")[0]}
                          </div>
                          <div className="text-sm text-gray-400">
                            Uploaded by: {doc.uploadedBy || "System User"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-gray-500 -left-[18px]"></div>
                        <div className="mb-1 text-sm font-medium">
                          No documents uploaded yet
                        </div>
                        <div className="text-sm text-gray-400">
                          Upload documents to track contract progress
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Current Date
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date().toISOString().split("T")[0]}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-red-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Contract End
                      </div>
                      <div className="text-sm text-gray-400">
                        {selectedContract?.endDate || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
