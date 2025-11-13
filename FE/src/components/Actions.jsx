export default function Actions () {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <button
        className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors"
        // onClick={params.onAddMoney}
      >
        Add Money
      </button>
      <button
        className="w-full bg-secondary text-white py-2 rounded-lg shadow-md hover:bg-secondary/90 transition-colors"
        // onClick={params.onSubtractMoney}
      >
        Send Money
      </button>
    </div>
  );
}