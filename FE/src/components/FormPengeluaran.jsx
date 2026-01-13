import CustomSelectCategory from "./CustomSelectCategory";
import CustomSelectPayment from "./CustomselectPayment";
import FnB from "../icons/icons_pengeluaran/FnB.jsx";
import Pulsa from "../icons/icons_pengeluaran/Pulsa.jsx";
import Internet from "../icons/icons_pengeluaran/Internet.jsx";
import Bensin from "../icons/icons_pengeluaran/Bensin.jsx";
import Liburan from "../icons/icons_pengeluaran/Liburan.jsx";
import Kesehatan from "../icons/icons_pengeluaran/Kesehatan.jsx";
import Tagihan from "../icons/icons_pengeluaran/Tagihan.jsx";
import Belanja from "../icons/icons_pengeluaran/Belanja.jsx";
import Hiburan from "../icons/icons_pengeluaran/Hiburan.jsx";
import Kecantikan from "../icons/icons_pengeluaran/Kecantikan.jsx";
import Transportasi from "../icons/icons_pengeluaran/Transportasi.jsx";
import Pakaian from "../icons/icons_pengeluaran/Pakaian.jsx";
import Service from "../icons/icons_pengeluaran/Service.jsx";
import Investasi from "../icons/icons_pengeluaran/Investasi.jsx";
import Asuransi from "../icons/icons_pengeluaran/Asuransi.jsx";
import Pajak from "../icons/icons_pengeluaran/Pajak.jsx";
import Darurat from "../icons/icons_pengeluaran/Darurat.jsx";
import Pendidikan from "../icons/icons_pengeluaran/Pendidikan.jsx";
import Lainnya from "../icons/icons_pengeluaran/Lainnya.jsx";

export default function FormPengeluaran({
  handleSubmit,
  valueCategory,
  setValueCategory,
  valuePayment,
  setValuePayment,
}) {
  return (
    <div className="mt-4 ">
      <form onSubmit={handleSubmit}>
        <label htmlFor="Kategori">
          <CustomSelectCategory
            options={[
              {
                value: "FnB",
                label: "FnB",
                icon: <FnB />,
                color: "#205781",
              },
              {
                value: "pulsa",
                label: "pulsa",
                icon: <Pulsa />,
                color: "#437057",
              },
              {
                value: "internet",
                label: "internet",
                icon: <Internet />,
                color: "#67AE6E",
              },
              {
                value: "bensin",
                label: "bensin",
                icon: <Bensin />,
                color: "#8A0000",
              },
              {
                value: "liburan",
                label: "liburan",
                icon: <Liburan />,
                color: "#3B9797",
              },
              {
                value: "kesehatan",
                label: "kesehatan",
                icon: <Kesehatan />,
                color: "#3D74B6",
              },
              {
                value: "tagihan",
                label: "tagihan",
                icon: <Tagihan />,
                color: "#CF0F47",
              },
              {
                value: "belanja",
                label: "belanja",
                icon: <Belanja />,
                color: "#0D4715",
              },
              {
                value: "hiburan",
                label: "hiburan",
                icon: <Hiburan />,
                color: "#4A9782",
              },
              {
                value: "kecantikan",
                label: "kecantikan",
                icon: <Kecantikan />,
                color: "#DB6B97",
              },
              {
                value: "transportasi",
                label: "transportasi",
                icon: <Transportasi />,
                color: "#547792",
              },
              {
                value: "pakaian",
                label: "pakaian",
                icon: <Pakaian />,
                color: "#48A6A7",
              },
              {
                value: "service",
                label: "service",
                icon: <Service />,
                color: "#E9762B",
              },
              {
                value: "investasi",
                label: "investasi",
                icon: <Investasi />,
                color: "#00712D",
              },
              {
                value: "asuransi",
                label: "asuransi",
                icon: <Asuransi />,
                color: "#123458",
              },
              {
                value: "pajak",
                label: "pajak",
                icon: <Pajak />,
                color: "#E9762B",
              },
              {
                value: "darurat",
                label: "darurat",
                icon: <Darurat />,
                color: "#B12C00",
              },
              {
                value: "pendidikan",
                label: "pendidikan",
                icon: <Pendidikan />,
                color: "#279EFF",
              },
              {
                value: "lainnya",
                label: "lainnya",
                icon: <Lainnya />,
                color: "#748873",
              },
            ]}
            placeholder="Pilih Kategori"
            value={valueCategory}
            onChange={(v) => {
              // handle change
              setValueCategory(v);
            }}
            className="mb-3"
            outlineClass="focus:ring-2 focus:ring-[#00CBA9]"
          />
        </label>
        <label htmlFor="pembayaran">
          <CustomSelectPayment
            value={valuePayment}
            onChange={(v) => {
              // handle change
              setValuePayment(v);
            }}
            placeholder="Pilih Pembayaran"
            outlineClass="focus:ring-2 focus:ring-[#00CBA9]"
          />
        </label>
        <div className="flex gap-4">
          <label htmlFor="jumlah" className="block mt-4">
            <input
              type="number"
              id="jumlah"
              name="jumlah"
              placeholder="Jumlah"
              className="w-full bg-[#222] text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-[#00CBA9]"
              required
            />
          </label>
          <label htmlFor="admin" className="block mt-4">
            <input
              type="text"
              id="admin"
              name="admin"
              placeholder="admin"
              className="w-full bg-[#222] text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-[#00CBA9]"
            />
          </label>
        </div>
        <label htmlFor="catatan">
          <textarea
            id="catatan"
            name="catatan"
            placeholder="Catatan"
            className="w-full bg-[#222] text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-[#00CBA9] mt-4 resize-none"
            rows="3"
          ></textarea>
        </label>
        <button
          type="submit"
          className="w-full border-2 border-[#B12C00] text-white hover:text-black font-medium rounded-md p-2 my-10 hover:bg-[#B12C00] transition-colors duration-300"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
