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
    instagramUser: "", instagramPassword: "", facebookEmail: "", facebookPassword: "", linkedinEmail: "", linkedinPassword: "",
    horarioAtencion: "", direccion: "", whatsappClientes: "", contactoAprobacion: "", comentarios: "",
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
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setIsLoading(true)
    const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/swipe.com.do/s/AKfycbyiBqf3yV1N6VeA8I9QhHemWHQQqJG0dHSCYf8kpPr1_W7JhmSCet6mPtmFSI5GVa5p/exec"

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setIsSubmitted(true)
    } catch (error) {
      alert("Error al enviar al Excel. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-2xl border-none shadow-2xl text-center p-12">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-600 p-4"><CheckCircle2 className="w-16 h-16 text-white" /></div>
        </div>
        <h2 className="text-3xl font-bold mb-4">¡Información Recibida!</h2>
        <p className="text-lg text-slate-600">Tus datos se han guardado correctamente en nuestro sistema.</p>
      </Card>
    </div>
  )

  const StepIcon = [User, Building2, Target, Globe, FileCheck][currentStep - 1]

  return (
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img src="/images/logotipo-principal.png" alt="Swipe" className="max-h-[80px] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-3">🚀 Onboarding Swipe</h1>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Paso {currentStep} de 5</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><StepIcon className="w-6 h-6" /></div>
              <CardTitle className="text-2xl">
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
                <div className="space-y-2"><Label>Nombre completo *</Label><Input placeholder="Ej: Juan Pérez" value={formData.nombreCompleto} onChange={(e) => updateFormData("nombreCompleto", e.target.value)} /></div>
                <div className="space-y-2"><Label>Cargo *</Label><Input placeholder="Ej: CEO" value={formData.cargo} onChange={(e) => updateFormData("cargo", e.target.value)} /></div>
                <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="hola@empresa.com" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Teléfono / WhatsApp *</Label><Input placeholder="+1 809..." value={formData.telefono} onChange={(e) => updateFormData("telefono", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <Label className="block mb-4">¿Redes sociales creadas? *</Label>
                <RadioGroup value={formData.redesCreadas} onValueChange={(v) => updateFormData("redesCreadas", v)} className="flex gap-4">
                  <div className="flex items-center gap-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si">Sí</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">No</Label></div>
                </RadioGroup>

                <div className="flex gap-4 justify-center py-4">
                  {[
                    { id: "Instagram", Icon: Instagram, color: "text-purple-600", border: "border-purple-500", bg: "bg-purple-50" },
                    { id: "Facebook", Icon: Facebook, color: "text-blue-600", border: "border-blue-600", bg: "bg-blue-50" },
                    { id: "LinkedIn", Icon: Linkedin, color: "text-blue-800", border: "border-blue-800", bg: "bg-blue-50" }
                  ].map(({ id, Icon, color, border, bg }) => (
                    <button key={id} type="button" onClick={() => toggleSocialPlatform(id)}
                      className={`p-5 rounded-2xl border-2 transition-all ${formData.socialMediaPlatforms.includes(id) ? `${border} ${bg} ${color}` : "border-slate-100 text-slate-300"}`}
                    >
                      <Icon className="w-8 h-8" />
                    </button>
                  ))}
                </div>

                {formData.socialMediaPlatforms.includes("Instagram") && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <Input placeholder="Usuario IG" value={formData.instagramUser} onChange={(e) => updateFormData("instagramUser", e.target.value)} />
                    <Input placeholder="Clave IG" value={formData.instagramPassword} onChange={(e) => updateFormData("instagramPassword", e.target.value)} />
                  </div>
                )}
                {/* Repetir estructura similar para FB y LI si se desea */}
                <div className="space-y-2"><Label>Horario de atención *</Label><Input value={formData.horarioAtencion} onChange={(e) => updateFormData("horarioAtencion", e.target.value)} /></div>
              </div>
            )}

            {/* Renderizado simplificado para los demás pasos para mantener el flujo */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nombre de la marca *</Label><Input value={formData.nombreMarca} onChange={(e) => updateFormData("nombreMarca", e.target.value)} /></div>
                <div className="space-y-2"><Label>Descripción *</Label><Textarea value={formData.descripcion} onChange={(e) => updateFormData("descripcion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Elemento diferenciador</Label><Input value={formData.elementoDiferenciador} onChange={(e) => updateFormData("elementoDiferenciador", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Objetivos principales *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Ventas", "Seguidores", "Posicionamiento", "Imagen"].map(o => (
                    <div key={o} className="flex items-center gap-2 border p-3 rounded-xl"><Checkbox checked={formData.objetivos.includes(o)} onCheckedChange={() => toggleObjective(o)} /><Label>{o}</Label></div>
                  ))}
                </div>
                <div className="space-y-2"><Label>Presupuesto Ads *</Label><Input value={formData.presupuestoAds} onChange={(e) => updateFormData("presupuestoAds", e.target.value)} /></div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Contacto para aprobación *</Label><Input value={formData.contactoAprobacion} onChange={(e) => updateFormData("contactoAprobacion", e.target.value)} /></div>
                <div className="space-y-2"><Label>Comentarios adicionales</Label><Textarea value={formData.comentarios} onChange={(e) => updateFormData("comentarios", e.target.value)} /></div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-slate-100 mt-6">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading} className="rounded-xl px-8">Anterior</Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl">Siguiente <ArrowRight className="ml-2 w-4 h-4" /></Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-12 rounded-xl font-bold italic">
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