import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import api from '../services/api'

const initialForm = {
  organizationName: '',
  email: '',
  contactNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  registrationNumber: '',
  document: null,
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  verifyRegistration: false,
  agreePolicies: false,
}

export default function OrphanageManagerSignup(){
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (!form.acceptTerms || !form.verifyRegistration || !form.agreePolicies) {
      alert('Please accept all required confirmations before continuing')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/auth/signup', {
        name: form.organizationName,
        email: form.email,
        password: form.password,
        role: 'orphanage_manager',
        organizationName: form.organizationName,
        contactNumber: form.contactNumber,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        registrationNumber: form.registrationNumber,
      })
      alert('Registered successfully. Please log in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-auth-splash px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-600">Sign Up</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Orphanage Manager / Adoption Registration</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Use the information below to create your orphanage manager account.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="Organization Name"
              labelClassName="text-slate-700"
              placeholder="Enter organization name"
              value={form.organizationName}
              onChange={e => setField('organizationName', e.target.value)}
              required
            />
            <FormInput
              label="Email"
              labelClassName="text-slate-700"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              required
            />
            <FormInput
              label="Contact Number"
              labelClassName="text-slate-700"
              placeholder="Enter contact number"
              value={form.contactNumber}
              onChange={e => setField('contactNumber', e.target.value)}
              required
            />
            <FormInput
              label="Registration Number"
              labelClassName="text-slate-700"
              placeholder="Enter registration number"
              value={form.registrationNumber}
              onChange={e => setField('registrationNumber', e.target.value)}
              required
            />
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Address</span>
            <textarea
              className="mt-2 block min-h-24 w-full rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-cyan-300 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
              placeholder="Enter complete address"
              value={form.address}
              onChange={e => setField('address', e.target.value)}
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <FormInput
              label="City"
              labelClassName="text-slate-700"
              placeholder="City"
              value={form.city}
              onChange={e => setField('city', e.target.value)}
              required
            />
            <FormInput
              label="State"
              labelClassName="text-slate-700"
              placeholder="State"
              value={form.state}
              onChange={e => setField('state', e.target.value)}
              required
            />
            <FormInput
              label="Pincode"
              labelClassName="text-slate-700"
              placeholder="Pincode"
              value={form.pincode}
              onChange={e => setField('pincode', e.target.value)}
              required
            />
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Upload Registration Document</span>
            <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-8 text-center text-sm text-slate-600">
              <input
                type="file"
                className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-violet-400"
                onChange={e => setField('document', e.target.files?.[0] || null)}
                accept=".png,.jpg,.jpeg,.pdf"
                required
              />
              <p className="mt-3 text-xs text-slate-500">PNG, JPG, JPEG, or PDF</p>
            </div>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="Password"
              labelClassName="text-slate-700"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={e => setField('password', e.target.value)}
              required
            />
            <FormInput
              label="Confirm Password"
              labelClassName="text-slate-700"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={e => setField('confirmPassword', e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={e => setField('acceptTerms', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-violet-500 focus:ring-violet-400"
                required
              />
              <span>I accept the terms and conditions.</span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.verifyRegistration}
                onChange={e => setField('verifyRegistration', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-violet-500 focus:ring-violet-400"
                required
              />
              <span>I acknowledge that my registration will be verified.</span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.agreePolicies}
                onChange={e => setField('agreePolicies', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-violet-500 focus:ring-violet-400"
                required
              />
              <span>I agree to the privacy and security policies and community guidelines.</span>
            </label>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <strong>Important:</strong> Orphanage registrations require manual verification by our team. You will receive an email within 3-5 business days regarding your application status.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mx-auto block rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3 font-bold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link to="/signup" className="font-bold text-violet-600 transition hover:text-fuchsia-600">
            Back to role selection
          </Link>
        </div>
      </div>
    </div>
  )
}
