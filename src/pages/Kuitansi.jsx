import React, { useState } from "react";
import { Card, Col, Row, Nav, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import LaporPNBPModal from "./LaporPNBPModal";
import useDisclosure from "../hooks/useDisclosure";
import ReactDatePicker from "react-datepicker";
import { useCekBilling, useGetBillList } from "../hooks/useReqBill";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { toRupiah } from "to-rupiah";
import { useGetUser } from "../hooks/useAuth";
import { useMemo } from "react";
import toast from "react-hot-toast";
const Kuitansi = () => {
  // const { isOpen, onClose, onOpen } = useDisclosure();
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const [startDate, setStartDate] = useState(currentDate.toISOString().split("T")[0]);
  currentDate.setMonth(currentDate.getMonth() + 1)
  const [finishDate, setFinishDate] = useState(currentDate.toISOString().split("T")[0]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const countPerPage = 10;
  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const user = useGetUser()

  const [page, setPage] = useState(1);
  let [filterText, setFilterText] = useState("");
  let [filteredListData, setFilteredListData] = useState([]);
  // const navigate = useNavigate();
  const params = {
    dFrom: startDate,
    dTo: finishDate,
    karantina: selectedMenu,
    uptId: user?.upt,
    satpelId: Cookies.get('satpel') || user?.upt,
  };
  const { data: response, refetch } = useGetBillList({ params });
  const { mutateAsync, isPending } = useCekBilling();
  console.log(params)
  const { data: listData, total = 0 } = response ?? {};
  console.log(listData);

  const cekBillingSatu = async (values) => {
    const kodeupt = user?.upt?.toString()?.slice(0, 2)
    const toastId = toast.loading('Loading...');
    const kiriman = {
      trx: values.idtrx_bill,
      upt: kodeupt,
      kdbill: values.kode_bill
    }
    const response = await mutateAsync(kiriman);
    console.log(response)
    if (response?.status) {
      toast.dismiss(toastId);
      toast.success(values?.idtrx_bill + " " + (response?.message || "Sukses cek billing"))
      refetch()
      // setDataBilling(response?.data)
    } else {
      toast.dismiss(toastId);
      let pesan = ""
      if (typeof response?.message == "string") {
        pesan = response?.message
      } else {
        pesan = response?.message?.code ? (response?.message?.code + " - " + response?.message?.message) : "Gagal cek billing"
      }
      toast.error(values?.idtrx_bill + " " + (pesan || "Gagal cek billing"), {
        style: {
          border: '1px solid black'
        }
      })
    }
  }

  const columns = [
    // {
    //   name: "Aksi",
    //   cell: () => (
    //     <div className="d-flex justify-content-around">
    //       <i
    //         style={{ cursor: "pointer" }}
    //         className="ri-edit-line "
    //         // onClick={() => {
    //         //   navigate(`/kuitansi/${row.id}/edit`);
    //         // }}
    //       />
    //       <i style={{ cursor: "pointer" }} className="ri-delete-bin-line" />
    //     </div>
    //   ),
    // },
    {
      name: "Nomor Transaksi",
      cell: (row) => row?.idtrx_bill,
      width: "200px"
    },
    {
      name: "Kode Bill",
      cell: (row) => row?.kode_bill,
    },
    {
      name: "Karantina",
      cell: (row) => 
      (
        <span className={"btn btn-sm" + (row?.jenis_karantina == "T" ? " btn-success" : (row?.jenis_karantina == "I" ? " btn-info" : (row?.jenis_karantina == "H" ? " btn-warning" : "")))}>{(row?.jenis_karantina == "T" ? "Tumbuhan" : (row?.jenis_karantina == "I" ? "Ikan" : (row?.jenis_karantina == "H" ? "Hewan" : "")))}</span>
      ),
      width: "120px"
    },
    {
      name: "Tanggal Billing",
      cell: (row) => row?.date_bill,
    },
    {
      name: "Tanggal Expired",
      cell: (row) => row?.exp_bill,
    },
    {
      name: "Total",
      cell: (row) => (row?.total_pnbp ? toRupiah(parseInt(row?.total_pnbp)) : "-"),
    },
    {
      name: "Nama Wajib Bayar",
      cell: (row) => row?.nama_wajib_bayar,
    },
    {
      name: "Status Pembayaran",
      cell: (row) => (
        <span className="ff-numerals">{row?.status_bill ?? (
          <button type="button" disabled={isPending} className="btn btn-sm btn-dark" onClick={() => cekBillingSatu(row)}><i className="ri-refresh-line me-2"></i>{isPending ? "Loading.." : "Cek"}</button>
        )}</span>
      ),
    },
    {
      name: "NTPN",
      cell: (row) => row?.ntpn,
    },
    {
      name: "Tanggal Setor",
      cell: (row) => row?.date_setor,
    },
    {
      name: "Keterangan",
      cell: (row) => (row?.bank ? row?.bank + " (" + row?.via + ")" : ""),
    },
  ];

  const filterData = (text) => {
    setFilterText(text)
    if (text != "") {
      const balikin = listData.filter(
        item =>
          (item.idtrx_bill && item.idtrx_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.kode_bill && item.kode_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.date_bill && item.date_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.exp_bill && item.exp_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.total_pnbp && item.total_pnbp.toLowerCase().includes(text.toLowerCase())) |
          (item.nama_wajib_bayar && item.nama_wajib_bayar.toLowerCase().includes(text.toLowerCase())) |
          (item.date_setor && item.date_setor.toLowerCase().includes(text.toLowerCase())) |
          (item.chnl_bayar && item.chnl_bayar.toLowerCase().includes(text.toLowerCase())) |
          (item.status_bill && item.status_bill.toLowerCase().includes(text.toLowerCase())) |
          (item.ntpn && item.ntpn.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredListData(balikin)
    } else {
      setFilteredListData([])
    }
  }

  const subHeaderComponentMemoSsm = useMemo(() => {
    return (
      <div className='col-sm-2'>
        <Form.Control
          type="text"
          size="sm"
          id="searchListData"
          placeholder="Search..."
          onChange={e => filterData(e.target.value)}
        />
      </div>
    );
  }, []);

  const cekBillingAction = async () => {
    const yangbelom = listData.filter(item => item.status_bill == null)
    const kodeupt = user?.upt?.toString()?.slice(0, 2)
    const toastId = toast.loading('Loading...');
    const kiriman = yangbelom.map(item => {
      return {
        trx: item.idtrx_bill,
        upt: kodeupt,
        kdbill: item.kode_bill
      }
    })
    kiriman.map(async item => {
      const response = await mutateAsync(item);
      console.log(response)
      if (response?.status) {
        toast.dismiss(toastId);
        toast.success(item?.trx + " " + (response?.message || "Sukses cek billing"))
        // setDataBilling(response?.data)
      } else {
        toast.dismiss(toastId);
        let pesan = ""
        if (typeof response?.message == "string") {
          pesan = response?.message
        } else {
          pesan = response?.message?.code ? (response?.message?.code + " - " + response?.message?.message) : "Gagal cek billing"
        }
        toast.error(item?.trx + " " + (pesan || "Gagal cek billing"), {
          style: {
            border: '1px solid black'
          }
        })
      }
    })
    refetch()
  }

  return (
    <React.Fragment>
      <SEO title="Kuitansi" />
      <div className="d-md-flex justify-content-between mb-2 pt-5">
        <div>
          {/* <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link href="#">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Table Status Billing
            </li>
          </ol> */}
          <h4 className="main-title mb-0">Data Status Billing
          </h4>
        </div>
        
        {/* <div className="d-flex align-items-center gap-2 mt-3 mt-md-0"></div> */}
      </div>

      <Row className="g-3">
        <Col xs="12">
          <Card className="card-one">
            <Card.Header className="d-flex justify-content-between">
              <Card.Title as="h6"><button type="button" disabled={isPending} className="btn btn-dark me-4 mb-0" onClick={() => cekBillingAction()}><i className="ri-search-line me-2"></i>{isPending ? "Loading.." : "Cek Semua"}</button></Card.Title>
              <div className="d-flex" style={{ columnGap: "2px" }}>
                <ReactDatePicker
                  className="form-control"
                  selected={startDate}
                  closeOnScroll={true}
                  // isClearable
                  placeholderText="Dari Tanggal"
                  onChange={(e) => setStartDate(e)}
                />
                <ReactDatePicker
                  className="form-control"
                  selected={finishDate}
                  closeOnScroll={true}
                  // isClearable
                  placeholderText="Sampai Tanggal"
                  onChange={(e) => setFinishDate(e)}
                />
                <select className="form-select form-select-sm w-30" name="jenisKarantina" id="jenisKarantina" onChange={(e) => handleSelectMenu(e.target.value)}>
                  <option value="" selected={selectedMenu == "" ? true : false}>--Semua--</option>
                  <option value="H" selected={selectedMenu == "H" ? true : false}>Hewan</option>
                  <option value="I" selected={selectedMenu == "I" ? true : false}>Ikan</option>
                  <option value="T" selected={selectedMenu == "T" ? true : false}>Tumbuhan</option>
                </select>
              </div>
              {/* <div className="d-flex" style={{ columnGap: "2px" }}>
                <ReactDatePicker
                  className="form-control"
                  selected={startDate}
                  closeOnScroll={true}
                  isClearable
                  placeholderText="Tanggal start"
                  onChange={(e) => setStartDate(e)}
                />
                <Nav className="nav-icon nav-icon-sm ms-auto">
                  <Nav.Link href="">
                    <Button
                      className="text-align-center"
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      <i
                        style={{ cursor: "pointer" }}
                        className="ri-file-add-line "
                      ></i>
                      Cek Status Bayar
                    </Button>
                  </Nav.Link>
                </Nav>
              </div> */}
            </Card.Header>
            <Card.Body>
              <DataTable
                // noDataComponent={() => {
                //   return (
                //     <>
                //       <h2>Tidak ada data</h2>
                //     </>
                //   );
                // }}
                // title="--"
                // selectableRows
                columns={columns}
                data={filteredListData.length > 0 || filterText != "" ? filteredListData : listData}
                highlightOnHover
                pagination
                dense
                subHeader
                subHeaderComponent={subHeaderComponentMemoSsm}
                // paginationServer
                // paginationTotalRows={total}
                // paginationPerPage={countPerPage}
                // paginationComponentOptions={{
                //   noRowsPerPage: true,
                //   rangeSeparatorText: "dari",
                // }}
                // onChangePage={(page) => {
                //   setPage(page);
                // }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <LaporPNBPModal isOpen={isOpen} onClose={onClose} /> */}
    </React.Fragment>
  );
};
export default Kuitansi;