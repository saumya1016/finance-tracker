import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, Loader2, ShieldCheck, LogOut, KeyRound, ChevronRight } from 'lucide-react';
import * as api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [showPassChange, setShowPassChange] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', otp: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const handleChangePassword = async () => {
    try {
      if (!showOtp) {
        await api.sendOtp({ email: user.email, type: 'forgot' });
        setShowOtp(true);
      } else {
        await api.forgotPassword({ 
          email: user.email, 
          otp: passwordData.otp, 
          newPassword: passwordData.newPassword 
        });
        alert("Security updated successfully!");
        setShowPassChange(false);
        setShowOtp(false);
        setPasswordData({ newPassword: '', otp: '' });
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Action failed");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-32 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-medium animate-pulse">Syncing profile data...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200 border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-lg">
            <div className="bg-slate-100 p-4 rounded-xl text-blue-600">
              <User size={48} />
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user.username}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Info Cards */}
            <div className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-slate-700 font-semibold">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${showPassChange ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm ${showPassChange ? 'text-blue-600' : 'text-slate-400'}`}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security</p>
                    <p className="text-slate-700 font-semibold">••••••••••••</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPassChange(!showPassChange)}
                  className="px-4 py-2 bg-white text-blue-600 font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all border border-blue-50"
                >
                  {showPassChange ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPassChange && (
                <div className="mt-6 pt-6 border-t border-blue-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <input 
                      type="password" placeholder="New Password" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  
                  {showOtp && (
                    <div className="relative animate-in zoom-in-95">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                      <input 
                        type="text" placeholder="6-Digit OTP" 
                        className="w-full pl-10 pr-4 py-4 bg-white border-2 border-blue-500 rounded-xl font-black text-center text-xl tracking-[0.3em] outline-none" 
                        value={passwordData.otp}
                        onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                      />
                    </div>
                  )}

                  <button 
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                  >
                    {showOtp ? 'Update Password' : 'Send Verification OTP'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-10 py-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm bg-red-50/50 rounded-2xl border border-red-100 hover:bg-red-50 transition-colors group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out from Session
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;