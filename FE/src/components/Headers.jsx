import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/store.js";
import Logout from "./Logout.jsx";
import { jwtDecode } from "jwt-decode";
import Profile from "../icons/Profile.jsx";
import WarningSpend from "./WarningSpend.jsx";
import apiData from "../api/apiData.js";
import FormPemasukan from "./FormPemasukan.jsx";
import FormPengeluaran from "./FormPengeluaran.jsx";

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
      await apiData(null, null, "POST", payload);

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
        <img src="/vector.svg" alt="wave-vektor" className="w-full" />
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
            <FormPemasukan
              handleSubmit={handleSubmit}
              valuePayment={valuePayment}
              setValuePayment={setValuePayment}
              valueCategory={valueCategory}
              setValueCategory={setValueCategory}
            />
          ) : (
            <FormPengeluaran
              handleSubmit={handleSubmit}
              valuePayment={valuePayment}
              setValuePayment={setValuePayment}
              valueCategory={valueCategory}
              setValueCategory={setValueCategory}
            />
          )}
        </div>
      )}
    </>
  );
}
