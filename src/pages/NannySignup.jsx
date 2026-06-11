import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const languageOptions = ['Bangla', 'English', 'Hindi', 'Arabic', 'Other']

export default function NannySignup(){
  const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      nationalId: '',
      nationality: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      password: '',
      confirmPassword: '',
      gender: '',
      workPreference: '',
      languagesSpoken: [],
      idFile: null,
      documentFile: null,
      agreeTerms: false,
    })
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
  const { authenticate } = useAuth() || {}

    const setField = (key, value) => {
      setForm(prev => ({ ...prev, [key]: value }))
    }

    const toggleLanguage = (language) => {
      setForm(prev => ({
        ...prev,
        languagesSpoken: prev.languagesSpoken.includes(language)
          ? prev.languagesSpoken.filter(item => item !== language)
          : [...prev.languagesSpoken, language]
      }))
    }

    const submit = async (e) => {
      e.preventDefault()

      if (form.password !== form.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      if (!form.agreeTerms) {
        alert('Please agree to the terms and conditions and privacy policy')
        return
      }

      setSubmitting(true)
      try {
        const payload = {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          role: 'nanny',
          phone: form.phone,
          dob: form.dob,
          nationalId: form.nationalId,
          nationality: form.nationality,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          gender: form.gender,
          workPreference: form.workPreference,
          languagesSpoken: form.languagesSpoken,
        }
        const res = await api.post('/auth/signup', payload)
        if (authenticate && res.data.token && res.data.user) {
          authenticate(res.data.token, res.data.user)
          navigate('/dashboard/nanny')
        } else {
          alert('Registered - please login')
          navigate('/login')
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed'
        alert(msg)
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-auth-splash px-4 py-10 sm:px-6 lg:px-8">
        <div className="auth-shape auth-shape-one" />
        <div className="auth-shape auth-shape-two" />

        <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Sign Up</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Create your account to get started with Minimate</h1>
          </div>

          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput label="First Name" placeholder="Enter first name" value={form.firstName} onChange={e => setField('firstName', e.target.value)} required />
              <FormInput label="Last Name" placeholder="Enter last name" value={form.lastName} onChange={e => setField('lastName', e.target.value)} required />
              <FormInput label="Email" type="email" placeholder="Enter email" value={form.email} onChange={e => setField('email', e.target.value)} required />
              <FormInput label="Phone" placeholder="Enter phone number" value={form.phone} onChange={e => setField('phone', e.target.value)} required />
              <FormInput label="Date of Birth" type="date" value={form.dob} onChange={e => setField('dob', e.target.value)} required />
              <FormInput label="National ID No" placeholder="Enter national ID number" value={form.nationalId} onChange={e => setField('nationalId', e.target.value)} required />
              <FormInput label="Nationality" placeholder="Enter nationality" value={form.nationality} onChange={e => setField('nationality', e.target.value)} required />
              <FormInput label="Address" placeholder="Enter address" value={form.address} onChange={e => setField('address', e.target.value)} required />
              <FormInput label="City" placeholder="Enter city" value={form.city} onChange={e => setField('city', e.target.value)} required />
              <FormInput label="State" placeholder="Enter state" value={form.state} onChange={e => setField('state', e.target.value)} required />
              <FormInput label="Zip Code" placeholder="Enter zip code" value={form.zipCode} onChange={e => setField('zipCode', e.target.value)} required />
              <FormInput label="Password" type="password" placeholder="Enter password" value={form.password} onChange={e => setField('password', e.target.value)} required />
              <FormInput label="Confirm Password" type="password" placeholder="Enter password again" value={form.confirmPassword} onChange={e => setField('confirmPassword', e.target.value)} required />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Gender</p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-700">
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

              <p className="text-sm font-semibold text-slate-700">Work Preference</p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-700">
                {['Live-in', 'Live-out', 'Both'].map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="workPreference"
                      value={option.toLowerCase().replace('-', '_')}
                      checked={form.workPreference === option.toLowerCase().replace('-', '_')}
                      onChange={e => setField('workPreference', e.target.value)}
                      className="h-4 w-4 border-slate-300 text-fuchsia-500 focus:ring-fuchsia-400"
                      required
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Languages Spoken</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {languageOptions.map(language => (
                  <label key={language} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.languagesSpoken.includes(language)}
                      onChange={() => toggleLanguage(language)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400"
                    />
                    <span>{language}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Verification Documents</p>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Upload ID</span>
                  <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
                    <input
                      type="file"
                      className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-400"
                      onChange={e => setField('idFile', e.target.files?.[0] || null)}
                      accept=".png,.jpg,.jpeg,.pdf"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Upload Document</span>
                  <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
                    <input
                      type="file"
                      className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-400"
                      onChange={e => setField('documentFile', e.target.files?.[0] || null)}
                      accept=".png,.jpg,.jpeg,.pdf"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
              <strong>Note:</strong> Your profile will be reviewed by our admin team before approval. This usually takes 24-48 hours.
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={e => setField('agreeTerms', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-fuchsia-500 focus:ring-fuchsia-400"
                required
              />
              <span>I agree to the terms and conditions and privacy policy.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mx-auto block rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>

          <Link to="/signup" className="mt-6 inline-flex text-sm font-bold text-cyan-700 transition hover:text-fuchsia-600">Back to roles</Link>
        </div>
      </div>
    )
  }
