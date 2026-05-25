import { useLocation, useNavigate } from 'react-router-dom';

export const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoice = state?.invoiceData;

  const fmt = (val) => `$${parseFloat(val || 0).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-sm overflow-hidden">

        {/* Green header */}
        <div
          className="relative px-6 pt-8 pb-12 text-center"
          style={{ background: 'linear-gradient(160deg, #3B6D11 0%, #639922 100%)' }}
        >
          {/* Check icon */}
          <div className="w-[68px] h-[68px] rounded-full border-2 border-white/40 bg-white/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9l4 4 6-7" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-lg font-medium text-white mb-1">ការទូទាត់ជោគជ័យ!</h1>
          <p className="text-xs text-white/60">វិក្កយបត្រត្រូវបានបង្កើតរួចរាល់</p>

          {/* Wave cutout */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 340 32"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0 32 C60 10, 120 0, 170 16 C220 32, 280 20, 340 8 L340 32 Z" fill="white"/>
          </svg>
        </div>

        {/* Receipt body */}
        <div className="px-6 pb-6 pt-2">

          {/* Invoice number */}
          <div className="text-center mb-5">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">វិក្កយបត្រ</p>
            <p className="text-base font-medium text-gray-800">{invoice?.invoice_no ?? '—'}</p>
          </div>

          {/* Rows */}
          <div className="border-t-2 border-dashed border-gray-200 pt-4 flex flex-col gap-3">
            <Row label="តម្លៃសរុប" value={fmt(invoice?.total_amount)} />
            <Row label="បានទទួល"  value={fmt(invoice?.total_paid)} />

            {/* Change — highlighted */}
            <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-2.5">
              <span className="text-sm text-green-700">ប្រាក់អាប់</span>
              <span className="text-base font-medium text-green-700">
                {fmt(invoice?.change_amount)}
              </span>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="mt-5 w-full py-3.5 rounded-[14px] text-sm font-medium text-green-50 transition-colors"
            style={{ background: '#639922' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3B6D11'}
            onMouseLeave={e => e.currentTarget.style.background = '#639922'}
          >
            ត្រឡប់ទៅដើម
          </button>
        </div>

      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value ?? '—'}</span>
  </div>
);