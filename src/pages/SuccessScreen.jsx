export const SuccessScreen = () => (
  <div className="min-h-screen bg-green-200 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl text-center">
      <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-white text-5xl">✓</span>
      </div>
      <h1 className="text-2xl font-bold mb-8">ការទូទាត់ទទួលបានជោគជ័យ</h1>
      
      <div className="border-t border-dashed border-gray-300 py-4 text-left space-y-2">
        <div className="flex justify-between"><span>Order #0001</span><span>Order #0001</span></div>
        <div className="flex justify-between font-bold"><span>Iced Americano</span><span>x9</span></div>
        <div className="flex justify-between pt-4 font-bold text-lg"><span>តម្លៃសរុប</span><span>9.00$</span></div>
      </div>
      
      <p className="mt-8 italic text-gray-600">សូមអរគុណសម្រាប់ការគាំទ្រ🙏</p>
    </div>
  </div>
);