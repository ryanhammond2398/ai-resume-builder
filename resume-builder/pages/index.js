import { useState, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [step, setStep] = useState(1)
  const [activeTab, setActiveTab] = useState('resume')
  const [generating, setGenerating] = useState(false)
  const [genMsg, setGenMsg] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [clText, setClText] = useState('')
  const [clGenerated, setClGenerated] = useState(false)
  const [experiences, setExperiences] = useState([{ id: 1, company: '', role: '', dates: '', achievements: '' }])
  const [copied, setCopied] = useState('')

  const [form, setForm] = useState({
    name: '', target: '', email: '', phone: '', location: '',
    skills: '', degree: '', school: '', jobDescription: ''
  })

  const savedData = useRef({})

  const updateForm = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const addExp = () => {
    setExperiences(e => [...e, { id: Date.now(), company: '', role: '', dates: '', achievements: '' }])
  }

  const removeExp = (id) => setExperiences(e => e.filter(x => x.id !== id))

  const updateExp = (id, field, val) => {
    setExperiences(e => e.map(x => x.id === id ? { ...x, [field]: val } : x))
  }

  const callAPI = async (prompt) => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.text
  }

  const generate = async () => {
    savedData.current = { ...form, experiences }
    const d = savedData.current
    const expText = d.experiences
      .filter(e => e.company || e.role)
      .map(e => `${e.role} at ${e.company} (${e.dates}): ${e.achievements}`)
      .join('\n')

    const prompt = `Create a professional ATS-optimised resume. Plain text only, no markdown. Use ALL CAPS section headings. Strong action verbs, quantified results where possible.

Name: ${d.name || 'Candidate'}
Target role: ${d.target}
Email: ${d.email} | Phone: ${d.phone} | Location: ${d.location}
Skills: ${d.skills}
Education: ${d.degree}, ${d.school}
Experience:
${expText}

Include: contact info, professional summary (3 sentences), experience with 3-4 bullets per role, skills, education.`

    setGenMsg('Writing your resume with AI...')
    setGenerating(true)
    setStep(4)

    try {
      const text = await callAPI(prompt)
      setResumeText(text)
      setGenerating(false)
      setStep(5)
      setActiveTab('resume')
    } catch {
      setResumeText('Something went wrong. Please try again.')
      setGenerating(false)
      setStep(5)
    }
  }

  const generateCL = async () => {
    const d = savedData.current
    const expText = (d.experiences || [])
      .filter(e => e.company || e.role)
      .map(e => `${e.role} at ${e.company} (${e.dates}): ${e.achievements}`)
      .join('\n')

    const prompt = `Write a compelling, personalised cover letter. Plain text only. 3-4 paragraphs. Professional but warm tone. Do NOT use generic filler phrases.

Candidate: ${d.name}
Applying for: ${d.target}
Background: ${expText}
Skills: ${d.skills}
Education: ${d.degree}, ${d.school}
${form.jobDescription ? `Job description:\n${form.jobDescription}` : ''}

Open with a strong hook. Show genuine enthusiasm. Close with a clear call to action.`

    setGenMsg('Writing your cover letter...')
    setGenerating(true)
    setStep(4)

    try {
      const text = await callAPI(prompt)
      setClText(text)
      setClGenerated(true)
      setGenerating(false)
      setStep(5)
      setActiveTab('cl')
    } catch {
      setClText('Something went wrong. Please try again.')
      setClGenerated(true)
      setGenerating(false)
      setStep(5)
    }
  }

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const dots = [1, 2, 3, 4]

  return (
    <>
      <Head>
        <title>AI Resume Builder — Get hired faster</title>
        <meta name="description" content="Generate a professional, ATS-optimised resume and cover letter in under 2 minutes using AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>AI Resume Builder</h1>
          <p>Professional resume + cover letter in under 2 minutes</p>
        </div>

        <div className="progress">
          {dots.map(n => (
            <div key={n} className={`dot${step > n ? ' done' : ''}`} />
          ))}
        </div>

        {/* Step 1: Personal info */}
        <div className={`step${step === 1 ? ' active' : ''}`}>
          <div className="card">
            <div className="section-title">Your details</div>
            <div className="row">
              <div className="field-group">
                <label>Full name</label>
                <input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div className="field-group">
                <label>Job title you want</label>
                <input value={form.target} onChange={e => updateForm('target', e.target.value)} placeholder="Senior Product Manager" />
              </div>
            </div>
            <div className="row">
              <div className="field-group">
                <label>Email</label>
                <input value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="jane@email.com" />
              </div>
              <div className="field-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+1 555 000 0000" />
              </div>
            </div>
            <div className="field-group">
              <label>Location</label>
              <input value={form.location} onChange={e => updateForm('location', e.target.value)} placeholder="New York, USA" />
            </div>
          </div>
          <div className="btn-row">
            <button className="primary" onClick={() => setStep(2)}>Next →</button>
          </div>
        </div>

        {/* Step 2: Experience */}
        <div className={`step${step === 2 ? ' active' : ''}`}>
          <div className="card">
            <div className="section-title">Work experience</div>
            {experiences.map(exp => (
              <div className="exp-item" key={exp.id}>
                {experiences.length > 1 && (
                  <button className="remove-btn" onClick={() => removeExp(exp.id)}>remove</button>
                )}
                <div className="row" style={{ marginBottom: 10 }}>
                  <div className="field-group">
                    <label>Company</label>
                    <input value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Acme Corp" />
                  </div>
                  <div className="field-group">
                    <label>Role</label>
                    <input value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} placeholder="Product Manager" />
                  </div>
                </div>
                <div className="field-group" style={{ marginBottom: 10 }}>
                  <label>Dates</label>
                  <input value={exp.dates} onChange={e => updateExp(exp.id, 'dates', e.target.value)} placeholder="Jan 2020 – Present" />
                </div>
                <div className="field-group">
                  <label>Key achievements</label>
                  <textarea value={exp.achievements} onChange={e => updateExp(exp.id, 'achievements', e.target.value)} placeholder="Led a team of 6 to ship a new checkout flow, reducing drop-off by 22%..." />
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addExp}>+ Add role</button>
          </div>
          <div className="btn-row">
            <button onClick={() => setStep(1)}>← Back</button>
            <button className="primary" onClick={() => setStep(3)}>Next →</button>
          </div>
        </div>

        {/* Step 3: Skills & education */}
        <div className={`step${step === 3 ? ' active' : ''}`}>
          <div className="card">
            <div className="section-title">Skills</div>
            <div className="field-group">
              <label>Key skills (comma separated)</label>
              <input value={form.skills} onChange={e => updateForm('skills', e.target.value)} placeholder="Project management, SQL, Figma, stakeholder comms" />
            </div>
          </div>
          <div className="card">
            <div className="section-title">Education</div>
            <div className="row">
              <div className="field-group">
                <label>Degree</label>
                <input value={form.degree} onChange={e => updateForm('degree', e.target.value)} placeholder="BSc Computer Science" />
              </div>
              <div className="field-group">
                <label>School & year</label>
                <input value={form.school} onChange={e => updateForm('school', e.target.value)} placeholder="MIT, 2018" />
              </div>
            </div>
          </div>
          <div className="btn-row">
            <button onClick={() => setStep(2)}>← Back</button>
            <button className="primary" onClick={generate}>Generate resume ↗</button>
          </div>
        </div>

        {/* Step 4: Generating */}
        <div className={`step${step === 4 ? ' active' : ''}`}>
          <div className="generating">
            <div className="spinner" />
            <p>{genMsg}</p>
          </div>
        </div>

        {/* Step 5: Results */}
        <div className={`step${step === 5 ? ' active' : ''}`}>
          <div className="tabs">
            <button className={`tab${activeTab === 'resume' ? ' active' : ''}`} onClick={() => setActiveTab('resume')}>
              Resume
            </button>
            <button className={`tab${activeTab === 'cl' ? ' active' : ''}`} onClick={() => setActiveTab('cl')}>
              Cover letter
            </button>
          </div>

          {activeTab === 'resume' && (
            <div>
              <div className="output-box">{resumeText}</div>
              <div className="badges">
                <span className="badge">✓ ATS-optimised</span>
                <span className="badge">✓ Action verbs</span>
                <span className="badge">✓ Keyword-rich</span>
              </div>
              <div className="btn-row">
                <button onClick={() => copyText(resumeText, 'resume')}>
                  {copied === 'resume' ? '✓ Copied!' : 'Copy'}
                </button>
                <button className="primary" onClick={() => setActiveTab('cl')}>Get cover letter →</button>
              </div>
            </div>
          )}

          {activeTab === 'cl' && (
            <div>
              {!clGenerated ? (
                <div className="upsell">
                  <h3>✦ Add a matching cover letter</h3>
                  <p>Tailored to the job, written in your voice.</p>
                  <div className="price">Free today <span>— normally $4.99</span></div>
                  <div className="field-group">
                    <label style={{ color: '#4060c0' }}>Job description (optional but recommended)</label>
                    <textarea
                      value={form.jobDescription}
                      onChange={e => updateForm('jobDescription', e.target.value)}
                      placeholder="Paste the job posting here for a tailored letter..."
                      style={{ minHeight: 100 }}
                    />
                  </div>
                  <button className="primary" onClick={generateCL} style={{ width: '100%' }}>
                    Generate cover letter ↗
                  </button>
                </div>
              ) : (
                <div>
                  <div className="output-box">{clText}</div>
                  <div className="btn-row">
                    <button onClick={() => copyText(clText, 'cl')}>
                      {copied === 'cl' ? '✓ Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => setClGenerated(false)}>Regenerate</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="btn-row" style={{ marginTop: 8 }}>
            <button onClick={() => { setStep(1); setResumeText(''); setClText(''); setClGenerated(false); }}>
              Start over
            </button>
          </div>
          <p className="tip">Paste into Word or Google Docs for final formatting.</p>
        </div>
      </div>
    </>
  )
}
