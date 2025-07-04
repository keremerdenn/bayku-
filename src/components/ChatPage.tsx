"use client";

import React, { useState } from "react";

// Avatar bileşeni - yerel SVG oluşturur
const Avatar = ({ name, size = 32, className = "" }: { name: string; size?: number; className?: string }) => {
  const colors = [
    '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        fontSize: `${Math.max(size * 0.4, 12)}px`
      }}
    >
      {initials}
    </div>
  );
};

const exampleUsers = [
  { name: "Ayşe" },
  { name: "Mehmet" },
  { name: "Zeynep" },
  { name: "Can" },
];
const currentUser = { name: "Ben" };

type Message = {
  text: string;
  type: string;
  sender: { name: string };
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Herkese selam! Matematik denemesi nasıl geçti?", type: "received", sender: exampleUsers[0] },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, type: "sent", sender: currentUser }]);
    setInput("");
    setTimeout(() => {
      const randomUser = exampleUsers[Math.floor(Math.random() * exampleUsers.length)];
      setMessages(msgs => [...msgs, { text: "Aynen, bence de öyle.", type: "received", sender: randomUser }]);
    }, 1200);
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></svg>
          Topluluk Sohbeti
        </h1>
        <p className="text-lg text-gray-600 mt-1">Diğer öğrencilerle sohbet et, motive ol!</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Sohbet Alanı */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm flex flex-col">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ minHeight: 300 }}>
            {messages.map((msg, i) =>
              msg.type === "sent" ? (
                <div key={i} className="flex justify-end">
                  <div className="chat-bubble-sent px-4 py-2 max-w-xs lg:max-w-md break-words">{msg.text}</div>
                </div>
              ) : (
                <div key={i} className="flex justify-start items-end space-x-2">
                  <Avatar name={msg.sender?.name} size={32} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{msg.sender?.name}</p>
                    <div className="chat-bubble-received px-4 py-2 max-w-xs lg:max-w-md break-words">{msg.text}</div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="p-4 border-t border-gray-200 bg-slate-50 rounded-b-2xl">
            <form onSubmit={handleSend} className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Mesajını yaz..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <button type="submit" className="bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 transition-colors focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
        {/* Aktif Kullanıcılar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aktif Kullanıcılar</h3>
          <ul className="space-y-3">
            {exampleUsers.map((user, i) => (
              <li key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="relative">
                  <Avatar name={user.name} size={40} />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <span className="font-medium text-slate-700">{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 