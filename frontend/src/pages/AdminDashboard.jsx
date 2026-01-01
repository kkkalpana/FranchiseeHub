import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Users, FileText, LogOut, Award, 
  CheckCircle, XCircle, Clock, Search, X, Calendar, MapPin, Mail, Phone 
} from 'lucide-react';
import API_BASE_URL from '../config/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/admin/login');
    } else {
      fetchApplicants();
    }
  }, [navigate]);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/allApplicants`);
      if (response.data.status) {
        setApplicants(response.data.doc);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Award size={32} />
            <span className="text-xl font-bold">FranchiseHub</span>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/applications"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`
              }
            >
              <FileText size={20} />
              <span>Applications</span>
            </NavLink>

            <NavLink
              to="/admin/franchises"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`
              }
            >
              <Users size={20} />
              <span>Franchises</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="dashboard" element={<Dashboard applicants={applicants} />} />
          <Route path="applications" element={<Applications applicants={applicants} fetchApplicants={fetchApplicants} />} />
          <Route path="franchises" element={<Franchises applicants={applicants} />} />
          <Route path="*" element={<Dashboard applicants={applicants} />} />
        </Routes>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ applicants }) {
  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    accepted: applicants.filter(a => a.status === 'accepted').length,
    granted: applicants.filter(a => a.status === 'granted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Applications</span>
            <FileText className="text-blue-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pending</span>
            <Clock className="text-orange-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Accepted</span>
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Granted</span>
            <Award className="text-blue-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.granted}</div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
        <div className="space-y-3">
          {applicants.slice(0, 5).map((app) => (
            <div key={app._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">{app.fname} {app.lname}</div>
                <div className="text-sm text-gray-600">{app.email} • {app.site_city}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Applications Component  
function Applications({ applicants, fetchApplicants }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredApps = applicants.filter(app => {
    const matchesSearch = 
      app.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.site_city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || app.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleAction = async (email, action) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (action === 'accept') endpoint = '/admin/acceptApplicant';
      else if (action === 'reject') endpoint = '/admin/rejectApplicant';
      else if (action === 'grant') {
        endpoint = '/admin/grantApplicant';
        await axios.post(`${API_BASE_URL}${endpoint}`, { email });
        await axios.post(`${API_BASE_URL}/admin/saveFranchiseCred`, { email });
      } else {
        await axios.post(`${API_BASE_URL}${endpoint}`, { email });
      }
      
      if (action !== 'grant') {
        await axios.post(`${API_BASE_URL}${endpoint}`, { email });
      }
      
      await fetchApplicants();
      setSelectedApp(null);
      alert(`Application ${action}ed successfully`);
    } catch (error) {
      console.error('Error:', error);
      alert('Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Franchise Applications</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: 'All', count: applicants.length },
          { key: 'pending', label: 'Pending', count: applicants.filter(a => a.status === 'pending').length },
          { key: 'accepted', label: 'Accepted', count: applicants.filter(a => a.status === 'accepted').length },
          { key: 'granted', label: 'Granted', count: applicants.filter(a => a.status === 'granted').length },
          { key: 'rejected', label: 'Rejected', count: applicants.filter(a => a.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {app.fname} {app.lname}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.site_city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(app.doa).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(app.email, 'accept')}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(app.email, 'reject')}
                            disabled={loading}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => handleAction(app.email, 'grant')}
                            disabled={loading}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            Grant
                          </button>
                          <button
                            onClick={() => handleAction(app.email, 'reject')}
                            disabled={loading}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold">Applicant Details</h2>
                <p className="text-blue-100 text-sm">Complete application information</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">First Name</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.fname}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Last Name</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.lname}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Email</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Phone</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.phone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Franchise Location
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">City</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.site_city}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Postal Code</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.site_postal}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 font-semibold">Address</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.site_address}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Area (sq ft)</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.area_sqft}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Ownership</div>
                    <div className="text-sm font-medium text-gray-900">{selectedApp.ownership}</div>
                  </div>
                </div>
              </div>

              {/* Application Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  Application Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Date Applied</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(selectedApp.doa).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Status</div>
                      <div className="mt-1">
                        <StatusBadge status={selectedApp.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end border-t pt-4">
                {selectedApp.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleAction(selectedApp.email, 'accept');
                        setSelectedApp(null);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleAction(selectedApp.email, 'reject');
                        setSelectedApp(null);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedApp.status === 'accepted' && (
                  <>
                    <button
                      onClick={() => {
                        handleAction(selectedApp.email, 'grant');
                        setSelectedApp(null);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Grant Franchise
                    </button>
                    <button
                      onClick={() => {
                        handleAction(selectedApp.email, 'reject');
                        setSelectedApp(null);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Franchises Component
function Franchises({ applicants }) {
  const grantedFranchisees = applicants.filter(a => a.status === 'granted');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Active Franchises</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grantedFranchisees.map((franchisee) => (
            <div key={franchisee._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {franchisee.fname.charAt(0)}{franchisee.lname.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{franchisee.fname} {franchisee.lname}</div>
                  <div className="text-sm text-gray-600">{franchisee.site_city}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} />
                  <span>{franchisee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} />
                  <span>{franchisee.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} />
                  <span>{franchisee.site_address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {grantedFranchisees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active franchises yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const badges = {
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-700' },
    accepted: { label: 'Accepted', className: 'bg-green-100 text-green-700' },
    granted: { label: 'Granted', className: 'bg-blue-100 text-blue-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  };

  const badge = badges[status] || badges.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
}

export default AdminDashboard;
