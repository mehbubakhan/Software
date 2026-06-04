import { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';



export default function PaymentManagement() {
  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      transactionId: 'TXN-20260603-001',
      parentName: 'John & Mary Smith',
      amount: 500,
      paymentType: 'Application Fee',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      date: '2026-06-03',
      relatedApplication: 'APP-2024-001',
      invoiceNumber: 'INV-2026-001',
      receiptNumber: 'RCP-2026-001'
    },
    {
      id: 'PAY-002',
      transactionId: 'TXN-20260603-002',
      parentName: 'Williams Family',
      amount: 750,
      paymentType: 'Home Study Fee',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      date: '2026-06-03',
      relatedApplication: 'APP-2024-002',
      invoiceNumber: 'INV-2026-002',
      receiptNumber: 'RCP-2026-002'
    },
    {
      id: 'PAY-003',
      transactionId: 'TXN-20260602-003',
      parentName: 'Chen Family',
      amount: 300,
      paymentType: 'Documentation Fee',
      paymentMethod: 'Credit Card',
      status: 'Pending',
      date: '2026-06-02',
      relatedApplication: 'APP-2024-008',
      invoiceNumber: 'INV-2026-003'
    },
    {
      id: 'PAY-004',
      transactionId: 'TXN-20260602-004',
      parentName: 'Sarah Johnson',
      amount: 500,
      paymentType: 'Application Fee',
      paymentMethod: 'Check',
      status: 'Failed',
      date: '2026-06-02',
      relatedApplication: 'APP-2024-003',
      invoiceNumber: 'INV-2026-004'
    },
    {
      id: 'PAY-005',
      transactionId: 'TXN-20260601-005',
      parentName: 'Robert & Linda Garcia',
      amount: 1000,
      paymentType: 'Legal Fee',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      date: '2026-06-01',
      relatedApplication: 'APP-2024-005',
      invoiceNumber: 'INV-2026-005',
      receiptNumber: 'RCP-2026-005'
    },
    {
      id: 'PAY-006',
      transactionId: 'TXN-20260601-006',
      parentName: 'Michael Davis',
      amount: 200,
      paymentType: 'Processing Fee',
      paymentMethod: 'Cash',
      status: 'Completed',
      date: '2026-06-01',
      relatedApplication: 'APP-2024-006',
      invoiceNumber: 'INV-2026-006',
      receiptNumber: 'RCP-2026-006'
    },
    {
      id: 'PAY-007',
      transactionId: 'TXN-20260531-007',
      parentName: 'Anonymous Donor',
      amount: 5000,
      paymentType: 'Donation',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      date: '2026-05-31',
      invoiceNumber: 'INV-2026-007',
      receiptNumber: 'RCP-2026-007'
    },
    {
      id: 'PAY-008',
      transactionId: 'TXN-20260530-008',
      parentName: 'Thompson Family',
      amount: 500,
      paymentType: 'Application Fee',
      paymentMethod: 'Credit Card',
      status: 'Refunded',
      date: '2026-05-30',
      relatedApplication: 'APP-2024-010',
      invoiceNumber: 'INV-2026-008',
      receiptNumber: 'RCP-2026-008'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const paymentTypes = ['All', 'Application Fee', 'Processing Fee', 'Documentation Fee', 'Home Study Fee', 'Legal Fee', 'Donation'];
  const statusOptions = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];

  const statistics = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
    refunded: payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0),
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.relatedApplication?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || payment.status === selectedStatus;
    const matchesType = selectedType === 'All' || payment.paymentType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleVerifyPayment = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    if (payment.status === 'Completed') {
      toast.info('Payment is already verified');
      return;
    }

    setPayments(payments.map(p =>
      p.id === paymentId ? { ...p, status: 'Completed', receiptNumber: `RCP-${Date.now()}` } : p
    ));
    toast.success('Payment verified successfully');
  };

  const handleRefund = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    if (payment.status === 'Refunded') {
      toast.info('Payment is already refunded');
      return;
    }

    if (payment.status !== 'Completed') {
      toast.error('Only completed payments can be refunded');
      return;
    }

    if (window.confirm(`Are you sure you want to refund $${payment.amount} to ${payment.parentName}?`)) {
      setPayments(payments.map(p =>
        p.id === paymentId ? { ...p, status: 'Refunded' } : p
      ));
      toast.success(`Refund of $${payment.amount} processed successfully`);
    }
  };

  const handleGenerateInvoice = (payment: Payment) => {
    toast.success(`Generating invoice ${payment.invoiceNumber}...`);
    setTimeout(() => {
      toast.success(`Invoice ${payment.invoiceNumber} generated successfully`);
    }, 1500);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    if (!payment.receiptNumber) {
      toast.error('Receipt not available for this payment');
      return;
    }
    toast.success(`Downloading receipt ${payment.receiptNumber}...`);
    setTimeout(() => {
      toast.success(`Receipt ${payment.receiptNumber} downloaded successfully`);
    }, 1000);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-300';
      case 'Refunded': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      case 'Refunded': return <RefreshCcw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-1">Track and manage adoption-related payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${statistics.total.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${statistics.completed.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Completed Payments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${statistics.pending.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Pending Payments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-500 p-3 rounded-lg">
              <RefreshCcw className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${statistics.refunded.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Refunded Payments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by transaction ID, parent name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {paymentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Parent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{payment.transactionId}</p>
                      {payment.relatedApplication && (
                        <p className="text-xs text-blue-600">{payment.relatedApplication}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{payment.parentName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-semibold text-green-600">${payment.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{payment.paymentType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">{payment.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">{payment.date}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'Pending' && (
                        <button
                          onClick={() => handleVerifyPayment(payment.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Verify Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status === 'Completed' && (
                        <button
                          onClick={() => handleRefund(payment.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Refund"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleGenerateInvoice(payment)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Generate Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {payment.receiptNumber && (
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payments found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPayment(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <p className="text-gray-900 font-semibold">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment ID</label>
                  <p className="text-gray-900">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Parent Name</label>
                  <p className="text-gray-900">{selectedPayment.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-2xl font-bold text-green-600">${selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Type</label>
                  <p className="text-gray-900">{selectedPayment.paymentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusIcon(selectedPayment.status)}
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">{selectedPayment.date}</p>
                </div>
                {selectedPayment.relatedApplication && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Related Application</label>
                    <p className="text-blue-600 font-medium">{selectedPayment.relatedApplication}</p>
                  </div>
                )}
                {selectedPayment.invoiceNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Invoice Number</label>
                    <p className="text-gray-900">{selectedPayment.invoiceNumber}</p>
                  </div>
                )}
                {selectedPayment.receiptNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Receipt Number</label>
                    <p className="text-gray-900">{selectedPayment.receiptNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => handleGenerateInvoice(selectedPayment)}
                className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
              {selectedPayment.receiptNumber && (
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
