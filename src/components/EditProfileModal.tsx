import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Save } from "lucide-react";
import { FormInput } from "./FormInput";
import { PrimaryButton } from "./PrimaryButton";
import { userService } from "../services/user.service";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onProfileUpdated: (profile: any) => void;
}

interface ProfileFormData {
  name: string;
  dni: string;
  specialty: string;
  hospital: string;
  phone: string;
}

export function EditProfileModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onProfileUpdated 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    dni: "",
    specialty: "",
    hospital: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userProfile && isOpen) {
      setFormData({
        name: userProfile.name || "",
        dni: userProfile.dni || "",
        specialty: userProfile.specialty || "",
        hospital: userProfile.hospital || "",
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (formData.dni && !/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }

    if (formData.phone && !/^\+?[\d\s()-]+$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      const updatedProfile = await userService.updateProfile({
        name: formData.name,
        dni: formData.dni,
        specialty: formData.specialty,
        hospital: formData.hospital,
        phone: formData.phone,
      });

      setSuccessMessage("Perfil actualizado correctamente");
      onProfileUpdated(updatedProfile);

      // Cerrar el modal después de 500ms
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ name: error.message || 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setSuccessMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
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
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      Editar Perfil
                    </h2>
                    <p className="text-sm text-blue-100">
                      Actualiza tu información profesional
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    label="DNI"
                    name="dni"
                    type="text"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={handleChange}
                    error={errors.dni}
                    showValidation
                  />

                  <FormInput
                    label="Especialidad médica"
                    name="specialty"
                    placeholder="Radiología, Medicina Interna, etc."
                    value={formData.specialty}
                    onChange={handleChange}
                    error={errors.specialty}
                    showValidation
                  />

                  <FormInput
                    label="Hospital / Centro médico"
                    name="hospital"
                    placeholder="Hospital Central"
                    value={formData.hospital}
                    onChange={handleChange}
                    error={errors.hospital}
                    showValidation
                  />

                  <FormInput
                    label="Teléfono de contacto"
                    name="phone"
                    type="tel"
                    placeholder="+51 987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    showValidation
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Nota:</strong> El correo electrónico y el ID profesional no pueden ser modificados. 
                    Si necesitas cambiarlos, contacta con soporte.
                  </p>
                </div>

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
                    <Save className="w-5 h-5" />
                    Guardar cambios
                  </PrimaryButton>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
