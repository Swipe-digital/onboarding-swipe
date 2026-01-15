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
    return true
  }

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, totalSteps)) }
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setIsLoading(true)
    const portalId = "50931081"
    const formId = "da6ea758-abbf-4c39-8b6e-822464977ebe"
    
    // Mapeo riguroso para evitar errores de validación en HubSpot
    const payload = {
      fields: [
        { name: "firstname", value: formData.nombreCompleto || "No provisto" },
        { name: "email", value: formData.email.trim().toLowerCase() },
        { name: "phone", value: formData.telefono || "00000000" },
        { name: "company", value: formData.nombreMarca || "Swipe Client" },
        { name: "message", value: `
          Cargo: ${formData.cargo}
          ADN Marca: ${formData.descripcion}
          Objetivos: ${formData.objetivos.join(", ")}
          Presupuesto Ads: ${formData.presupuestoAds}
          Redes: ${formData.socialMediaPlatforms.join(", ")}
          Credenciales:
          - IG: ${formData.instagramUser} / ${formData.instagramPassword}
          - FB: ${formData.facebookEmail} / ${formData.facebookPassword}
          - LI: ${formData.linkedinEmail} / ${formData.linkedinPassword}
          Horario: ${formData.horarioAtencion}
          Contacto Aprobación: ${formData.contactoAprobacion}
        `.trim() }
      ],
      context: { pageUri: window.location.href, pageName: "Onboarding Swipe" }
    }

    try {
      const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (response.ok) setIsSubmitted(true)
      else {
        const errorDetail = await response.json()
        console.error(errorDetail)
        alert("Hubo un problema con los datos. Por favor revisa el formato del correo.")
      }
    } catch (error) {
      alert("Error de conexión.")
    } finally { setIsLoading(false) }
  }

  const StepIcon = [User, Building2, Target, Globe, FileCheck][currentStep - 1]

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-2xl text-center p-12 border-slate-200 shadow-xl">
        <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold">¡Todo listo!</h2>
        <p className="text-slate-600 text-lg mt-4">Hemos recibido tu información. El equipo de Swipe se pondrá en contacto pronto.</p>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-4 bg-white text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="/images/logotipo-principal.png" alt="Swipe Logo" className="max-h-[80px] w-auto object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-3">🚀 Formulario de Onboarding</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">¡Hola! Bienvenido a la familia de Swipe. Completa este formulario para comenzar.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Paso {currentStep} de 5</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="border border-slate-200 shadow-lg bg-white rounded-xl overflow-hidden">
          <CardHeader className="bg-blue-600 text-white p-6">
            <div className="flex items-center gap-3">
              <StepIcon className="w-6 h-6" />
              <CardTitle className="text-2xl font-semibold">
                {currentStep === 1 && "Datos de Identificación"}
                {currentStep === 2 && "ADN de Marca"}
                {currentStep === 3 && "Estrategia y Objetivos"}
                {currentStep === 4 && "Ecosistema Digital"}
                {currentStep === 5 && "Cierre Operativo"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre completo *</Label><Input value={formData.nombreCompleto} onChange={e => updateFormData("nombreCompleto", e.target.value)} /></div>
                <div className="space-y-2"><Label>Cargo en la empresa *</Label><Input value={formData.cargo} onChange={e => updateFormData("cargo", e.target.value)} /></div>
                <div className="space-y-2"><Label>Correo electrónico *</Label><Input value={formData.email} onChange={e => updateFormData("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Teléfono / WhatsApp *</Label><Input value={formData.telefono} onChange={e => updateFormData("telefono", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-slate-800">¿Redes sociales creadas? *</Label>
                  <RadioGroup value={formData.redesCreadas} onValueChange={v => updateFormData("redesCreadas", v)} className="flex gap-4">
                    <div className="flex items-center gap-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si">Sí</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">No</Label></div>
                  </RadioGroup>
                </div>

                <div className="flex justify-center gap-6 py-4">
                  {[
                    { id: "Instagram", icon: Instagram, color: "hover:border-purple-500", active: "border-purple-500 bg-purple-50" },
                    { id: "Facebook", icon: Facebook, color: "hover:border-blue-600", active: "border-blue-600 bg-blue-50" },
                    { id: "Linkedin", icon: Linkedin, color: "hover:border-blue-800", active: "border-blue-800 bg-blue-50" }
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => toggleSocialPlatform(plat.id)}
                      className={`p-5 rounded-2xl border-2 transition-all ${formData.socialMediaPlatforms.includes(plat.id) ? plat.active : "border-slate-100 bg-white"} ${plat.color}`}
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
                    <div className="space-y-2"><Label>Email FB</Label><Input value={formData.facebookEmail} onChange={e => updateFormData("facebookEmail", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password FB</Label><Input type="password" value={formData.facebookPassword} onChange={e => updateFormData("facebookPassword", e.target.value)} /></div>
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Linkedin") && (
                  <div className="p-6 bg-slate-50 rounded-xl grid grid-cols-2 gap-4 border border-slate-200">
                    <div className="space-y-2"><Label>Usuario LinkedIn</Label><Input value={formData.linkedinEmail} onChange={e => updateFormData("linkedinEmail", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password LinkedIn</Label><Input type="password" value={formData.linkedinPassword} onChange={e => updateFormData("linkedinPassword", e.target.value)} /></div>
                  </div>
                )}
                <div className="space-y-2"><Label>Horario de atención *</Label><Input value={formData.horarioAtencion} onChange={e => updateFormData("horarioAtencion", e.target.value)} /></div>
              </div>
            )}

            {/* Pasos 2, 3 y 5 simplificados para el renderizado */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre de marca</Label><Input value={formData.nombreMarca} onChange={e => updateFormData("nombreMarca", e.target.value)} /></div>
                <div className="space-y-2"><Label>Descripción</Label><Textarea value={formData.descripcion} onChange={e => updateFormData("descripcion", e.target.value)} /></div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Objetivos</Label>
                {["Ventas", "Seguidores"].map(obj => (
                  <div key={obj} className="flex gap-2"><Checkbox onCheckedChange={() => toggleObjective(obj)} /><Label>{obj}</Label></div>
                ))}
              </div>
            )}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Contacto aprobación</Label><Input value={formData.contactoAprobacion} onChange={e => updateFormData("contactoAprobacion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Comentarios</Label><Textarea value={formData.comentarios} onChange={e => updateFormData("comentarios", e.target.value)} /></div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t border-slate-100">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Anterior</Button>
              {currentStep < 5 ? (
                <Button onClick={handleNext} className="bg-blue-600 px-8 text-white">Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 px-8 text-white">
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