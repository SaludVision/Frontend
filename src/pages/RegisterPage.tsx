import { useState } from "react";
import { motion } from "motion/react";
import { FormInput } from "../components/FormInput";
import { SocialButton } from "../components/SocialButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { PasswordStrength } from "../components/PasswordStrength";
import { ChevronDown, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
  specialty: string;
  professionalId: string;
  hospital: string;
  phone: string;
}

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({ onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    specialty: "",
    professionalId: "",
    hospital: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [showSocial, setShowSocial] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre completo es requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es requerido";
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = "La especialidad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.professionalId.trim()) {
      newErrors.professionalId = "El ID profesional es requerido";
    }

    if (!formData.hospital.trim()) {
      newErrors.hospital = "El hospital/centro médico es requerido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Ingresa un teléfono válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep2()) {
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dni: formData.dni,
          specialty: formData.specialty,
          professionalId: formData.professionalId,
          hospital: formData.hospital,
          phone: formData.phone,
        });
        
        // Si el registro fue exitoso, redirigir al login
        onNavigateToLogin();
      } catch (err) {
        console.error("Error en registro:", err);
        // El error ya se maneja en useAuth
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Registro con ${provider} (no implementado)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              Registro Profesional
            </h1>
            <p className="text-gray-600">
              Únete a MediScanIA - Análisis médico con IA
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                Información profesional
              </span>
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: currentStep === 2 ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                Seguridad y contacto
              </span>
            </div>
          </div>

          {/* Social Login Section (Collapsible) */}
          {currentStep === 1 && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowSocial(!showSocial)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
              >
                <span>Registro rápido con redes sociales</span>
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
                <div className="flex gap-3 pt-4 pb-4">
                  <SocialButton 
                    provider="google" 
                    onClick={() => handleSocialLogin("Google")} 
                  />
                  <SocialButton 
                    provider="apple" 
                    onClick={() => handleSocialLogin("Apple")} 
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">O continúa con el formulario</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Step 1: Professional Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <FormInput
                label="Nombre completo"
                name="name"
                placeholder="Dr. Juan Pérez"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                showValidation
              />

              <FormInput
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="doctor@hospital.com"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                showValidation
              />

              <FormInput
                label="DNI"
                name="dni"
                type="text"
                placeholder="12345678"
                required
                value={formData.dni}
                onChange={handleChange}
                error={errors.dni}
                showValidation
              />

              <FormInput
                label="Especialidad médica"
                name="specialty"
                placeholder="Radiología, Medicina Interna, etc."
                required
                value={formData.specialty}
                onChange={handleChange}
                error={errors.specialty}
                showValidation
              />

              <div className="pt-2">
                <PrimaryButton type="button" onClick={handleNextStep}>
                  Continuar
                </PrimaryButton>
              </div>
            </motion.div>
          )}

          {/* Step 2: Security and Contact */}
          {currentStep === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
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

              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <PasswordStrength password={formData.password} />
                </motion.div>
              )}

              <FormInput
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                showValidation
              />

              <FormInput
                label="ID Profesional / Matrícula profesional"
                name="professionalId"
                placeholder="MP 12345"
                required
                value={formData.professionalId}
                onChange={handleChange}
                error={errors.professionalId}
                showValidation
              />

              <FormInput
                label="Hospital / Centro médico"
                name="hospital"
                placeholder="Hospital Central"
                required
                value={formData.hospital}
                onChange={handleChange}
                error={errors.hospital}
                showValidation
              />

              <FormInput
                label="Teléfono de contacto"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                required
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                showValidation
              />

              <div className="flex gap-3 pt-2">
                <PrimaryButton 
                  type="button" 
                  onClick={() => setCurrentStep(1)}
                  variant="secondary"
                >
                  Atrás
                </PrimaryButton>
                <PrimaryButton type="submit" loading={loading}>
                  <UserPlus className="w-5 h-5" />
                  Crear cuenta
                </PrimaryButton>
              </div>
            </motion.form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Al registrarte, aceptas nuestros términos y condiciones de uso profesional
        </p>
      </motion.div>
    </div>
  );
}
