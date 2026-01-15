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
    nombreCompleto: "",
    cargo: "",
    email: "",
    telefono: "",
    nombreMarca: "",
    descripcion: "",
    misionVisionValores: "",
    elementoDiferenciador: "",
    personalidad: "",
    competidores: "",
    objetivos: [],
    otroObjetivo: "",
    clienteIdeal: "",
    materialGrafico: "",
    presupuestoAds: "",
    redesCreadas: "",
    socialMediaPlatforms: [],
    instagramUser: "",
    instagramPassword: "",
    facebookEmail: "",
    facebookPassword: "",
    linkedinEmail: "",
    linkedinPassword: "",
    horarioAtencion: "",
    direccion: "",
    whatsappClientes: "",
    contactoAprobacion: "",
    comentarios: "",
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
      const otroObjetivo = objective === "Otro" && prev.objetivos.includes("Otro") ? "" : prev.otroObjetivo
      return { ...prev, objetivos, otroObjetivo }
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
    switch (step) {
      case 1:
        return !!(formData.nombreCompleto && formData.cargo && formData.email && formData.telefono)
      case 2:
        return !!(formData.nombreMarca && formData.descripcion && formData.misionVisionValores && formData.elementoDiferenciador && formData.personalidad && formData.competidores)
      case 3:
        const otroSelected = formData.objetivos.includes("Otro")
        const otroValid = !otroSelected || (otroSelected && formData.otroObjetivo.trim() !== "")
        return !!(formData.objetivos.length > 0 && formData.clienteIdeal && formData.presupuestoAds && otroValid)
      case 4:
        return !!(formData.redesCreadas && formData.horarioAtencion)
      case 5:
        return !!formData.contactoAprobacion
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (validateStep(5)) {
      setIsLoading(true)
      const portalId = "50931081"
      const formId = "da6ea758-abbf-4c39-8b6e-822464977ebe"
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

      const payload = {
        fields: [
          { name: "firstname", value: formData.nombreCompleto },
          { name: "email", value: formData.email.trim().toLowerCase() },
          { name: "phone", value: formData.telefono },
          { name: "company", value: formData.nombreMarca },
          { name: "message", value: `
            CARGO: ${formData.cargo}
            ADN MARCA: ${formData.descripcion}
            MISIÓN/VISIÓN: ${formData.misionVisionValores}
            DIFERENCIADOR: ${formData.elementoDiferenciador}
            PERSONALIDAD: ${formData.personalidad}
            COMPETIDORES: ${formData.competidores}
            OBJETIVOS: ${formData.objetivos.join(", ")} ${formData.otroObjetivo}
            CLIENTE IDEAL: ${formData.clienteIdeal}
            PRESUPUESTO ADS: ${formData.presupuestoAds}
            HORARIO: ${formData.horarioAtencion}
            --- CREDENCIALES ---
            INSTAGRAM: ${formData.instagramUser} / ${formData.instagramPassword}
            FACEBOOK: ${formData.facebookEmail} / ${formData.facebookPassword}
            LINKEDIN: ${formData.linkedinEmail} / ${formData.linkedinPassword}
            CONTACTO APROBACIÓN: ${formData.contactoAprobacion}
            COMENTARIOS: ${formData.comentarios}
          `},
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          setIsSubmitted(true)
        } else {
          alert("Error al enviar a HubSpot. Por favor revisa que el email sea válido.")
        }
      } catch (error) {
        alert("Error de conexión.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const StepIcon = currentStep === 1 ? User : currentStep === 2 ? Building2 : currentStep === 3 ? Target : currentStep === 4 ? Globe : FileCheck

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-2xl border border-slate-200 shadow-lg text-center p-12">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-600 p-4">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">¡Listo!</h2>
          <p className="text-lg text-slate-600">Hemos recibido tu información. Pronto nos pondremos en contacto.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/images/logotipo-principal.png" alt="Swipe Logo" className="max-h-[80px] w-auto object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">🚀 Formulario de Onboarding</h1>
          <p className="text-slate-700 max-w-2xl mx-auto">¡Bienvenido a la familia Swipe!</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-900">Paso {currentStep} de 5</span>
            <span className="text-sm font-medium text-slate-900">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="border border-slate-200 shadow-lg rounded-xl bg-white">
          <CardHeader className="rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><StepIcon className="w-6 h-6 text-white" /></div>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Datos de Identificación"}
                {currentStep === 2 && "ADN de Marca"}
                {currentStep === 3 && "Estrategia y Objetivos"}
                {currentStep === 4 && "Ecosistema Digital"}
                {currentStep === 5 && "Cierre Operativo"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre completo *</Label><Input value={formData.nombreCompleto} onChange={e => updateFormData("nombreCompleto", e.target.value)} /></div>
                <div className="space-y-2"><Label>Cargo *</Label><Input value={formData.cargo} onChange={e => updateFormData("cargo", e.target.value)} /></div>
                <div className="space-y-2"><Label>Correo *</Label><Input type="email" value={formData.email} onChange={e => updateFormData("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Teléfono *</Label><Input value={formData.telefono} onChange={e => updateFormData("telefono", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre marca *</Label><Input value={formData.nombreMarca} onChange={e => updateFormData("nombreMarca", e.target.value)} /></div>
                <div className="space-y-2"><Label>Descripción *</Label><Textarea value={formData.descripcion} onChange={e => updateFormData("descripcion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Misión/Visión/Valores *</Label><Textarea value={formData.misionVisionValores} onChange={e => updateFormData("misionVisionValores", e.target.value)} /></div>
                <div className="space-y-2"><Label>Diferenciador *</Label><Input value={formData.elementoDiferenciador} onChange={e => updateFormData("elementoDiferenciador", e.target.value)} /></div>
                <div className="space-y-2"><Label>Personalidad *</Label><Input value={formData.personalidad} onChange={e => updateFormData("personalidad", e.target.value)} /></div>
                <div className="space-y-2"><Label>Competidores *</Label><Input value={formData.competidores} onChange={e => updateFormData("competidores", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Objetivos *</Label>
                {["Más ventas", "Seguidores", "Posicionamiento", "Imagen visual", "Otro"].map(obj => (
                  <div key={obj} className="flex items-center space-x-2">
                    <Checkbox checked={formData.objetivos.includes(obj)} onCheckedChange={() => toggleObjective(obj)} />
                    <Label>{obj}</Label>
                  </div>
                ))}
                <div className="space-y-2"><Label>Cliente Ideal *</Label><Textarea value={formData.clienteIdeal} onChange={e => updateFormData("clienteIdeal", e.target.value)} /></div>
                <div className="space-y-2"><Label>Presupuesto Ads *</Label><Input value={formData.presupuestoAds} onChange={e => updateFormData("presupuestoAds", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <Label>¿Redes sociales creadas? *</Label>
                <RadioGroup value={formData.redesCreadas} onValueChange={v => updateFormData("redesCreadas", v)}>
                  <div className="flex items-center gap-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si">Sí</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">No</Label></div>
                </RadioGroup>

                <div className="flex gap-4 justify-center">
                  <button type="button" onClick={() => toggleSocialPlatform("Instagram")} className={`p-4 rounded-xl border-2 ${formData.socialMediaPlatforms.includes("Instagram") ? "border-purple-500 bg-purple-50" : "border-slate-200"}`}><Instagram className="w-8 h-8" /></button>
                  <button type="button" onClick={() => toggleSocialPlatform("Facebook")} className={`p-4 rounded-xl border-2 ${formData.socialMediaPlatforms.includes("Facebook") ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}><Facebook className="w-8 h-8" /></button>
                  <button type="button" onClick={() => toggleSocialPlatform("LinkedIn")} className={`p-4 rounded-xl border-2 ${formData.socialMediaPlatforms.includes("LinkedIn") ? "border-blue-800 bg-blue-50" : "border-slate-200"}`}><Linkedin className="w-8 h-8" /></button>
                </div>

                {formData.socialMediaPlatforms.includes("Instagram") && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <Input placeholder="Usuario IG" value={formData.instagramUser} onChange={e => updateFormData("instagramUser", e.target.value)} />
                    <Input placeholder="Clave IG" value={formData.instagramPassword} onChange={e => updateFormData("instagramPassword", e.target.value)} />
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("Facebook") && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Input placeholder="Correo FB" value={formData.facebookEmail} onChange={e => updateFormData("facebookEmail", e.target.value)} />
                    <Input placeholder="Clave FB" value={formData.facebookPassword} onChange={e => updateFormData("facebookPassword", e.target.value)} />
                  </div>
                )}
                {formData.socialMediaPlatforms.includes("LinkedIn") && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-300 text-blue-800">
                    <Input placeholder="Correo LI" value={formData.linkedinEmail} onChange={e => updateFormData("linkedinEmail", e.target.value)} />
                    <Input placeholder="Clave LI" value={formData.linkedinPassword} onChange={e => updateFormData("linkedinPassword", e.target.value)} />
                  </div>
                )}
                <div className="space-y-2"><Label>Horario atención *</Label><Input value={formData.horarioAtencion} onChange={e => updateFormData("horarioAtencion", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Contacto aprobación *</Label><Input value={formData.contactoAprobacion} onChange={e => updateFormData("contactoAprobacion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Comentarios</Label><Textarea value={formData.comentarios} onChange={e => updateFormData("comentarios", e.target.value)} /></div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>Anterior</Button>
              {currentStep < 5 ? (
                <Button onClick={handleNext} className="bg-blue-600 text-white px-8">Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-8">
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