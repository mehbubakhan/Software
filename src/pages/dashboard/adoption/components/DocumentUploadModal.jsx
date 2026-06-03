import { useState } from 'react';
import { X, Upload, FileText, Lock, Shield, Droplet, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';



export default function DocumentUploadModal({ onClose, onUpload }) {
  const [formData, setFormData] = useState({
    category: '',
    relatedTo: '',
    fileName: '',
    fileType: '',
    fileSize: '',
    encryption: true,
    virusScan: true,
    watermark: true,
    accessLog: true,
    temporaryURL: true,
    expiryDays: '365',
    description: ''
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    'Parent Documents',
    'Child Reports',
    'Medical Records',
    'Legal Documents',
    'Counselling Reports',
    'Meeting Reports'
  ];

  const allowedFileTypes = ['PDF', 'JPG', 'PNG', 'DOCX'];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';

      if (!allowedFileTypes.includes(fileExtension)) {
        toast.error(`File type .${fileExtension} is not allowed. Please upload ${allowedFileTypes.join(', ')} files only.`);
        return;
      }

      setSelectedFile(file);
      setFormData({
        ...formData,
        fileName: file.name,
        fileType: fileExtension,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !selectedFile) {
      toast.error('Please select a category and file to upload');
      return;
    }

    simulateUpload();

    // Simulate security checks
    setTimeout(() => {
      if (formData.encryption) {
        toast.success('File encrypted successfully');
      }
      if (formData.virusScan) {
        toast.success('Virus scan completed - File is clean');
      }
      if (formData.watermark) {
        toast.success('Watermark applied');
      }
    }, 1000);

    // Complete upload
    setTimeout(() => {
      onUpload(formData);
      toast.success('Document uploaded successfully');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to upload
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG, DOCX
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{formData.fileName}</span>
                      <span className="text-xs text-gray-500">({formData.fileSize})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Uploading...</span>
                  <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Category and Related Entity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related To (ID)
                </label>
                <input
                  type="text"
                  value={formData.relatedTo}
                  onChange={(e) => handleChange('relatedTo', e.target.value)}
                  placeholder="e.g., APP-2024-001, CH045"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Security Features
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Encryption</p>
                      <p className="text-xs text-gray-500">Encrypt file with AES-256</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.encryption}
                    onChange={(e) => handleChange('encryption', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Virus Scan</p>
                      <p className="text-xs text-gray-500">Scan for malware and viruses</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.virusScan}
                    onChange={(e) => handleChange('virusScan', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Droplet className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Watermark</p>
                      <p className="text-xs text-gray-500">Add security watermark to document</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.watermark}
                    onChange={(e) => handleChange('watermark', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Access Logs</p>
                      <p className="text-xs text-gray-500">Track all document access</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.accessLog}
                    onChange={(e) => handleChange('accessLog', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Temporary URLs</p>
                      <p className="text-xs text-gray-500">Generate time-limited access links</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.temporaryURL}
                    onChange={(e) => handleChange('temporaryURL', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Expiry Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Valid For (Days)
              </label>
              <input
                type="number"
                value={formData.expiryDays}
                onChange={(e) => handleChange('expiryDays', e.target.value)}
                min="1"
                max="3650"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Document will expire after this period</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Add any notes or description about this document..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
