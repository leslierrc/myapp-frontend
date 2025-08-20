import { motion } from 'framer-motion';

const AuthForm = ({
  title,
  children,
  onSubmit,
  footerText,
  footerLink,
  footerLinkText,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}) => {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-[#1c1c1e] border border-[#2d2d30] rounded-2xl px-8 py-10 shadow-2xl w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
          {title}
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          {children}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-green-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-md"
          >
            {title === 'Iniciar Sesión' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          {footerText}{' '}
          <a href={footerLink} className="text-purple-400 hover:underline">
            {footerLinkText}
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AuthForm;
