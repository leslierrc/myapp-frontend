import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
}

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
    }));
    setParticles(arr);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
      });
      alert('Registro exitoso. Inicia sesión.');
      navigate('/');
    } catch (error) {
      alert('Error al registrarte');
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
      style={{
        backgroundImage: "url('../../public/img1.wallspic.com-triangulo-azul-rosa-morado-simetria-3840x3840.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bg-white rounded-full opacity-50"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `floatParticle ${p.duration}s linear infinite`,
          }}
        />
      ))}

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-pink-500/10 blur-3xl animate-[move1_10s_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-pink-500/10 to-purple-500/10 blur-3xl animate-[move2_12s_infinite_alternate]" />
      </div>

      <style>{`
        @keyframes move1 {0% {transform: translate(-20px, -20px);} 100% {transform: translate(20px, 20px);}}
        @keyframes move2 {0% {transform: translate(20px, -20px);} 100% {transform: translate(-20px, 20px);}}
        @keyframes pulseGlow {0%, 100% {box-shadow: 0 0 10px #c084fc;} 50% {box-shadow: 0 0 25px #e879f9;}}
        @keyframes gradientShift {0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;}}
        @keyframes floatParticle {0% {transform: translateY(0);} 50% {transform: translateY(-20px);} 100% {transform: translateY(0);}}
      `}</style>

      <div
        className="relative z-10 w-[380px] p-8 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg"
        style={{
          clipPath: 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)',
        }}
      >
        <h2 className="text-center text-white text-2xl font-bold mb-2 tracking-wider">
          REGISTRO
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Crea tu cuenta
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

       <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Contraseña"
    className="w-full px-3 py-2 pr-10 rounded-md bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-white/10 text-white font-semibold hover:shadow-[0_0_20px_#c084fc] transition animate-[pulseGlow_3s_infinite]"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate('/')}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};
