import React from "react";

const AdminPanel = () => {
  return (
    <div className="w-full p-6 md:p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Admin Paneli</h1>
      <p className="text-lg text-gray-700 mb-6">Hoş geldin, admin! Buradan site yönetimiyle ilgili işlemleri yapabilirsin.</p>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Kullanıcı Yönetimi</h2>
        <p className="text-gray-600">Buraya kullanıcı listesi, rol atama, istatistikler gibi admin işlemleri ekleyebilirsin.</p>
      </div>
    </div>
  );
};

export default AdminPanel; 