import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginPage } from "./iam/pages/LoginPage";
import { RegisterPage } from "./iam/pages/RegisterPage";
import { DashboardPage } from "./dashboard/pages/DashboardPage";

type Page = "login" | "register" | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentPage("login");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentPage === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage 
              onNavigateToRegister={() => setCurrentPage("register")}
              onLoginSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}
        
        {currentPage === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterPage 
              onNavigateToLogin={() => setCurrentPage("login")}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </motion.div>
        )}

        {currentPage === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardPage onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
