"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  const handleSubmit = async () => {
    setIsLoading(true)
    const portalId = "50931081"
    const formId = "da6ea758-abbf-4c39-8b6e-822464977ebe"
    
    const payload = {
      fields: [
        { name: "firstname", value: formData.nombreCompleto },
        { name: "email", value: formData.email },
        { name: "phone", value: formData.telefono },
        { name: "company", value: formData.nombreMarca },
        { name: "message", value: `
          OBJETIVOS: ${formData.objetivos.join(", ")}
          INSTAGRAM: ${formData.instagramUser} / Pass: ${formData.instagramPassword}
          FACEBOOK: ${formData.facebookEmail} / Pass: ${formData.facebookPassword}
          LINKEDIN: ${formData.linkedinEmail} / Pass: ${formData.linkedinPassword}
          ADS: ${formData.presupuestoAds}
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
      else alert("Error al enviar. Revisa el formato del email.")
    } catch (e) { alert("Error de conexión.") }
    finally { setIsLoading(false) }
  }

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="max-w-md w-full text-center p-8 shadow-xl border-slate-100">
        <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">¡Recibido!</h2>
        <p className="text-slate-600 mt-2">Pronto nos pondremos en contacto contigo.</p>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <img src="/images/logotipo-principal.png" alt="Logo" className="max-h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">🚀 Formulario de Onboarding</h1>
        </div>

        <div className="mb-8">
            <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="shadow-2xl border-none overflow-hidden rounded-2xl bg-white">
          <CardHeader className="bg-blue-600 text-white p-8">
            <CardTitle className="text-2xl flex items-center gap-3">
              {currentStep === 4 ? <Globe /> : <User />} Paso {currentStep}: 
              {currentStep === 4 ? " Ecosistema Digital" : " Información"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === 1 && (
                <div className="space-y-4">
                    <div className="space-y-2"><Label>Nombre Completo *</Label><Input value={formData.nombreCompleto} onChange={e => updateFormData("nombreCompleto", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Correo Electrónico *</Label><Input value={formData.email} onChange={e => updateFormData("email", e.target.value)} /></div>
                    <div className="space-y-2"><Label>WhatsApp *</Label><Input value={formData.telefono} onChange={e => updateFormData("telefono", e.target.value)} /></div>
                </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">¿Redes sociales creadas? *</Label>
                  <RadioGroup value={formData.redesCreadas} onValueChange={v => updateFormData("redesCreadas", v)} className="flex gap-4">
                    <div className="flex items-center gap-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si">Sí</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">No</Label></div>
                  </RadioGroup>
                </div>

                <div className="flex justify-center gap-6">
                  {[
                    { id: "Instagram", icon: Instagram, color: "hover:border-purple-500", active: "border-purple-500 bg-purple-50" },
                    { id: "Facebook", icon: Facebook, color: "hover:border-blue-600", active: "border-blue-600 bg-blue-50" },
                    { id: "Linkedin", icon: Linkedin, color: "hover:border-blue-800", active: "border-blue-800 bg-blue-50" }
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => toggleSocialPlatform(plat.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${formData.socialMediaPlatforms.includes(plat.id) ? plat.active : "border-slate-100 bg-white"} ${plat.color}`}
                    >
                      <plat.icon className="w-8 h-8" />
                    </button>
                  ))}
                </div>

                {formData.socialMediaPlatforms.includes("Instagram") && (
                  <div className="p-6 bg-purple-50 rounded-xl grid grid-cols-2 gap-4 border border-purple-100">
                    <div className="space-y-2"><Label>Usuario IG</Label><Input value={formData.instagramUser} onChange={e => updateFormData("instagramUser", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password IG</Label><Input type="password" value={formData.instagramPassword} onChange={e => updateFormData("instagramPassword", e.target.value)} /></div>
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Facebook") && (
                  <div className="p-6 bg-blue-50 rounded-xl grid grid-cols-2 gap-4 border border-blue-100">
                    <div className="space-y-2"><Label>Correo FB</Label><Input value={formData.facebookEmail} onChange={e => updateFormData("facebookEmail", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password FB</Label><Input type="password" value={formData.facebookPassword} onChange={e => updateFormData("facebookPassword", e.target.value)} /></div>
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Linkedin") && (
                  <div className="p-6 bg-slate-50 rounded-xl grid grid-cols-2 gap-4 border border-slate-200">
                    <div className="space-y-2"><Label>Usuario LinkedIn</Label><Input value={formData.linkedinEmail} onChange={e => updateFormData("linkedinEmail", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password LinkedIn</Label><Input type="password" value={formData.linkedinPassword} onChange={e => updateFormData("linkedinPassword", e.target.value)} /></div>
                  </div>
                )}
              </div>
            )}

            {/* Renderizado simplificado para los otros pasos para ahorrar espacio en chat */}
            {currentStep === 2 && <div className="space-y-4"><Label>Marca</Label><Input onChange={e => updateFormData("nombreMarca", e.target.value)} /></div>}
            {currentStep === 3 && <div className="space-y-4"><Checkbox onCheckedChange={() => toggleObjective("Ventas")} /><Label>Ventas</Label></div>}
            {currentStep === 5 && <div className="space-y-4"><Label>Aprobación</Label><Input onChange={e => updateFormData("contactoAprobacion", e.target.value)} /></div>}

            <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>Anterior</Button>
              {currentStep < 5 ? (
                <Button onClick={() => setCurrentStep(s => s + 1)} className="bg-blue-600 px-10 rounded-xl">Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 px-10 rounded-xl">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}