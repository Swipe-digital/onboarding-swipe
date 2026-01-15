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
  // Step 1
  nombreCompleto: string
  cargo: string
  email: string
  telefono: string
  // Step 2
  nombreMarca: string
  descripcion: string
  misionVisionValores: string
  elementoDiferenciador: string
  personalidad: string
  competidores: string
  // Step 3
  objetivos: string[]
  otroObjetivo: string
  clienteIdeal: string
  materialGrafico: string
  presupuestoAds: string
  // Step 4
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
  // Step 5
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
        return !!(
          formData.nombreMarca &&
          formData.descripcion &&
          formData.misionVisionValores &&
          formData.elementoDiferenciador &&
          formData.personalidad &&
          formData.competidores
        )
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

  // --- FUNCIÓN DE ENVÍO A HUBSPOT INTEGRADA ---
  const handleSubmit = async () => {
    if (validateStep(5)) {
      setIsLoading(true)
      
      const portalId = "50931081"
      const formId = "da6ea758-abbf-4c39-8b6e-822464977ebe"
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

      const payload = {
        fields: [
          { name: "firstname", value: formData.nombreCompleto },
          { name: "lastname", value: formData.cargo }, // Cargo lo mapeamos a apellido o propiedad custom
          { name: "email", value: formData.email },
          { name: "phone", value: formData.telefono },
          { name: "company", value: formData.nombreMarca },
          { name: "message", value: `
            ADN MARCA: ${formData.descripcion}
            MISION/VALORES: ${formData.misionVisionValores}
            DIFERENCIADOR: ${formData.elementoDiferenciador}
            PERSONALIDAD: ${formData.personalidad}
            COMPETIDORES: ${formData.competidores}
            OBJETIVOS: ${formData.objetivos.join(", ")} ${formData.otroObjetivo}
            CLIENTE IDEAL: ${formData.clienteIdeal}
            PRESUPUESTO ADS: ${formData.presupuestoAds}
            REDES SOCIALES: ${formData.socialMediaPlatforms.join(", ")}
            IG: ${formData.instagramUser} / Pass: ${formData.instagramPassword}
            FB: ${formData.facebookEmail} / Pass: ${formData.facebookPassword}
            LI: ${formData.linkedinEmail} / Pass: ${formData.linkedinPassword}
            HORARIO: ${formData.horarioAtencion}
            DIRECCION: ${formData.direccion}
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
          alert("Hubo un error al enviar. Por favor, revisa que los datos sean correctos.")
        }
      } catch (error) {
        console.error("Error de conexión:", error)
        alert("Error de red. Intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return User
      case 2: return Building2
      case 3: return Target
      case 4: return Globe
      case 5: return FileCheck
      default: return User
    }
  }

  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <Card className="w-full max-w-2xl border border-slate-200 shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-blue-600 p-4">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">¡Listo!</h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                Hemos recibido tu información. Nuestro equipo la analizará a fondo y nos pondremos en contacto contigo
                en las próximas 24-48 horas para nuestra reunión de kickoff.
              </p>
              <p className="text-xl font-semibold mt-6 text-blue-600">
                ¡Es hora de hacer que tu marca haga swipe hacia el éxito!
              </p>
            </CardContent>
          </Card>
        </div>
        <footer className="py-6 text-center">
          <p className="text-sm text-slate-500">
            © 2026 Swipe. Todos los derechos reservados |{" "}
            <a href="https://www.swipe.com.do" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-slate-700 transition-colors">
              www.swipe.com.do
            </a>
          </p>
        </footer>
      </>
    )
  }

  const StepIcon = getStepIcon(currentStep)

  return (
    <>
      <div className="min-h-screen py-8 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img
                src="/swipe-logo.png"
                alt="Swipe Logo"
                className="max-h-[80px] w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3 text-balance">🚀 Formulario de Onboarding</h1>
            <p className="text-slate-700 leading-relaxed max-w-2xl mx-auto text-pretty">
              ¡Hola! Bienvenido a la familia de Swipe. Estamos muy emocionados de empezar a trabajar con tu marca.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">Paso {currentStep} de {totalSteps}</span>
              <span className="text-sm font-medium text-slate-900">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card className="border border-slate-200 shadow-lg rounded-xl bg-white">
            <CardHeader className="rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <StepIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">
                    {currentStep === 1 && "Datos de Identificación"}
                    {currentStep === 2 && "ADN de Marca"}
                    {currentStep === 3 && "Estrategia y Objetivos"}
                    {currentStep === 4 && "Ecosistema Digital"}
                    {currentStep === 5 && "Cierre Operativo"}
                  </CardTitle>
                  <CardDescription className="text-white/80">Completa todos los campos requeridos</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-6">
              {currentStep === 1 && (
                <div className="space-y-6 text-slate-900">
                  <div className="space-y-2">
                    <Label htmlFor="nombreCompleto">Nombre completo <span className="text-red-500">*</span></Label>
                    <Input id="nombreCompleto" value={formData.nombreCompleto} onChange={(e) => updateFormData("nombreCompleto", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo en la empresa <span className="text-red-500">*</span></Label>
                    <Input id="cargo" value={formData.cargo} onChange={(e) => updateFormData("cargo", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono / WhatsApp <span className="text-red-500">*</span></Label>
                    <Input id="telefono" value={formData.telefono} onChange={(e) => updateFormData("telefono", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 text-slate-900">
                  <div className="space-y-2">
                    <Label htmlFor="nombreMarca">Nombre de la marca <span className="text-red-500">*</span></Label>
                    <Input id="nombreMarca" value={formData.nombreMarca} onChange={(e) => updateFormData("nombreMarca", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción de lo que hacen <span className="text-red-500">*</span></Label>
                    <Textarea id="descripcion" value={formData.descripcion} onChange={(e) => updateFormData("descripcion", e.target.value)} className="rounded-xl min-h-[100px] border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="misionVisionValores">Misión, Visión y Valores <span className="text-red-500">*</span></Label>
                    <Textarea id="misionVisionValores" value={formData.misionVisionValores} onChange={(e) => updateFormData("misionVisionValores", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="elementoDiferenciador">Elemento diferenciador <span className="text-red-500">*</span></Label>
                    <Input id="elementoDiferenciador" value={formData.elementoDiferenciador} onChange={(e) => updateFormData("elementoDiferenciador", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personalidad">Personalidad de marca <span className="text-red-500">*</span></Label>
                    <Input id="personalidad" value={formData.personalidad} onChange={(e) => updateFormData("personalidad", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="competidores">Principales competidores <span className="text-red-500">*</span></Label>
                    <Input id="competidores" value={formData.competidores} onChange={(e) => updateFormData("competidores", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 text-slate-900">
                  <div className="space-y-3">
                    <Label>Objetivos principales <span className="text-red-500">*</span></Label>
                    {["Más ventas", "Seguidores", "Posicionamiento", "Imagen visual", "Otro"].map((objetivo) => (
                      <div key={objetivo} className="flex items-center space-x-2">
                        <Checkbox id={objetivo} checked={formData.objetivos.includes(objetivo)} onCheckedChange={() => toggleObjective(objetivo)} />
                        <Label htmlFor={objetivo} className="font-normal cursor-pointer">{objetivo}</Label>
                      </div>
                    ))}
                    {formData.objetivos.includes("Otro") && (
                      <Input placeholder="Especifique..." value={formData.otroObjetivo} onChange={(e) => updateFormData("otroObjetivo", e.target.value)} className="mt-2 rounded-xl border-slate-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clienteIdeal">Cliente ideal <span className="text-red-500">*</span></Label>
                    <Textarea id="clienteIdeal" value={formData.clienteIdeal} onChange={(e) => updateFormData("clienteIdeal", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="presupuestoAds">Presupuesto mensual para Ads <span className="text-red-500">*</span></Label>
                    <Input id="presupuestoAds" value={formData.presupuestoAds} onChange={(e) => updateFormData("presupuestoAds", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 text-slate-900">
                  <Label>¿Redes sociales creadas? <span className="text-red-500">*</span></Label>
                  <RadioGroup value={formData.redesCreadas} onValueChange={(value) => updateFormData("redesCreadas", value)}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="si" id="si" /><Label htmlFor="si">Sí</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">No</Label></div>
                  </RadioGroup>

                  <div className="flex gap-4 justify-center">
                    <button type="button" onClick={() => toggleSocialPlatform("Instagram")} className={`p-4 rounded-xl border-2 ${formData.socialMediaPlatforms.includes("Instagram") ? "border-purple-500 bg-purple-50" : "border-slate-200"}`}><Instagram className="w-8 h-8" /></button>
                    <button type="button" onClick={() => toggleSocialPlatform("Facebook")} className={`p-4 rounded-xl border-2 ${formData.socialMediaPlatforms.includes("Facebook") ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}><Facebook className="w-8 h-8" /></button>
                  </div>

                  {formData.socialMediaPlatforms.includes("Instagram") && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-purple-50 rounded-xl">
                      <Input placeholder="Usuario IG" value={formData.instagramUser} onChange={(e) => updateFormData("instagramUser", e.target.value)} />
                      <Input type="text" placeholder="Pass IG" value={formData.instagramPassword} onChange={(e) => updateFormData("instagramPassword", e.target.value)} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="horarioAtencion">Horario de atención <span className="text-red-500">*</span></Label>
                    <Input id="horarioAtencion" value={formData.horarioAtencion} onChange={(e) => updateFormData("horarioAtencion", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6 text-slate-900">
                  <div className="space-y-2">
                    <Label htmlFor="contactoAprobacion">Contacto para aprobación <span className="text-red-500">*</span></Label>
                    <Input id="contactoAprobacion" value={formData.contactoAprobacion} onChange={(e) => updateFormData("contactoAprobacion", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios adicionales</Label>
                    <Textarea id="comentarios" value={formData.comentarios} onChange={(e) => updateFormData("comentarios", e.target.value)} className="rounded-xl border-slate-300" />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-10">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading} className="rounded-xl border-slate-300">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
                    Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : "Finalizar Onboarding"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}