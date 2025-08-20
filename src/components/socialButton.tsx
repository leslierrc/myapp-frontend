// SocialLoginBar.tsx
import { motion, type Variants } from "framer-motion";
import { useState } from "react";

// --- Icons ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 4.48 16.347 2 12.48 2 6.48 2 2 6.48 2 12.48s4.48 10.48 10.48 10.48c6.08 0 10.48-4.48 10.48-10.48 0-.88-.08-1.72-.2-2.52H12.48z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.688-.069 4.849-.069zM12 0C8.741 0 8.335.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.335 0 8.741 0 12c0 3.259.014 3.665.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.282.058 1.688.072 4.947.072 3.259 0 3.665-.014 4.947-.072 4.359-.2 6.782-2.618 6.98-6.98.058-1.282.072-1.688.072-4.947 0-3.259-.014-3.665-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.282-.058-1.689-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

// --- Social Items ---
const socialItems = [
  {
    icon: <GoogleIcon />,
    label: "Google",
    href: "#",
    gradient: "radial-gradient(circle, rgba(234,67,53,0.2) 0%, rgba(234,67,53,0.08) 70%)",
    iconColor: "text-red-400",
  },
  {
    icon: <InstagramIcon />,
    label: "Instagram",
    href: "#",
    gradient: "radial-gradient(circle, rgba(225,48,108,0.2) 0%, rgba(193,53,132,0.1) 70%)",
    iconColor: "text-pink-400",
  },
  {
    icon: <FacebookIcon />,
    label: "Facebook",
    href: "#",
    gradient: "radial-gradient(circle, rgba(24,119,242,0.2) 0%, rgba(24,119,242,0.08) 70%)",
    iconColor: "text-blue-400",
  },
];

// --- Animations (corregidas) ---
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.8,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const sharedTransition: React.ComponentProps<typeof motion.div>["transition"] = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.4,
};

// --- Componente ---
export const SocialLoginBar = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
  
      <motion.nav
        className={`flex items-center gap-2 p-2 rounded-2xl backdrop-blur-lg border shadow-lg relative overflow-hidden ${
          isDark ? 'bg-gray-800/80 border-gray-700/40' : 'bg-white/80 border-gray-200/40'
        }`}
        initial="initial"
        whileHover="hover"
      >
        <motion.div
          className={`absolute -inset-2 rounded-3xl z-0 pointer-events-none ${
            isDark
              ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
              : 'bg-gradient-to-r from-blue-400/15 via-purple-400/15 to-pink-400/15'
          }`}
          variants={navGlowVariants}
        />

        {socialItems.map((item, index) => (
          <motion.div
            key={index}
            className="block rounded-xl overflow-visible group relative"
            style={{ perspective: "600px" }}
            whileHover="hover"
            initial="initial"
          >
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none rounded-xl"
              variants={glowVariants}
              style={{
                background: item.gradient,
                opacity: 0,
              }}
            />

            <motion.a
              href={item.href}
              className="flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-colors relative z-10"
              variants={itemVariants}
              transition={sharedTransition}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
            >
              <span className="text-white">{item.icon}</span>
            </motion.a>

            <motion.a
              href={item.href}
              className="flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-colors absolute inset-0 z-10"
              variants={backVariants}
              transition={sharedTransition}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
            >
              <span className={item.iconColor}>{item.icon}</span>
            </motion.a>
          </motion.div>
        ))}
      </motion.nav>
  
  );
};