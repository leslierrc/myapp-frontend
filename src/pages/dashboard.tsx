import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HardDrive,
  Building,
  Wrench,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  ClipboardList,
  Loader2,
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  officeId: string;
  status: 'Active' | 'In Repair' | 'Inactive';
  createdAt?: string | Date;
}

interface Office {
  id: string;
  name: string;
}

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

interface Activity {
  id: string;
  action: 'create' | 'update' | 'delete' | 'move';
  assetName: string;
  fromOffice?: string | null;
  toOffice?: string | null;
  timestamp: string;
}

interface ActivityDisplay {
  id: string;
  text: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface OfficeWithCount {
  id: string;
  name: string;
  assetCount: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [offices, setOffices] = useState<OfficeWithCount[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(1); // Cambia cuando tengas endpoint de usuarios
  const [recentActivities, setRecentActivities] = useState<ActivityDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Cargar todos los activos
        const assetsRes = await fetch(`${API_URL}/api/assets`);
        if (!assetsRes.ok) throw new Error('Error al cargar activos');
        const assets: Asset[] = await assetsRes.json();

        // 2. Cargar oficinas
        const officesRes = await fetch(`${API_URL}/api/offices`);
        if (!officesRes.ok) throw new Error('Error al cargar oficinas');
        const officesData: Office[] = await officesRes.json();

        // 3. Procesar estadísticas
        const totalAssets = assets.length;
        const activeOffices = officesData.length;
        const inRepair = assets.filter((a) => a.status === 'In Repair').length;

        // Nuevos activos (últimos 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newAssets = assets.filter((a) => {
          const createdAt = a.createdAt ? new Date(a.createdAt) : new Date();
          return createdAt >= thirtyDaysAgo;
        }).length;

        // Contar activos por oficina
        const officesWithCount = officesData.map((office) => ({
          id: office.id,
          name: office.name,
          assetCount: assets.filter((a) => a.officeId === office.id).length,
        }));

        // 4. Cargar actividades reales del backend
        const activitiesRes = await fetch(`${API_URL}/api/activities`);
        if (!activitiesRes.ok) throw new Error('Error al cargar actividades');
        const activities: Activity[] = await activitiesRes.json();

        const formattedActivities = activities.map((act) => {
          let text = '';
          let Icon = CheckCircle2;
          let color = 'text-green-400';

          switch (act.action) {
            case 'create':
              text = `Asset '${act.assetName}' added to ${act.toOffice}.`;
              Icon = CheckCircle2;
              color = 'text-green-400';
              break;
            case 'update':
              text = `Asset '${act.assetName}' was updated.`;
              Icon = RefreshCw;
              color = 'text-blue-400';
              break;
            case 'delete':
              text = `Asset '${act.assetName}' was deleted from ${act.fromOffice}.`;
              Icon = XCircle;
              color = 'text-red-400';
              break;
            case 'move':
              text = `Asset '${act.assetName}' moved from ${act.fromOffice} to ${act.toOffice}.`;
              Icon = Building;
              color = 'text-yellow-400';
              break;
          }

          // Calcular tiempo relativo
          const now = new Date().getTime();
          const activityTime = new Date(act.timestamp).getTime();
          const diffInSeconds = Math.floor((now - activityTime) / 1000);

          let time = 'Just now';
          if (diffInSeconds < 60) {
            time = 'Just now';
          } else if (diffInSeconds < 3600) {
            time = `${Math.floor(diffInSeconds / 60)} min ago`;
          } else if (diffInSeconds < 86400) {
            time = `${Math.floor(diffInSeconds / 3600)} hour ago`;
          } else {
            time = `${Math.floor(diffInSeconds / 86400)} day ago`;
          }

          return {
            id: act.id,
            text,
            time,
            icon: Icon,
            color,
          };
        });

        // 5. Actualizar estados
        setStats([
          {
            label: 'Total Assets',
            value: totalAssets,
            icon: HardDrive,
            color: 'text-blue-400',
          },
          {
            label: 'Active Offices',
            value: activeOffices,
            icon: Building,
            color: 'text-green-400',
          },
          {
            label: 'Assets in Repair',
            value: inRepair,
            icon: Wrench,
            color: 'text-yellow-400',
          },
          {
            label: 'New Assets (Last 30 Days)',
            value: newAssets,
            icon: TrendingUp,
            color: 'text-purple-400',
          },
        ]);

        setOffices(officesWithCount);
        setRecentActivities(formattedActivities);
        setTotalUsers(totalUsers);
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-6 bg-red-900/20 rounded-2xl border border-red-700 mx-6">
        🛑 {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 px-6"
    >
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Welcome to your{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Asset Management
        </span>{' '}
        Dashboard
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">{stat.label}</h3>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-4xl font-extrabold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Oficinas */}
      <motion.div
        className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Building className="w-6 h-6 mr-3 text-blue-400" />
          Office Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office, index) => (
            <motion.div
              key={office.id}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{office.name}</h3>
              <p className="text-3xl font-bold text-blue-300">{office.assetCount}</p>
              <p className="text-sm text-gray-300">Assets assigned</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Usuarios */}
      <motion.div
        className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 shadow-lg mb-8 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Users className="w-6 h-6 mr-3 text-purple-300" />
          System Users
        </h2>
        <p className="text-5xl font-extrabold text-purple-200">{totalUsers}</p>
        <p className="text-gray-300 mt-2">Total registered users in the system</p>
      </motion.div>

      {/* Actividad Reciente */}
      <motion.div
        className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <ClipboardList className="w-6 h-6 mr-3 text-green-400" />
          Recent Activity
        </h2>
        <ul className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.li
              key={activity.id}
              className="flex items-center text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <activity.icon className={`w-5 h-5 mr-3 ${activity.color} flex-shrink-0`} />
              <span className="flex-1">{activity.text}</span>
              <span className="text-sm text-gray-500 ml-4">{activity.time}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;