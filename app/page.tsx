"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  Building2,
  Target,
  Globe,
  FileCheck,
  Instagram,
  Facebook,
  Linkedin,
  Loader2,
} from "lucide-react"

type FormData = {
  nombreCompleto: string
  cargo: string
  email: string
  telefono: string
  nombreMarca: string
  descripcion: string
  misionVisionValores: string
  elementoDiferenciador: string
  personalidad: string
  competidores: string
  objetivos: string[]
  otroObjetivo: string
  clienteIdeal: string
  materialGrafico: string
  presupuestoAds: string
  redesCreadas: string
  socialMediaPlatforms: string[]
  instagramUser: string
  instagramPassword: string
  facebookEmail: string
  facebookPassword: string
  linkedinEmail: string
  linkedinPassword: string
  horarioAtencion: string
  direccion: string
  whatsappClientes: string
  contactoAprobacion: string
  comentarios: string
}

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "", cargo: "", email: "", telefono: "",
    nombreMarca: "", descripcion: "", misionVisionValores: "", elementoDiferenciador: "", personalidad: "", competidores: "",
    objetivos: [], otroObjetivo: "", clienteIdeal: "", materialGrafico: "", presupuestoAds: "",
    redesCreadas: "", socialMediaPlatforms: [],
    instagramUser: "", instagramPassword: "",
    facebookEmail: "", facebookPassword: "",
    linkedinEmail: "", linkedinPassword: "",
    horarioAtencion: "", direccion: "", whatsappClientes: "",
    contactoAprobacion: "", comentarios: "",
  })

  const totalSteps = 5
  const progressPercentage = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleObjective = (objective: string) => {
    setFormData((prev) => {
      const objetivos = prev.objetivos.includes(objective)
        ? prev.objetivos.filter((obj) => obj !== objective)
        : [...prev.objetivos, objective]
      return { ...prev, objetivos }
    })
  }

  const toggleSocialPlatform = (platform: string) => {
    setFormData((prev) => {
      const socialMediaPlatforms = prev.socialMediaPlatforms.includes(platform)
        ? prev.socialMediaPlatforms.filter((p) => p !== platform)
        : [...prev.socialMediaPlatforms, platform]
      return { ...prev, socialMediaPlatforms }
    })
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) return !!(formData.nombreCompleto && formData.email && formData.telefono)
    if (step === 2) return !!(formData.nombreMarca && formData.descripcion)
    if (step === 3) return formData.objetivos.length > 0
    if (step === 4) return !!formData.redesCreadas
    if (step === 5) return !!formData.contactoAprobacion
    return true
  }

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => prev + 1) }
  const handleBack = () => setCurrentStep(prev => prev - 1)

  const handleSubmit = async () => {
    setIsLoading(true)
    const portalId = "50931081"
    const formId = "da6ea758-abbf-4c39-8b6e-822464977ebe"
    
    const payload = {
      fields: [
        { name: "firstname", value: formData.nombreCompleto },
        { name: "email", value: formData.email.trim() },
        { name: "phone", value: formData.telefono },
        { name: "company", value: formData.nombreMarca },
        { name: "message", value: `
          CARGO: ${formData.cargo}
          ADN: ${formData.descripcion}
          OBJETIVOS: ${formData.objetivos.join(", ")}
          ADS: ${formData.presupuestoAds}
          REDES: ${formData.socialMediaPlatforms.join(", ")}
          IG: ${formData.instagramUser} / Pass: ${formData.instagramPassword}
          FB: ${formData.facebookEmail} / Pass: ${formData.facebookPassword}
          LI: ${formData.linkedinEmail} / Pass: ${formData.linkedinPassword}
          APROBACIÓN: ${formData.contactoAprobacion}
          COMENTARIOS: ${formData.comentarios}
        `}
      ],
      context: { pageUri: window.location.href, pageName: "Onboarding Swipe" }
    }

    try {
      const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) setIsSubmitted(true)
      else alert("Error de envío. Verifica que el email sea válido.")
    } catch (e) { alert("Error de conexión.") }
    finally { setIsLoading(false) }
  }

  const StepIcon = [User, Building2, Target, Globe, FileCheck][currentStep - 1]

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-2xl text-center p-12 shadow-xl border-slate-100">
        <CheckCircle2 className="w-20 h-20 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-900">¡Onboarding Completado!</h2>
        <p className="text-lg text-slate-600 mt-4">Gracias por confiar en Swipe. Hemos recibido tu información correctamente.</p>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <img src="/images/logotipo-principal.png" alt="Swipe Logo" className="max-h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">🚀 Formulario de Onboarding</h1>
          <p className="text-slate-600 mt-3">¡Bienvenido a la familia Swipe! Completa los datos para comenzar.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Paso {currentStep} de 5</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 bg-slate-200" />
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-blue-600 text-white p-8">
            <CardTitle className="text-2xl flex items-center gap-4">
              <StepIcon className="w-7 h-7" />
              {currentStep === 1 && "Datos de Identificación"}
              {currentStep === 2 && "ADN de Marca"}
              {currentStep === 3 && "Estrategia y Objetivos"}
              {currentStep === 4 && "Ecosistema Digital"}
              {currentStep === 5 && "Cierre Operativo"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre completo *</Label><Input value={formData.nombreCompleto} onChange={e => updateFormData("nombreCompleto", e.target.value)} /></div>
                <div className="space-y-2"><Label>Cargo en la empresa *</Label><Input value={formData.cargo} onChange={e => updateFormData("cargo", e.target.value)} /></div>
                <div className="space-y-2"><Label>Correo electrónico *</Label><Input type="email" value={formData.email} onChange={e => updateFormData("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Teléfono / WhatsApp *</Label><Input value={formData.telefono} onChange={e => updateFormData("telefono", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre de la marca *</Label><Input value={formData.nombreMarca} onChange={e => updateFormData("nombreMarca", e.target.value)} /></div>
                <div className="space-y-2"><Label>¿Qué hace tu empresa? *</Label><Textarea value={formData.descripcion} onChange={e => updateFormData("descripcion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Diferenciador principal</Label><Input value={formData.elementoDiferenciador} onChange={e => updateFormData("elementoDiferenciador", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Label className="text-base font-bold">Objetivos principales (Selecciona varios) *</Label>
                <div className="grid grid-cols-1 gap-3">
                  {["Más Ventas", "Reconocimiento de Marca", "Seguidores", "Imagen Visual"].map(obj => (
                    <div key={obj} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                      <Checkbox checked={formData.objetivos.includes(obj)} onCheckedChange={() => toggleObjective(obj)} />
                      <Label className="cursor-pointer">{obj}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2"><Label>Presupuesto mensual para Ads *</Label><Input placeholder="Ej: $500 USD" value={formData.presupuestoAds} onChange={e => updateFormData("presupuestoAds", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">¿Tienes redes sociales creadas? *</Label>
                  <RadioGroup value={formData.redesCreadas} onValueChange={v => updateFormData("redesCreadas", v)} className="flex gap-6">
                    <div className="flex items-center gap-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si" className="text-lg">Sí</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no" className="text-lg">No</Label></div>
                  </RadioGroup>
                </div>

                <div className="flex justify-center gap-6">
                  {[
                    { id: "Instagram", icon: Instagram, color: "hover:border-purple-500", active: "border-purple-500 bg-purple-50 text-purple-600" },
                    { id: "Facebook", icon: Facebook, color: "hover:border-blue-600", active: "border-blue-600 bg-blue-50 text-blue-600" },
                    { id: "Linkedin", icon: Linkedin, color: "hover:border-blue-800", active: "border-blue-800 bg-blue-50 text-blue-800" }
                  ].map((plat) => (
                    <button
                      key={plat.id} type="button" onClick={() => toggleSocialPlatform(plat.id)}
                      className={`p-6 rounded-2xl border-2 transition-all shadow-sm ${formData.socialMediaPlatforms.includes(plat.id) ? plat.active : "border-slate-100 bg-white text-slate-400"} ${plat.color}`}
                    >
                      <plat.icon className="w-9 h-9" />
                    </button>
                  ))}
                </div>

                {formData.socialMediaPlatforms.includes("Instagram") && (
                  <div className="p-6 bg-purple-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 border border-purple-100 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2"><Label>Usuario Instagram</Label><Input value={formData.instagramUser} onChange={e => updateFormData("instagramUser", e.target.value)} className="bg-white" /></div>
                    <div className="space-y-2"><Label>Password Instagram</Label><Input type="password" value={formData.instagramPassword} onChange={e => updateFormData("instagramPassword", e.target.value)} className="bg-white" /></div>
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Facebook") && (
                  <div className="p-6 bg-blue-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2"><Label>Email/Tel Facebook</Label><Input value={formData.facebookEmail} onChange={e => updateFormData("facebookEmail", e.target.value)} className="bg-white" /></div>
                    <div className="space-y-2"><Label>Password Facebook</Label><Input type="password" value={formData.facebookPassword} onChange={e => updateFormData("facebookPassword", e.target.value)} className="bg-white" /></div>
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Linkedin") && (
                  <div className="p-6 bg-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2"><Label>Usuario LinkedIn</Label><Input value={formData.linkedinEmail} onChange={e => updateFormData("linkedinEmail", e.target.value)} className="bg-white" /></div>
                    <div className="space-y-2"><Label>Password LinkedIn</Label><Input type="password" value={formData.linkedinPassword} onChange={e => updateFormData("linkedinPassword", e.target.value)} className="bg-white" /></div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Contacto para aprobación de contenido *</Label><Input value={formData.contactoAprobacion} onChange={e => updateFormData("contactoAprobacion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Comentarios adicionales</Label><Textarea value={formData.comentarios} onChange={e => updateFormData("comentarios", e.target.value)} /></div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t border-slate-100">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="rounded-xl px-8 h-12">Anterior</Button>
              {currentStep < 5 ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-blue-200">
                  Siguiente <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-12 h-12 font-bold shadow-lg shadow-blue-200">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar Onboarding"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}