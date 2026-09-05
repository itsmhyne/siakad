export default function DashboardHome() {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Hari Ini</h1>
        
        {/* Card Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Siswa</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">1,240</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Hadir Hari Ini</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">1,180</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Terlambat</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">12</p>
          </div>
  
        </div>
      </div>
    );
  }