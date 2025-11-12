import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { UploadAnalysis } from "../components/UploadAnalysis";
import { EditProfileModal } from "../components/EditProfileModal";
import { Activity, TrendingUp, FileText, Clock, AlertCircle, User, Calendar, CheckCircle2, XCircle } from "lucide-react";

interface DashboardPageProps {
  onLogout: () => void;
}

// Componentes de las diferentes secciones
function InicioContent() {
  const stats = [
    { icon: Activity, label: "Análisis Hoy", value: "12", color: "bg-blue-500" },
    { icon: FileText, label: "Reportes Generados", value: "89", color: "bg-purple-500" },
    { icon: TrendingUp, label: "Precisión IA", value: "98.5%", color: "bg-green-500" },
    { icon: Clock, label: "Tiempo Promedio", value: "3.2 min", color: "bg-orange-500" },
  ];

  const recentAnalysis = [
    { id: 1, patient: "Paciente #1245", type: "Radiografía", time: "Hace 5 min", status: "Completado" },
    { id: 2, patient: "Paciente #1246", type: "Tomografía", time: "Hace 15 min", status: "En proceso" },
    { id: 3, patient: "Paciente #1247", type: "Resonancia", time: "Hace 30 min", status: "Completado" },
    { id: 4, patient: "Paciente #1248", type: "Ecografía", time: "Hace 1 hora", status: "Completado" },
  ];

  const handleUploadComplete = (file: File, analysisType: string) => {
    console.log("Análisis completado:", file.name, analysisType);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">
          Panel de Análisis Médico
        </h1>
        <p className="text-gray-600">
          Análisis de imágenes médicas con inteligencia artificial
        </p>
      </div>

      {/* Upload Section - Destacado */}
      <UploadAnalysis onUploadComplete={handleUploadComplete} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Análisis Recientes
          </h2>
          <div className="space-y-3">
            {recentAnalysis.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{analysis.patient}</p>
                    <p className="text-sm text-gray-500">{analysis.type} • {analysis.time}</p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    analysis.status === "Completado"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {analysis.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-blue-900 mb-1">
              Sistema de IA operativo
            </h3>
            <p className="text-blue-700 text-sm">
              Todos los módulos de análisis están funcionando correctamente. Precisión actual: 98.5%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReportesContent() {
  const reports = [
    { 
      id: 1, 
      patient: "Paciente #1245", 
      type: "Radiografía de Tórax", 
      date: "12 Nov 2024",
      result: "Normal",
      status: "success"
    },
    { 
      id: 2, 
      patient: "Paciente #1243", 
      type: "Tomografía Cerebral", 
      date: "11 Nov 2024",
      result: "Requiere revisión",
      status: "warning"
    },
    { 
      id: 3, 
      patient: "Paciente #1240", 
      type: "Resonancia Magnética", 
      date: "10 Nov 2024",
      result: "Normal",
      status: "success"
    },
    { 
      id: 4, 
      patient: "Paciente #1238", 
      type: "Mamografía", 
      date: "9 Nov 2024",
      result: "Normal",
      status: "success"
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Reportes de Análisis</h1>
        <p className="text-gray-600">Historial completo de análisis realizados</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Paciente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tipo de Análisis</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Resultado</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{report.patient}</td>
                  <td className="px-6 py-4 text-gray-600">{report.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {report.result}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Ver Reporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NotificacionesContent() {
  const notifications = [
    { 
      id: 1, 
      title: "Análisis completado", 
      message: "El análisis de Radiografía de Tórax para Paciente #1245 ha finalizado",
      time: "Hace 5 min",
      type: "success",
      read: false
    },
    { 
      id: 2, 
      title: "Requiere atención", 
      message: "El análisis de Tomografía Cerebral necesita revisión médica",
      time: "Hace 1 hora",
      type: "warning",
      read: false
    },
    { 
      id: 3, 
      title: "Análisis completado", 
      message: "El análisis de Resonancia Magnética para Paciente #1240 ha finalizado",
      time: "Hace 2 horas",
      type: "success",
      read: true
    },
    { 
      id: 4, 
      title: "Sistema actualizado", 
      message: "Se ha actualizado el algoritmo de IA a la versión 2.5.1",
      time: "Hace 1 día",
      type: "info",
      read: true
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Notificaciones</h1>
        <p className="text-gray-600">Actualizaciones sobre tus análisis</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 ${
              notification.type === 'success' ? 'border-green-500' :
              notification.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            } ${!notification.read ? 'bg-blue-50/50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                notification.type === 'success' ? 'bg-green-100' :
                notification.type === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle2 className={`w-6 h-6 text-green-600`} />
                ) : notification.type === 'warning' ? (
                  <AlertCircle className={`w-6 h-6 text-yellow-600`} />
                ) : (
                  <AlertCircle className={`w-6 h-6 text-blue-600`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-gray-900 font-medium">{notification.title}</h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SoporteContent() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Centro de Soporte</h1>
        <p className="text-gray-600">Estamos aquí para ayudarte</p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl text-gray-900 mb-3">
            Sección en desarrollo
          </h2>
          <p className="text-gray-600 mb-6">
            Estamos trabajando en crear la mejor experiencia de soporte para ti. 
            Pronto podrás contactarnos directamente desde aquí.
          </p>
          <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Mientras tanto, puedes contactarnos:</strong>
            </p>
            <p className="text-sm text-gray-600">📧 Email: soporte@mediscania.com</p>
            <p className="text-sm text-gray-600">📞 Teléfono: +1 (800) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfilContent() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Cargar perfil del usuario desde localStorage
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleProfileUpdated = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Información profesional</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl mb-1">
                {userProfile?.name || "Usuario"}
              </h2>
              <p className="text-blue-100">
                {userProfile?.specialty || "Especialidad médica"}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="text-gray-900">{userProfile?.email || "correo@ejemplo.com"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Especialidad</p>
              <p className="text-gray-900">{userProfile?.specialty || "No especificada"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">DNI</p>
              <p className="text-gray-900">{userProfile?.dni || "No especificado"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">ID Profesional</p>
              <p className="text-gray-900">{userProfile?.professionalId || "No especificado"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Hospital / Centro Médico</p>
              <p className="text-gray-900">{userProfile?.hospital || "No especificado"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="text-gray-900">{userProfile?.phone || "No especificado"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="text-gray-900">Noviembre 2024</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeSection, setActiveSection] = useState("inicio");

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioContent />;
      case "reportes":
        return <ReportesContent />;
      case "notificaciones":
        return <NotificacionesContent />;
      case "soporte":
        return <SoporteContent />;
      case "perfil":
        return <PerfilContent />;
      default:
        return <InicioContent />;
    }
  };

  return (
    <DashboardLayout
      activeItem={activeSection}
      onNavigate={setActiveSection}
      onLogout={onLogout}
    >
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </DashboardLayout>
  );
}
