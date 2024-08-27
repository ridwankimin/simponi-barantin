import { Tree } from "react-arborist";
import { useState } from "react";
import { dataHewan27, dataIkan27, dataTumbuhan27 } from "../data/data_tarif_fisik";

const Node = ({ node, style, dragHandle }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      style={{
        ...style,
        cursor: "pointer",
        color: isHover ? "#d2ab47" : "",
      }}
      ref={dragHandle}
      onClick={() => {
        !node?.isLeaf && node.toggle();
      }}
    >
      {node.isLeaf ? (
        <i className="ri-price-tag-3-line me-1"></i>
      ) : (
        <i style={{ cursor: "pointer" }} className="ri-folder-2-line me-1"></i>
      )}
      {node.data.name}
      {/* {node.data.name + " " + (node.data.jenis_permohonan ?? "")} */}
    </div>
  );
};
const QuarantineTree = ({
  className = "",
  jenisPermohonan,
  jenisKarantina,
  setValue,
  volume,
  konversiTarif,
  selectedPtk,
}) => {
  let permohonan, karantina;
  switch (jenisPermohonan) {
    case "IM":
      permohonan = "Impor";
      break;
    case "EX":
      permohonan = "Ekspor";
      break;
    case "DM":
      permohonan = "Domestik Masuk";
      break;
    case "DK":
      permohonan = "Domestik Keluar";
      break;
    case "TR":
      permohonan = "Transit";
      break;
    case "RE":
      permohonan = "Reekspor";
      break;
    case "RI":
      permohonan = "Reimpor";
      break;
    default:
      permohonan = "Serah Terima";
  }
  
  switch (jenisKarantina) {
    case "H":
      karantina = dataHewan27;
      break;
    case "I":
      karantina = dataIkan27;
      break;
    case "T":
      karantina = dataTumbuhan27;
      break;
    default:
      karantina = [];
    //persiapan tarif ikan
  }
  return (
    <div className={className}>
      <Tree
        onSelect={(node) => {
          if (node[0]?.children == null) {
            setValue("tarif_id", node[0]?.data?.id);
            // setValue("kode_tarif", node[0]?.data?.kd_tarif);
            setValue("kode_pp", "2024027");
            setValue("kode_akun", node[0]?.data?.kd_akun);
            setValue("kode_simponi", node[0]?.data?.kd_tarif);
            setValue("satuan_volume", node[0]?.data?.satuan);
            setValue("volume", konversiTarif(node[0]?.data?.satuan, selectedPtk?.data?.satuan_lain_id, selectedPtk?.data?.volume_lain));
            setValue("uraian", node[0]?.data?.name);
            setValue("tarif", node[0]?.data?.jml_tarif);
            setValue("total_tarif", (jenisKarantina == "I" ? node[0]?.data?.jml_tarif : (parseFloat(node[0]?.data?.jml_tarif) * parseFloat(volume))));
          }
        }}
        searchTerm={permohonan}
        searchMatch={(node, permohonan) => {
          const words = permohonan?.split("%");
          console
          return (
            node?.isLeaf
            // &&
            // node?.data?.jenis_permohonan
            // ?.toLowerCase()
            // ?.includes(words[0]?.toLowerCase())
          );
        }}
     
        // searchMatch={(node, term) =>
        //   node?.isLeaf 
        //   // &&
        //   // (node?.data?.jenis_permohonan)
        //   //   ?.toLowerCase()
        //   //   ?.includes(term?.toLowerCase())
        // }
        initialData={karantina}
        disableDrag
        disableDrop
        disableEdit
        disableMultiSelection
        openByDefault={false}
        width={"100%"}
        className="w-100"
        height={400}
        indent={10}
        rowHeight={40}
        overscanCount={1}
        paddingTop={10}
        paddingBottom={10}
        padding={10}
      >
        {Node}
      </Tree>
    </div>
  );
};
export default QuarantineTree;
