import CustomSelectCategory from "./CustomSelectCategory";
import CustomSelectPayment from "./CustomselectPayment";
import Cash from "../icons/icons_pendapatan/Cash.jsx";
import Pasif from "../icons/icons_pendapatan/Pasif.jsx";
import SideJob from "../icons/icons_pendapatan/SideJob.jsx";
import Freelance from "../icons/icons_pendapatan/Freelance.jsx";

export default function FormPemasukan({
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
                value: "gaji",
                label: "gaji",
                icon: <Cash />,
                color: "#67AE6E",
              },
              {
                value: "pasif",
                label: "pasif",
                icon: <Pasif />,
                color: "#B12C00",
              },
              {
                value: "side",
                label: "side job",
                icon: <SideJob />,
                color: "#3D74B6",
              },
              {
                value: "freelance",
                label: "freelance",
                icon: <Freelance />,

                color: "#E9762B",
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
          className="w-full border-2 border-[#00B89F] text-white hover:text-black font-medium rounded-md p-2 my-10 hover:bg-[#00B89F] transition-colors duration-300"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
