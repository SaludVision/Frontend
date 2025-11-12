import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import { FormInput } from "./FormInput";
import { PrimaryButton } from "./PrimaryButton";
import { PasswordStrength } from "./PasswordStrength";
import { useAuth } from "../hooks/useAuth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "email" | "change-password" | "success";

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { verifyEmail, resetPassword } = useAuth();
  const [step, setStep] = useState<ModalStep>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = useCallback((email: string): boolean => {
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
  }, []);

  const validatePasswordChange = useCallback((): boolean => {
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
  }, [newPassword, confirmPassword]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setLoading(true);

    try {
      const response = await verifyEmail({ email });

      if (response.exists) {
        setStep("change-password");
      } else {
        setEmailError('No existe una cuenta asociada a este correo electrónico');
      }
    } catch (error: any) {
      console.error('Error al verificar email:', error);
      setEmailError(error.message || 'Hubo un error. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordChange()) return;

    setLoading(true);

    try {
      const res = await resetPassword({ email, newPassword });
      if (res && res.success) {
        setStep("success");
      } else {
        setPasswordError(res.message || 'Error al cambiar la contraseña. Intenta nuevamente.');
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      setPasswordError(error.message || 'Error al cambiar la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
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
            transition={{ duration: 0.1 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full min-h-[400px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 flex flex-col">
                {/* Step 1: Email Verification */}
                {step === "email" && (
                  <div className="flex flex-col h-full">
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
                  </div>
                )}

                {/* Step 2: Change Password */}
                {step === "change-password" && (
                  <div className="flex flex-col h-full">
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
                        <div>
                          <PasswordStrength password={newPassword} />
                        </div>
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
                  </div>
                )}

                {/* Step 3: Success */}
                {step === "success" && (
                  <div className="p-8 text-center flex-1 flex flex-col justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>

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
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
