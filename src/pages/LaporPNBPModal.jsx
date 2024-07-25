import { Button, ModalBody, ModalHeader } from "react-bootstrap";
import { Modal, ModalFooter } from "reactstrap";
import { useReqBilling } from "../hooks/useReqBill";
import toast from "react-hot-toast";
import { useGetUser } from "../hooks/useAuth";

const LaporPNBPModal = ({ isOpen, onClose, data, setDataBilling }) => {
  const user = useGetUser()
  const { mutateAsync, isPending } = useReqBilling();
  const handleSubmit = async () => {
    let dataid = data?.map((item) => {return item?.id })
    const dataJson = {
      id: dataid,
      // kode_upt: "10",
      user: user?.uid,
      kode_upt: data[0]?.upt_id?.slice(0, 2),
      jenis_karantina: data[0]?.jenis_karantina
    }
    // console.log(dataJson)
    const toastId = toast.loading('Loading...');
    const response = await mutateAsync(dataJson);
    // toast.promise(response, {
    //   loading: 'Loading..',
    //   success: response?.message || 'Berhasil buat billing',
    //   error: response?.message || 'Gagal buat billing',
    // });
    if (response?.status) {
      toast.dismiss(toastId);
      toast.success(response?.message || "Berhasil buat billing")
      setDataBilling(response?.data)
    } else {
      toast.dismiss(toastId);
      let pesan = ""
      if (typeof response?.message == "string") {
        pesan = response?.message
      } else {
        pesan = response?.message?.code ? (response?.message?.code + " - " + response?.message?.message) : "Gagal buat billing"
      }
      toast.error(pesan || "Gagal buat billing", {
        style: {
          border: '1px solid black'
        }
      })
      // toast.error(response?.message || (response?.message?.code + " - " + response?.message?.message) || "Gagal buat billing", "Loading...")
    }
    console.log("response bill")
    console.log(response)
    // if (response?.status == 200) {
    //   onClose();
    // }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Modal isOpen={isOpen} toggle={onClose}>
        <ModalHeader>Lapor PNBP Barantin</ModalHeader>
        <ModalBody>Apakah Anda yakin melaporkan penerimaan?</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={isPending}
            onClick={() => handleSubmit()}
            variant="danger"
            type="submit"
          >
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </form>
  );
};
export default LaporPNBPModal;
