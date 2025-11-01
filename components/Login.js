import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaGoogle, FaMicrosoft, FaEnvelope, FaUser, FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

export default function Login({ onClose }) {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleOAuthLogin = async (provider) => {
    if (!role) return setError('Select role first!');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!role || !email || !password) return setError('Fill all!');
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      if (result.error) throw result.error;
      const { user } = result.data;
      if (user) {
        await supabase.from('profiles').upsert({ user_id: user.id, role });
      }
      router.push(role === 'athlete' ? '/onboarding' : '/coach-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => setIsLogin(!isLogin);

  if (role) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
          <button onClick={onClose || (() => setRole(''))} className="absolute top-4 right-4"><FaTimes /></button>
          <h2 className="text-2xl font-bold mb-6 text-center">{role} Login</h2>
          {error && <p className="bg-red-500 p-3 rounded mb-4 text-center">{error}</p>}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleOAuthLogin('google')} disabled={loading} className="w-full flex items-center justify-center bg-red-500 py-3 rounded">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button onClick={() => handleOAuthLogin('azure')} disabled={loading} className="w-full flex items-center justify-center bg-blue-700 py-3 rounded">
              <FaMicrosoft className="mr-2" /> Microsoft
            </button>
          </div>
          <div className="text-center text-gray-300 mb-4">Or</div>
          <div className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 p-3 rounded" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 p-3 rounded" />
            <button onClick={handleEmailAuth} disabled={loading} className="w-full bg-blue-500 py-3 rounded">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          <button onClick={toggleAuthMode} className="w-full mt-4 text-blue-400">Switch to {isLogin ? 'Sign Up' : 'Sign In'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8">Athletrix</h1>
        <button onClick={() => handleRoleSelect('athlete')} className="w-full bg-blue-500 py-4 rounded mb-4 flex items-center justify-center">
          <FaUser className="mr-2" /> Athlete
        </button>
        <button onClick={() => handleRoleSelect('coach')} className="w-full border-2 border-white py-4 rounded flex items-center justify-center">
          <FaUser className="mr-2" /> Coach
        </button>
      </div>
    </div>
  );
}