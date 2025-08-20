import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SocialLoginBar } from './socialButton';
import { Eye, EyeOff } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
}
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
    }));
    setParticles(arr);
  }, []);

  const validateFields = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };
    if (!username) {
      newErrors.username = 'El usuario es obligatorio';
      valid = false;
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/home');
    } catch {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden" 
    style={{ backgroundImage: "url('/img1.wallspic.com-triangulo-azul-rosa-morado-simetria-3840x3840.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {particles.map((p, i) => (
        <span key={i} className="absolute bg-white rounded-full opacity-50" style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px`, animation: `floatParticle ${p.duration}s linear infinite` }} />
      ))}

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-pink-500/10 blur-3xl animate-[move1_10s_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-pink-500/10 to-purple-500/10 blur-3xl animate-[move2_12s_infinite_alternate]" />
      </div>

      <style>{`@keyframes move1 {0% {transform: translate(-20px, -20px);} 100% {transform: translate(20px, 20px);}}
        @keyframes move2 {0% {transform: translate(20px, -20px);} 100% {transform: translate(-20px, 20px);}}
        @keyframes pulseGlow {0%, 100% {box-shadow: 0 0 10px #c084fc;} 50% {box-shadow: 0 0 25px #e879f9;}}
        @keyframes gradientShift {0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;}}
        @keyframes floatParticle {0% {transform: translateY(0);} 50% {transform: translateY(-20px);} 100% {transform: translateY(0);}}`}</style>

      <div 
        className="relative z-10 w-[380px] p-8 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg"
        style={{
    clipPath:
      'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)',
  }}
      >
        <h2 className="text-center text-white text-2xl font-bold mb-2 tracking-wider">LOGIN</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Ingresa tus credenciales</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Contraseña"
    className="w-full px-3 py-2 pr-10 rounded-md bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

          <button type="submit" className="w-full py-2 rounded-md  bg-white/10  text-white  font-semibold hover:shadow-[0_0_20px_#c084fc] transition animate-[pulseGlow_3s_infinite]">
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        <div className="flex justify-center gap-4">
       {/* Sección de botones sociales */}
<div className="flex justify-center gap-4 mt-2">
  <SocialLoginBar /> {/* o solo el <motion.nav> */}

</div>
        </div>
        <p className="mt-6 text-center text-gray-400 text-sm">
  ¿No tienes cuenta?{" "}
  <span
    onClick={() => navigate('/register')}
    className="text-purple-400 hover:underline cursor-pointer"
  >
    Regístrate
  </span>
</p>
      </div>
    </div>
  );
};

export default Login;
