import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  Edit,
  Archive,
  Heart,
  Ban,
  Send,
  FileText,
  X,
  ChevronDown,
  Trash2
} from 'lucide-react';
import ChildProfile from './ChildProfile';
import AddChildModal from './AddChildModal';
import { toast } from 'sonner';
import { exportToCSV } from '../../../../../utils/exportUtils';
import { importFromCSV } from '../../../../../utils/importUtils';

export default function ChildManagement({ children: propChildren, onAddChild, onUpdateChild, onRemoveChild }) {
  const fileInputRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    age: '',
    gender: '',
    healthCondition: '',
    availability: '',
    educationLevel: '',
    specialNeeds: '',
    adoptionStatus: ''
  });

  // Initialize children state
  const [children, setChildren] = useState(propChildren || []);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    try {
      const { default: api } = await import('../../../../../services/api');
      const res = await api.get('/adoption/children');
      if (res.data && res.data.ok) {
        // Map backend extra_details back into the main object for the frontend
        const backendChildren = res.data.data.map(child => {
          return {
            id: child.id,
            photo: child.profile_image || '🧸',
            name: child.child_name,
            nickname: child.extra_details?.nickname || '',
            age: child.age,
            gender: child.gender,
            healthStatus: child.health_condition || 'Good',
            education: child.extra_details?.education || '',
            availability: child.extra_details?.availability || 'Available',
            adoptionStatus: child.adoption_status || 'Ready',
            createdDate: new Date(child.created_at || Date.now()).toISOString().split('T')[0],
            ...child.extra_details
          };
        });
        setChildren(backendChildren);
      }
    } catch (err) {
      console.error('Failed to fetch children', err);
      toast.error('Failed to load children from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propChildren) {
      setChildren(propChildren);
      setLoading(false);
    } else {
      fetchChildren();
    }
  }, [propChildren]);

  const handleAddChild = async (childData) => {
    if (onAddChild) {
      onAddChild(childData);
    } else {
      try {
        const { default: api } = await import('../../../../../services/api');
        
        // Map frontend fields to backend
        const backendPayload = {
          child_name: childData.name,
          age: childData.age,
          gender: childData.gender,
          health_condition: childData.healthStatus,
          interests: childData.interests,
          short_description: childData.personalityType,
          adoption_status: childData.adoptionStatus,
          profile_image: childData.photo,
          // Extra details will be grabbed dynamically from the rest of childData
          ...childData
        };

        const res = await api.post('/adoption/children', backendPayload);
        if (res.data && res.data.ok) {
          toast.success(`Child ${childData.name} added successfully!`);
          fetchChildren(); // refresh the list
          setShowAddModal(false);
        } else {
          throw new Error(res.data.error || 'Failed to add child');
        }
      } catch (err) {
        console.error('Add child error', err);
        toast.error(err.response?.data?.error || err.message || 'Error adding child');
      }
    }
  };

  const handleRemoveChild = async (childId, reason) => {
    if (onRemoveChild) {
      onRemoveChild(childId, reason);
    } else {
      try {
        const { default: api } = await import('../../../../../services/api');
        const res = await api.delete(`/adoption/children/${childId}`);
        if (res.data && res.data.ok) {
          toast.success(`Child removed: ${reason}`);
          fetchChildren();
        } else {
          throw new Error('Failed to delete');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to remove child');
      }
    }
  };

  const handleUpdateChild = async (updatedChild) => {
    if (onUpdateChild) {
      onUpdateChild(updatedChild);
    } else {
      try {
        const { default: api } = await import('../../../../../services/api');
        
        const backendPayload = {
          child_name: updatedChild.name,
          age: updatedChild.age,
          gender: updatedChild.gender,
          health_condition: updatedChild.healthStatus,
          interests: updatedChild.interests,
          short_description: updatedChild.personalityType,
          adoption_status: updatedChild.adoptionStatus,
          profile_image: updatedChild.photo,
          ...updatedChild
        };

        const res = await api.put(`/adoption/children/${updatedChild.id}`, backendPayload);
        if (res.data && res.data.ok) {
          toast.success('Child profile updated successfully!');
          fetchChildren();
          setSelectedChild(null);
        } else {
          throw new Error('Failed to update');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to update child profile');
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      toast.info('Importing child data...');
      const parsedData = await importFromCSV(file);
      
      // Ensure each parsed row has an ID
      const newChildren = parsedData.map((child, index) => {
        return {
          id: child.id || `CH-IMP-${Date.now().toString().slice(-4)}-${index}`,
          ...child
        };
      });
      
      setChildren([...newChildren, ...children]);
      toast.success(`Successfully imported ${newChildren.length} child records!`);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error.message || 'Failed to import CSV');
    }
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         child.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         child.nickname.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAge = !filters.age ||
                      (filters.age === '0-5' && child.age <= 5) ||
                      (filters.age === '6-10' && child.age >= 6 && child.age <= 10) ||
                      (filters.age === '11-15' && child.age >= 11 && child.age <= 15) ||
                      (filters.age === '16+' && child.age >= 16);

    const matchesGender = !filters.gender || child.gender === filters.gender;
    const matchesHealth = !filters.healthCondition || child.healthStatus === filters.healthCondition;
    const matchesAvailability = !filters.availability || child.availability === filters.availability;
    const matchesAdoption = !filters.adoptionStatus || child.adoptionStatus === filters.adoptionStatus;

    return matchesSearch && matchesAge && matchesGender && matchesHealth && matchesAvailability && matchesAdoption;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      age: '',
      gender: '',
      healthCondition: '',
      availability: '',
      educationLevel: '',
      specialNeeds: '',
      adoptionStatus: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in process':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'trial bonding':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'adopted':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getHealthColor = (status) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (selectedChild) {
    return (
      <ChildProfile
        child={selectedChild}
        onClose={() => setSelectedChild(null)}
        onUpdate={handleUpdateChild}
        onRemove={handleRemoveChild}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Child Management</h1>
        <p className="text-gray-600 mt-1">Manage all child profiles and records</p>
      </div>

      {/* Top Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Child
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4" />
            Import Child Data
          </button>
          <button 
            onClick={() => exportToCSV(filteredChildren, 'child_reports.csv')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Reports
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter Children
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ID, or nickname..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
              <select
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ages</option>
                <option value="0-5">0-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Condition</label>
              <select
                value={filters.healthCondition}
                onChange={(e) => handleFilterChange('healthCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="In Process">In Process</option>
                <option value="Trial Bonding">Trial Bonding</option>
                <option value="Adopted">Adopted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                value={filters.educationLevel}
                onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="Preschool">Preschool</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
              <select
                value={filters.specialNeeds}
                onChange={(e) => handleFilterChange('specialNeeds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adoption Status</label>
              <select
                value={filters.adoptionStatus}
                onChange={(e) => handleFilterChange('adoptionStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Ready">Ready</option>
                <option value="Application Pending">Application Pending</option>
                <option value="Trial Period">Trial Period</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Children Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Nickname</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adoption Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{child.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                      {child.photo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{child.name}</div>
                    <div className="text-sm text-gray-500">{child.nickname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.age} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getHealthColor(child.healthStatus)}`}>
                      {child.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.education}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(child.availability)}`}>
                      {child.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(child.adoptionStatus)}`}>
                      {child.adoptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{child.createdDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedChild(child)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No children found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredChildren.length}</span> of{' '}
            <span className="font-medium">{children.length}</span> children
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <AddChildModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddChild}
        />
      )}
    </div>
  );
}
