import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, CheckCircle2, ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { FormInput } from "./FormInput";
import { PrimaryButton } from "./PrimaryButton";
import { PasswordStrength } from "./PasswordStrength";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "email" | "change-password" | "success";

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ModalStep>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError("El correo electrónico es requerido");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswordChange = (): boolean => {
    let isValid = true;

    if (!newPassword) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Debes confirmar tu contraseña");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setLoading(true);

    // Simular validación con el backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Aquí conectarás con tu API Gateway para verificar si el email existe:
    // try {
    //   const response = await fetch('TU_API_GATEWAY_URL/auth/verify-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    //   });
    //   const data = await response.json();
    //   
    //   if (response.ok && data.exists) {
    //     setStep("change-password");
    //   } else {
    //     setEmailError('No existe una cuenta asociada a este correo electrónico');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   setEmailError('Hubo un error. Por favor intenta nuevamente.');
    // }

    // Simulación: Por ahora siempre encuentra el email
    const emailExists = true; // Simula que el email existe
    
    setLoading(false);

    if (emailExists) {
      setStep("change-password");
    } else {
      setEmailError("No existe una cuenta asociada a este correo electrónico");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordChange()) return;

    setLoading(true);

    // Simular cambio de contraseña
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Contraseña cambiada para:", email);

    // Aquí conectarás con tu API Gateway para cambiar la contraseña:
    // try {
    //   const response = await fetch('TU_API_GATEWAY_URL/auth/reset-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       email,
    //       newPassword 
    //     })
    //   });
    //   const data = await response.json();
    //   
    //   if (response.ok) {
    //     setStep("success");
    //   } else {
    //     setPasswordError('Error al cambiar la contraseña. Intenta nuevamente.');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   setPasswordError('Hubo un error. Por favor intenta nuevamente.');
    // }

    setLoading(false);
    setStep("success");
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) {
      setConfirmPasswordError("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Email Verification */}
                {step === "email" && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
                      <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl">
                            Recuperar Contraseña
                          </h2>
                          <p className="text-sm text-blue-100">
                            Verifica tu cuenta
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleEmailSubmit} className="p-6 space-y-5">
                      <p className="text-gray-600 text-sm">
                        Ingresa el correo electrónico asociado a tu cuenta para continuar.
                      </p>

                      <FormInput
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                        showValidation
                      />

                      <div className="flex gap-3 pt-2">
                        <PrimaryButton
                          type="button"
                          onClick={handleClose}
                          variant="secondary"
                          className="flex-1"
                        >
                          Cancelar
                        </PrimaryButton>
                        <PrimaryButton
                          type="submit"
                          loading={loading}
                          className="flex-1"
                        >
                          Verificar
                        </PrimaryButton>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Step 2: Change Password */}
                {step === "change-password" && (
                  <motion.div
                    key="change-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative">
                      <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl">
                            Nueva Contraseña
                          </h2>
                          <p className="text-sm text-purple-100">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">
                          Cuenta verificada. Ahora puedes establecer una nueva contraseña.
                        </p>
                      </div>

                      <FormInput
                        label="Nueva contraseña"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        error={passwordError}
                      />

                      {newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <PasswordStrength password={newPassword} />
                        </motion.div>
                      )}

                      <FormInput
                        label="Confirmar contraseña"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={confirmPasswordError}
                        showValidation
                      />

                      <div className="flex gap-3 pt-2">
                        <PrimaryButton
                          type="button"
                          onClick={() => setStep("email")}
                          variant="secondary"
                          className="flex-1"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Atrás
                        </PrimaryButton>
                        <PrimaryButton
                          type="submit"
                          loading={loading}
                          className="flex-1"
                        >
                          Cambiar contraseña
                        </PrimaryButton>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </motion.div>

                    <h3 className="text-2xl text-gray-900 mb-3">
                      ¡Contraseña actualizada!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tu contraseña ha sido cambiada exitosamente.
                      Ya puedes iniciar sesión con tu nueva contraseña.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-900 mb-2">
                        <strong>Recordatorio de seguridad:</strong>
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1 text-left list-disc list-inside">
                        <li>No compartas tu contraseña con nadie</li>
                        <li>Usa contraseñas diferentes para cada servicio</li>
                        <li>Actualiza tu contraseña periódicamente</li>
                      </ul>
                    </div>

                    <PrimaryButton
                      onClick={handleClose}
                      className="w-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Iniciar sesión
                    </PrimaryButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
