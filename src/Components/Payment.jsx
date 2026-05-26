
const Payment = ({ isOpen, onClose, onSelectPaymentType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white p-6 rounded-[24px] shadow-2xl relative border border-gray-100 text-center font-sans">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 p-1 rounded-full shadow-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-lg font-bold text-[#d39352] mb-6 mt-2 tracking-wide">ជ្រើសរើសការទូទាត់</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSelectPaymentType("qr_code")} 
            className="bg-[#facc15] hover:bg-[#eab308] text-gray-800 text-sm font-bold py-4 px-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            ទូទាត់តាមQR
          </button>
          <button
            onClick={() => onSelectPaymentType("cash")} 
            className="bg-[#22d3ee] hover:bg-[#06b6d4] text-white text-sm font-bold py-4 px-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            ទូទាត់លុយសុទ្ធ
          </button>
        </div>

      </div>
    </div>
  );
};

export default Payment;