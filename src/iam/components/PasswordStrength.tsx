import { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { strength, percentage, colorClass, label } = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    
    const pct = (s / 5) * 100;
    const color = s <= 2 ? 'bg-red-500' : s <= 3 ? 'bg-yellow-500' : 'bg-green-500';
    const lbl = s <= 2 ? 'Débil' : s <= 3 ? 'Media' : 'Fuerte';

    return { strength: s, percentage: pct, colorClass: color, label: lbl };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Seguridad:</span>
        <span className={`font-medium ${strength <= 2 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {label}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-none ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
