import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ParentSignup(){
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    username: '',
    address: '',
    zipCode: '',
    phoneNumber: '',
    emergencyContactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    parentGuardianInfo: false,
    idVerification: null,
    childName: '',
    childDob: '',
    childAge: '',
    childGender: '',
    acceptTerms: false,
    privacyConsent: false,
  })
  const navigate = useNavigate()
  const { authenticate } = useAuth() || {}

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (!form.acceptTerms || !form.privacyConsent) {
      alert('Please accept the terms and privacy policy')
      return
    }

    try{
      const res = await api.post('/auth/signup', {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: 'parent',
        dob: form.dob,
        childName: form.childName || 'Child 1',
        childDob: form.childDob,
      })
      if (authenticate && res.data.token && res.data.user) {
        authenticate(res.data.token, res.data.user)
        navigate('/dashboard')
      } else {
        alert('Registered - proceed to login')
        navigate('/login')
      }
    }catch(err){ 
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed'
      alert(msg)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-auth-splash px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500">Sign Up</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Select the option that best describes you to get started</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the form below to create your parent account and share the details needed for child registration.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput label="First Name" placeholder="First name" value={form.firstName} onChange={e => setField('firstName', e.target.value)} required />
            <FormInput label="Last Name" placeholder="Last name" value={form.lastName} onChange={e => setField('lastName', e.target.value)} required />
            <FormInput label="Date of Birth" type="date" value={form.dob} onChange={e => setField('dob', e.target.value)} required />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Gender</span>
              <div className="mt-2 grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white/85 p-3 text-sm text-slate-700 shadow-sm">
                {['Male', 'Female', 'Other'].map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={option.toLowerCase()}
                      checked={form.gender === option.toLowerCase()}
                      onChange={e => setField('gender', e.target.value)}
                      className="h-4 w-4 border-slate-300 text-fuchsia-500 focus:ring-fuchsia-400"
                      required
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </label>
            <FormInput label="Username" placeholder="Username" value={form.username} onChange={e => setField('username', e.target.value)} required />
            <FormInput label="Address" placeholder="Address" value={form.address} onChange={e => setField('address', e.target.value)} required />
            <FormInput label="Zip Code" placeholder="12345" value={form.zipCode} onChange={e => setField('zipCode', e.target.value)} required />
            <FormInput label="Phone Number" placeholder="Phone number" value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} required />
            <FormInput label="Emergency Contact Number" placeholder="Emergency contact number" value={form.emergencyContactNumber} onChange={e => setField('emergencyContactNumber', e.target.value)} required />
            <FormInput label="Email" type="email" placeholder="Enter email" value={form.email} onChange={e => setField('email', e.target.value)} required />
            <FormInput label="Password" type="password" placeholder="Password" value={form.password} onChange={e => setField('password', e.target.value)} required />
            <FormInput label="Confirm Password" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setField('confirmPassword', e.target.value)} required />
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Profile Photo</span>
            <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-8 text-center text-sm text-slate-600 shadow-sm">
              <input
                type="file"
                className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-fuchsia-400"
                onChange={e => setField('profilePhoto', e.target.files?.[0] || null)}
                accept=".png,.jpg,.jpeg"
              />
              <p className="mt-3 text-xs text-slate-500">Click to upload or drag and drop</p>
            </div>
          </label>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Parent/Guardian Information</p>
                <p className="text-sm text-slate-500">Upload your identification for verification</p>
              </div>
              <input
                type="checkbox"
                checked={form.parentGuardianInfo}
                onChange={e => setField('parentGuardianInfo', e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400"
              />
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">ID Verification</span>
              <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
                <input
                  type="file"
                  className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-400"
                  onChange={e => setField('idVerification', e.target.files?.[0] || null)}
                  accept=".png,.jpg,.jpeg,.pdf"
                />
                <p className="mt-3 text-xs text-slate-500">Upload Government ID</p>
              </div>
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Child Information</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-slate-700">Child 1</p>
                <span className="text-xs font-semibold text-cyan-700">Age / Gender</span>
              </div>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <FormInput label="Child's Name" placeholder="Child's Name" value={form.childName} onChange={e => setField('childName', e.target.value)} required />
                <FormInput label="Date of Birth" type="date" value={form.childDob} onChange={e => setField('childDob', e.target.value)} required />
                <FormInput label="Age" type="number" placeholder="5" value={form.childAge} onChange={e => setField('childAge', e.target.value)} required />
              </div>
              <div className="mt-4">
                <span className="text-sm font-semibold text-slate-700">Gender</span>
                <div className="mt-2 flex flex-wrap gap-6 text-sm text-slate-700">
                  {['Male', 'Female'].map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="childGender"
                        value={option.toLowerCase()}
                        checked={form.childGender === option.toLowerCase()}
                        onChange={e => setField('childGender', e.target.value)}
                        className="h-4 w-4 border-slate-300 text-fuchsia-500 focus:ring-fuchsia-400"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700"
            >
              + Add Another Child
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={e => setField('acceptTerms', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-fuchsia-500 focus:ring-fuchsia-400"
                required
              />
              <span>I Agree Terms And Condition Policy</span>
            </label>
            <p className="text-xs leading-6 text-slate-500">
              Yes, I want to receive important updates, including the latest schedules and fitness classes through Email/SMS, in accordance with your Privacy Policy
            </p>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.privacyConsent}
                onChange={e => setField('privacyConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-400 text-fuchsia-500 focus:ring-fuchsia-400"
                required
              />
              <span>I agree to the privacy policy and communication preferences.</span>
            </label>
          </div>

          <button className="mt-2 w-full rounded-xl bg-gradient-to-r from-rose-400 to-orange-400 px-5 py-3 font-bold text-white shadow-lg shadow-rose-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl" type="submit">
            Sign Up
          </button>
        </form>
        <Link to="/signup" className="mt-5 inline-flex text-sm font-bold text-cyan-700 transition hover:text-fuchsia-600">Back to roles</Link>
      </div>
    </div>
  )
}
