import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CustomSelectPayment from "./CustomselectPayment";
import CustomSelectCategory from "./CustomSelectCategory";
// import apiData from "../Data/apiData";
import { useAppStore } from "../store/store.js";
import Logout from "./Logout.jsx";
import { jwtDecode } from "jwt-decode";
import Cash from "../icons/icons_pendapatan/Cash.jsx";
import Pasif from "../icons/icons_pendapatan/Pasif.jsx";
import SideJob from "../icons/icons_pendapatan/SideJob.jsx";
import Freelance from "../icons/icons_pendapatan/Freelance.jsx";
import FnB from "../icons/icons_pengeluaran/FnB.jsx";
import Pulsa from "../icons/icons_pengeluaran/Pulsa.jsx";
import Internet from "../icons/icons_pengeluaran/Internet.jsx";
import Bensin from "../icons/icons_pengeluaran/Bensin.jsx";
import Liburan from "../icons/icons_pengeluaran/Liburan.jsx";
import Kesehatan from "../icons/icons_pengeluaran/Kesehatan.jsx";
import Hiburan from "../icons/icons_pengeluaran/Hiburan.jsx";
import Kecantikan from "../icons/icons_pengeluaran/Kecantikan.jsx";
import Transportasi from "../icons/icons_pengeluaran/Transportasi.jsx";
import Pakaian from "../icons/icons_pengeluaran/Pakaian.jsx";
import Service from "../icons/icons_pengeluaran/Service.jsx";
import Pajak from "../icons/icons_pengeluaran/Pajak.jsx";
import Darurat from "../icons/icons_pengeluaran/Darurat.jsx";
import Pendidikan from "../icons/icons_pengeluaran/Pendidikan.jsx";
import Lainnya from "../icons/icons_pengeluaran/Lainnya.jsx";
import Tagihan from "../icons/icons_pengeluaran/Tagihan.jsx";
import Belanja from "../icons/icons_pengeluaran/Belanja.jsx";
import Investasi from "../icons/icons_pengeluaran/Investasi.jsx";
import Asuransi from "../icons/icons_pengeluaran/Asuransi.jsx";
import Profile from "../icons/Profile.jsx";
import WarningSpend from "./WarningSpend.jsx";
import apiData from "../Data/apiData.js";

export default function Headers({ setOverlay, setNewData }) {
  const [addBalance, setAddBalance] = useState(false);
  const [showAnimOut, setShowAnimOut] = useState(false);
  const [formPage, setFormPage] = useState(true);
  const [valuePayment, setValuePayment] = useState("cash");
  const [valueCategory, setValueCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const { shouldRefetch } = useAppStore();

  const token = localStorage.getItem("token");
  const { username } = token ? jwtDecode(token) : null;

  useEffect(() => {
    (async () => {
      const { total } = await apiData("pengeluaran/total");

      setTotal(total);
    })();
  }, [submitting, shouldRefetch]);

  const addBalanceHandle = (page) => {
    if (addBalance) setShowAnimOut(true);
    setAddBalance(!addBalance);
    if (formPage === page) return; // jangan apa-apa kalau sudah di halaman itu
    setFormPage(page);
  };

  // Function to switch between forms (income and expense)
  const switchFormHandle = (page) => {
    // Handle form submission logic here
    if (formPage === page) return; // jangan apa-apa kalau sudah di halaman itu
    setFormPage(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double submission
    setSubmitting(true);
    try {
      const fd = new FormData(e.target);
      const { admin, catatan, jumlah } = Object.fromEntries(fd.entries());
      const date = new Date();
      const payload = {
        users_id: username, // use decoded username from token
        tipe: formPage ? "Pemasukan" : "Pengeluaran",
        kategori: valueCategory,
        pembayaran: valuePayment,
        jumlah: Number(jumlah) || 0,
        admin: admin || "gratis",
        catatan: catatan || "",
        waktu: `${date.getHours()}:${date.getMinutes()}`,
        tanggal: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`,
      };
      const res = await apiData(null, null, "POST", payload);

      console.log("Transaction created:", res);
      // close form and optionally reset values
      setAddBalance(false);
      setShowAnimOut(false);
      setValueCategory("");
      setValuePayment("cash");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal menyimpan transaksi");
    } finally {
      setSubmitting(false);
      setNewData((prev) => !prev); // trigger re-fetch or update state
      setAddBalance(false); // close form after submission
      setOverlay(false); // close overlay after submission
    }
  };

  return (
    <>
      <div className="relative bg-primary py-4 ">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full ml-2 p-1 shadow-lg">
              <Profile />
              {/* <p className="text-black">hello</p> */}
            </div>
            <span className="text-xl">Hello {username}</span>
            <Logout />
          </div>
          <WarningSpend />
        </div>
        {/* Balance */}
        <div className="mt-8 mb-4 text-center">
          <p className="text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            Pengeluaran
          </p>
          <p className="text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            Rp{total}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-10 pt-8 pb-4">
          <button
            onClick={() => (addBalanceHandle(true), setOverlay(true))}
            className="flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-emerald-300"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={() => (addBalanceHandle(false), setOverlay(true))}
            className="flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-emerald-300"
          >
            <Minus size={24} />
          </button>
        </div>
      </div>
      {/* wave vektor */}
      <div className="-mt-1">
        <img
          src="../src/assets/Vector.svg"
          alt="wave vektor"
          className="w-full"
        />
      </div>
      {/* addBalance */}
      {(addBalance || showAnimOut) && (
        <div
          className={`${
            addBalance ? "animate-fadeInUp" : "animate-fadeInDown"
          }  absolute z-10 h-auto overflow-hidden  left-0 right-0 bottom-0 bg-black p-4 rounded-t-3xl `}
          onAnimationEnd={() => {
            if (!addBalance) setShowAnimOut(false);
          }}
        >
          {/* button close */}
          <div className="flex justify-center">
            <button
              className="w-1/4 h-2 rounded-full bg-[#D9D9D9]/50"
              onClick={() => (addBalanceHandle(false), setOverlay(false))}
            ></button>
          </div>
          {/* handlePageForm */}
          <div className="flex mx-auto gap-4 bg-[#222] rounded-md mt-4 w-fit p-1 ">
            <button
              onClick={() => switchFormHandle(true)}
              className={` font-medium transition-all duration-300 ease-in-out px-1.5  ${
                formPage
                  ? " border-[#00CBA9] text-[#00CBA9] bg-black rounded-md border-b-1"
                  : "text-[#B6B09F]/50 border-b-1 border-[#B6B09F]/50"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => switchFormHandle(false)}
              className={` font-medium transition-all duration-300 ease-in-out px-1.5 ${
                !formPage
                  ? " border-[#B12C00] text-[#B12C00] bg-black rounded-md border-b-1"
                  : "text-[#B6B09F]/50 border-b-1 border-[#B6B09F]/50"
              }`}
            >
              Pengluaran
            </button>
          </div>
          {/* form /-*/}
          {formPage ? (
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
                  className="w-full border-2 border-[#00B89F] text-white hover:text-black font-medium rounded-md p-2 mt-16 hover:bg-[#00B89F] transition-colors duration-300"
                >
                  Simpan
                </button>
              </form>
            </div>
          ) : (
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
                  className="w-full border-2 border-[#B12C00] text-white hover:text-black font-medium rounded-md p-2 mt-16 hover:bg-[#B12C00] transition-colors duration-300"
                >
                  Simpan
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
