import { useState } from "react";
import { motion } from "motion/react";
import { FormInput } from "../components/FormInput";
import { SocialButton } from "../components/SocialButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal";
import { ChevronDown, LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onNavigateToRegister, onLoginSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe
        });
        
        onLoginSuccess();
      } catch (err) {
        console.error("Error en login:", err);
        // El error ya se maneja en useAuth
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Iniciar sesión con ${provider} (no implementado)`);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-gray-600">
              Nos alegra verte nuevamente
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <FormInput
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              showValidation
            />

            <FormInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Recordarme
                </span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="pt-2">
              <PrimaryButton type="submit" loading={loading}>
                <LogIn className="w-5 h-5" />
                Iniciar sesión
              </PrimaryButton>
            </div>
          </form>

          {/* Social Login Section (Collapsible) */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowSocial(!showSocial)}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              <span>Otras opciones de inicio de sesión</span>
              <motion.div
                animate={{ rotate: showSocial ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{ 
                height: showSocial ? "auto" : 0,
                opacity: showSocial ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 pt-4">
                <SocialButton 
                  provider="google" 
                  onClick={() => handleSocialLogin("Google")} 
                />
                <SocialButton 
                  provider="apple" 
                  onClick={() => handleSocialLogin("Apple")} 
                />
              </div>
            </motion.div>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
