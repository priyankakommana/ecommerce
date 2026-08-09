import React, { useState } from 'react';
import { UserProfile } from '../types';
import { API } from '../utils/api';

export interface WelcomeProps {
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onStartShopping: () => void;
}

export default function WelcomeView({ user, onLogin, onStartShopping }: WelcomeProps) {
  // Mode tracker to switch forms dynamically between Sign In or Sign Up layouts
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  // Form input field state managers
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // OTP Verification State Managers
  const [isOtpPending, setIsOtpPending] = useState<boolean>(false);
  const [receivedOtp, setReceivedOtp] = useState<string>('');

  // Execution workflow for logging into existing profiles
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please fill in both your registered email and password credentials.");
      return;
    }

    try {
      const userData = await API.signin(email, password);
      onLogin(userData); 
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Invalid authentication credentials.");
    }
  };

  // Execution workflow for requesting OTP for new profiles
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim() || !phone.trim() || !address.trim()) {
      alert("All fields are mandatory to build a secure marketplace profile.");
      return;
    }

    try {
      // Step One: Request backend mail engine to send dynamic OTP code to user's inbox
      await API.requestSignUpOtp(email);
      setIsOtpPending(true); // Switches view to reveal the OTP form
      alert("Verification code dispatched! Please check your mailbox folder.");
    } catch (err) {
      alert("Failed to send verification code to the entered email destination.");
    }
  };

  // Execution workflow for verifying OTP and creating the account in database
  const handleOtpVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivedOtp.trim() || receivedOtp.length !== 6) {
      alert("Please enter a valid 6-digit verification security token.");
      return;
    }

    try {
      // Step Two: Submit registration payload details along with user's inputted OTP code
      const verifiedProfile = await API.submitVerifiedSignup({
        name: fullName,
        email: email,
        phone: phone,
        address: address,
        password: password
      }, receivedOtp);
      
      onLogin(verifiedProfile); // Logs the user in and saves the session cache cleanly
      alert("Account activated successfully! Welcome to DP Products.");
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Invalid or expired OTP token credentials rejected.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6 animate-fade-in">
        <h2 className="text-3xl font-black text-indigo-600 tracking-tight">DP PRODUCTS</h2>
        
        {!user ? (
          /* STATE A: RENDER INTERACTIVE INPUT FORMS BASED ON USER SELECTION */
          <div className="space-y-4 text-left">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full mb-4">
              <button 
                type="button"
                onClick={() => {
                  setIsSignUpMode(false);
                  setIsOtpPending(false); // Reset OTP panel state if switching tabs
                }} 
                className={`flex-1 py-2 rounded-lg text-center transition ${!isSignUpMode ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
              >
                Sign In Gate
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsSignUpMode(true);
                  setIsOtpPending(false);
                }} 
                className={`flex-1 py-2 rounded-lg text-center transition ${isSignUpMode ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
              >
                Create Account
              </button>
            </div>

            {!isSignUpMode ? (
              /* FORM FLOW PANEL: SECURE ACCESSIBILITY SIGN IN BUTTON */
              <form onSubmit={handleSignInSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Username / Email Identifier</label>
                  <input 
                    type="email" 
                    placeholder="Enter registered email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Secure Account Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter system account password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition active:scale-95 shadow-lg text-xs mt-4"
                >
                  Sign In Access
                </button>
              </form>
            ) : (
              /* FORM FLOW PANEL: CHOOSE BETWEEN OTP VERIFICATION INPUT AND PARAMETER ENTRY INPUTS */
              isOtpPending ? (
                <form onSubmit={handleOtpVerificationSubmit} className="space-y-4 text-xs animate-fade-in text-left">
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center">
                    <p className="font-bold text-indigo-900">Account Security Verification</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Enter the 6-digit OTP code sent directly to <b>{email}</b></p>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Enter Verification OTP</label>
                    <input 
                      type="text" 
                      placeholder="------"
                      maxLength={6}
                      value={receivedOtp}
                      onChange={(e) => setReceivedOtp(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-black p-2 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition">
                    Validate Security Token & Open Store
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Full Legal Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter first and last name..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Active Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Contact Mobile Number</label>
                    <input 
                      type="text" 
                      placeholder="Enter 10-digit mobile line..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Geographical Shipping Address</label>
                    <textarea 
                      placeholder="Enter building number, area road, city location..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 border rounded-xl h-16 bg-slate-50 focus:bg-white focus:outline-indigo-600 resize-none text-slate-800"
                    />
                  </div>
                                    <div>
                    <label className="block text-slate-500 font-bold mb-1">Create Access Password</label>
                    <input 
                      type="password" 
                      placeholder="Build a resilient security key phrase..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600 text-slate-800"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition active:scale-95 shadow-lg text-xs mt-4"
                  >
                    Register Account & Login
                  </button>
                </form>
              )
            )}
          </div>
        ) : (
          /* STATE B: RENDER GREETING WITH LIVE ACCOUNT DATA */
          <div className="space-y-6">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Authenticated Session</p>
              <h3 className="text-xl font-black text-slate-800">Welcome, {user.name}!</h3>
              <p className="text-slate-400 text-[10px] mt-0.5 font-medium">{user.email}</p>
            </div>
            
            <button 
              type="button"
              onClick={onStartShopping}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition active:scale-95 shadow-lg text-xs tracking-wide"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

