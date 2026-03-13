import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight, RefreshCcw, Wallet, ChevronLeft, AlertCircle } from 'lucide-react';
import * as api from '../services/api';

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); 
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    username: '', 
    otp: '' 
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 

    try {
      if (mode === 'login') {
        if (!showOtp) {
          // STEP 1: Verify Credentials
          const { data } = await api.signIn({ email: formData.email, password: formData.password });
          if (data.requiresOtp) {
            setShowOtp(true); 
          } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
          }
        } else {
          // STEP 2: Verify Login OTP
          const { data } = await api.verifyLoginOtp({ 
            email: formData.email, 
            otp: formData.otp 
          });
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        }
      } 
      // ... signup and forgot password logic remain the same
      else if (mode === 'signup') {
        if (!showOtp) {
          await api.sendOtp({ email: formData.email, type: 'signup' });
          setShowOtp(true);
        } else {
          const { data } = await api.signUp(formData);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        }
      } 
      else if (mode === 'forgot') {
        if (!showOtp) {
          await api.sendOtp({ email: formData.email, type: 'forgot' });
          setShowOtp(true);
        } else {
          await api.forgotPassword({ email: formData.email, otp: formData.otp, newPassword: formData.password });
          setMode('login');
          setShowOtp(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setShowOtp(false);
    setError('');
    setFormData({ email: '', password: '', username: '', otp: '' });
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
          <Wallet size={28} />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">FinTrack</span>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-white relative z-10 transition-all duration-500">
        
        {showOtp && (
          <button 
            onClick={() => { setShowOtp(false); setError(''); }}
            className="absolute top-6 left-6 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Edit Details
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? (showOtp ? 'Verify Login' : 'Welcome Back') : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {showOtp ? 'Check your email for the code.' : 
             mode === 'login' ? 'Enter your credentials to access your dashboard.' : 
             mode === 'signup' ? 'Join thousands of users tracking their wealth.' : 
             'Verify your identity to reset your password.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in fade-in zoom-in-95">
            <AlertCircle size={18} />
            <span className="text-xs font-bold tracking-tight">{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!showOtp && (
            <>
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="username" type="text" placeholder="Username" 
                    value={formData.username} onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium" 
                    required 
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  name="email" type="email" placeholder="Email Address" 
                  value={formData.email} onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium" 
                  required 
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  name="password" type="password" 
                  placeholder={mode === 'forgot' ? "New Password" : "Password"}
                  value={formData.password} onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium" 
                  required 
                />
              </div>
            </>
          )}
          
          {showOtp && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input 
                  name="otp" type="text" placeholder="6-Digit OTP" 
                  value={formData.otp} onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center font-bold tracking-[0.5em] text-xl text-blue-900 outline-none focus:border-blue-500 transition-all" 
                  required 
                />
              </div>
              <p className="text-xs text-blue-600 mt-2 text-center font-bold tracking-tight italic">Check your inbox for the code</p>
            </div>
          )}
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCcw className="animate-spin" size={20} /> : (
              <>
                {showOtp ? 'Verify Identity' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Get Started' : 'Update Password'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 text-sm font-medium">
          {!showOtp && (
            <button onClick={handleToggle} className="text-slate-500 hover:text-blue-600 transition-colors">
              {mode === 'login' ? (
                <>New here? <span className="text-blue-600 font-bold underline underline-offset-4">Create account</span></>
              ) : (
                <>Already a member? <span className="text-blue-600 font-bold underline underline-offset-4">Sign in</span></>
              )}
            </button>
          )}
          
          {mode === 'login' && !showOtp && (
            <button 
              onClick={() => {setMode('forgot'); setShowOtp(false); setError('');}} 
              className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>

      <footer className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; 2026 FinTrack Security
      </footer>
    </div>
  );
};

export default Auth;