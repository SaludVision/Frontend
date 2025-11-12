interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const percentage = (strength / 5) * 100;

  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (strength <= 2) return "Débil";
    if (strength <= 3) return "Media";
    return "Fuerte";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Seguridad de la contraseña:</span>
        <span className={`font-medium ${
          strength <= 2 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getLabel()}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        {password.length < 8 && <p>• Al menos 8 caracteres</p>}
        {!/[A-Z]/.test(password) && <p>• Una mayúscula</p>}
        {!/[0-9]/.test(password) && <p>• Un número</p>}
        {!/[^a-zA-Z0-9]/.test(password) && <p>• Un carácter especial</p>}
      </div>
    </div>
  );
}
