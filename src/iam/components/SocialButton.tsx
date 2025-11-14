interface SocialButtonProps {
  provider: "google" | "apple";
  onClick?: () => void;
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
      <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
      <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49L4.405 11.9z" fill="#FBBC05"/>
      <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 15 18" fill="none">
      <path d="M12.464 9.654c-.03-2.546 2.074-3.775 2.168-3.835-1.183-1.731-3.023-1.968-3.678-1.994-1.563-.16-3.054.922-3.848.922-.794 0-2.018-.897-3.318-.874-1.706.024-3.278 .994-4.157 2.52-1.773 3.075-.453 7.63 1.273 10.123.845 1.22 1.85 2.592 3.17 2.544 1.274-.051 1.755-.825 3.294-.825 1.539 0 1.973.825 3.318.799 1.37-.023 2.236-1.236 3.072-2.461.967-1.416 1.366-2.784 1.39-2.854-.03-.014-2.666-1.024-2.684-4.065z" fill="currentColor"/>
    </svg>
  );
}

export function SocialButton({ provider, onClick }: SocialButtonProps) {
  const text = provider === "google" 
    ? "Google" 
    : "Apple";
  
  const Icon = provider === "google" ? GoogleIcon : AppleIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2.5">
        <Icon />
        <span className="font-medium text-gray-700">
          {text}
        </span>
      </div>
    </button>
  );
}
