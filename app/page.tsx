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

  const handleSubmit = () => {
    if (validateStep(5)) {
      console.log("Form submitted:", formData)
      setIsSubmitted(true)
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return User
      case 2:
        return Building2
      case 3:
        return Target
      case 4:
        return Globe
      case 5:
        return FileCheck
      default:
        return User
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
            <a
              href="https://www.swipe.com.do"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-slate-700 transition-colors"
            >
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
                src="/images/logotipo-principal.png"
                alt="Swipe Logo"
                className="max-h-[80px] w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3 text-balance">🚀 Formulario de Onboarding</h1>
            <p className="text-slate-700 leading-relaxed max-w-2xl mx-auto text-pretty">
              ¡Hola! Bienvenido a la familia de Swipe. Estamos muy emocionados de empezar a trabajar con tu marca. Este
              formulario es el primer paso para construir una estrategia sólida y personalizada.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">
                Paso {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-slate-900">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Form Card */}
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
                  <CardDescription className="text-white/80">
                    Completa todos los campos requeridos para continuar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-6">
              {/* Step 1: Datos de Identificación */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombreCompleto" className="text-slate-700 dark:text-slate-200">
                      Nombre completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombreCompleto"
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombreCompleto}
                      onChange={(e) => updateFormData("nombreCompleto", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-slate-700 dark:text-slate-200">
                      Cargo en la empresa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cargo"
                      placeholder="Ej: CEO, Gerente de Marketing, Dueño"
                      value={formData.cargo}
                      onChange={(e) => updateFormData("cargo", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                      Correo electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@empresa.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-slate-700 dark:text-slate-200">
                      Teléfono / WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telefono"
                      placeholder="Ej: +1 809 000 0000"
                      value={formData.telefono}
                      onChange={(e) => updateFormData("telefono", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: ADN de Marca */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombreMarca" className="text-slate-700 dark:text-slate-200">
                      Nombre de la marca <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombreMarca"
                      placeholder="Ej: Swipe Agency"
                      value={formData.nombreMarca}
                      onChange={(e) => updateFormData("nombreMarca", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-slate-700 dark:text-slate-200">
                      Descripción de lo que hacen <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Ej: Somos una empresa que se dedica al sector automotriz, especializada en ventas de repuestos."
                      value={formData.descripcion}
                      onChange={(e) => updateFormData("descripcion", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="misionVisionValores" className="text-slate-700 dark:text-slate-200">
                      Misión, Visión y Valores <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="misionVisionValores"
                      placeholder="Ej: Nuestra misión es liderar el mercado con honestidad..."
                      value={formData.misionVisionValores}
                      onChange={(e) => updateFormData("misionVisionValores", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="elementoDiferenciador" className="text-slate-700 dark:text-slate-200">
                      Elemento diferenciador <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="elementoDiferenciador"
                      placeholder="Ej: Ofrecemos garantía de por vida y atención 24/7."
                      value={formData.elementoDiferenciador}
                      onChange={(e) => updateFormData("elementoDiferenciador", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalidad" className="text-slate-700 dark:text-slate-200">
                      Personalidad de marca (3 adjetivos) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="personalidad"
                      placeholder="Ej: Juvenil, Técnica, Disruptiva"
                      value={formData.personalidad}
                      onChange={(e) => updateFormData("personalidad", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competidores" className="text-slate-700 dark:text-slate-200">
                      Principales competidores <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="competidores"
                      placeholder="Ej: Empresa X, Perfil de Instagram @competidor"
                      value={formData.competidores}
                      onChange={(e) => updateFormData("competidores", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Estrategia y Objetivos */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-200">
                      Objetivos principales <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      {["Más ventas", "Seguidores", "Posicionamiento", "Imagen visual", "Otro"].map((objetivo) => (
                        <div key={objetivo} className="flex items-center space-x-2">
                          <Checkbox
                            id={objetivo}
                            checked={formData.objetivos.includes(objetivo)}
                            onCheckedChange={() => toggleObjective(objetivo)}
                            className="rounded"
                          />
                          <Label
                            htmlFor={objetivo}
                            className="text-sm font-normal cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            {objetivo}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.objetivos.includes("Otro") && (
                      <div className="space-y-2 mt-4 pl-6 border-l-2 border-blue-500">
                        <Label htmlFor="otroObjetivo" className="text-slate-700 dark:text-slate-200">
                          Por favor, especifica tu otro objetivo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="otroObjetivo"
                          placeholder="Describe tu objetivo personalizado..."
                          value={formData.otroObjetivo}
                          onChange={(e) => updateFormData("otroObjetivo", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteIdeal" className="text-slate-700 dark:text-slate-200">
                      Cliente ideal <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="clienteIdeal"
                      placeholder="Ej: Hombres de 25-40 años interesados en tecnología que viven en Madrid."
                      value={formData.clienteIdeal}
                      onChange={(e) => updateFormData("clienteIdeal", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materialGrafico" className="text-slate-700 dark:text-slate-200">
                      Material gráfico (Link Drive/Dropbox)
                    </Label>
                    <Input
                      id="materialGrafico"
                      placeholder="pega aquí tu enlace de Google Drive o Dropbox"
                      value={formData.materialGrafico}
                      onChange={(e) => updateFormData("materialGrafico", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="presupuestoAds" className="text-slate-700 dark:text-slate-200">
                      Presupuesto mensual para Ads <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="presupuestoAds"
                      placeholder="Ej: 500 USD mensuales"
                      value={formData.presupuestoAds}
                      onChange={(e) => updateFormData("presupuestoAds", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Ecosistema Digital */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-200">
                      ¿Redes sociales creadas? <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.redesCreadas}
                      onValueChange={(value) => updateFormData("redesCreadas", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si" />
                        <Label htmlFor="si" className="font-normal cursor-pointer text-slate-700 dark:text-slate-200">
                          Sí
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="font-normal cursor-pointer text-slate-700 dark:text-slate-200">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-slate-700 dark:text-slate-200">Credenciales de Redes Sociales</Label>
                    <p className="text-sm text-slate-500">Selecciona las plataformas y proporciona tus credenciales</p>

                    {/* Social Media Platform Selection */}
                    <div className="flex gap-4 justify-center">
                      <button
                        type="button"
                        onClick={() => toggleSocialPlatform("Instagram")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          formData.socialMediaPlatforms.includes("Instagram")
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-200 bg-white hover:border-purple-300"
                        }`}
                      >
                        <Instagram
                          className={`w-8 h-8 ${
                            formData.socialMediaPlatforms.includes("Instagram") ? "text-purple-600" : "text-slate-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.socialMediaPlatforms.includes("Instagram") ? "text-purple-600" : "text-slate-600"
                          }`}
                        >
                          Instagram
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSocialPlatform("Facebook")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          formData.socialMediaPlatforms.includes("Facebook")
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <Facebook
                          className={`w-8 h-8 ${
                            formData.socialMediaPlatforms.includes("Facebook") ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.socialMediaPlatforms.includes("Facebook") ? "text-blue-600" : "text-slate-600"
                          }`}
                        >
                          Facebook
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSocialPlatform("LinkedIn")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          formData.socialMediaPlatforms.includes("LinkedIn")
                            ? "border-blue-800 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <Linkedin
                          className={`w-8 h-8 ${
                            formData.socialMediaPlatforms.includes("LinkedIn") ? "text-blue-800" : "text-slate-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.socialMediaPlatforms.includes("LinkedIn") ? "text-blue-800" : "text-slate-600"
                          }`}
                        >
                          LinkedIn
                        </span>
                      </button>
                    </div>

                    {/* Instagram Credentials */}
                    {formData.socialMediaPlatforms.includes("Instagram") && (
                      <div className="space-y-3 p-4 border border-purple-200 rounded-xl bg-purple-50/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Instagram className="w-5 h-5 text-purple-600" />
                          <Label className="text-purple-900 font-semibold">Instagram</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="instagramUser" className="text-slate-700 text-sm">
                              Usuario
                            </Label>
                            <Input
                              id="instagramUser"
                              placeholder="@usuario_ejemplo"
                              value={formData.instagramUser}
                              onChange={(e) => updateFormData("instagramUser", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagramPassword" className="text-slate-700 text-sm">
                              Contraseña
                            </Label>
                            <Input
                              id="instagramPassword"
                              type="text"
                              placeholder="tu_clave_aquí"
                              value={formData.instagramPassword}
                              onChange={(e) => updateFormData("instagramPassword", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Facebook Credentials */}
                    {formData.socialMediaPlatforms.includes("Facebook") && (
                      <div className="space-y-3 p-4 border border-blue-200 rounded-xl bg-blue-50/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <Label className="text-blue-900 font-semibold">Facebook</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="facebookEmail" className="text-slate-700 text-sm">
                              Correo
                            </Label>
                            <Input
                              id="facebookEmail"
                              type="email"
                              placeholder="ejemplo@correo.com"
                              value={formData.facebookEmail}
                              onChange={(e) => updateFormData("facebookEmail", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="facebookPassword" className="text-slate-700 text-sm">
                              Contraseña
                            </Label>
                            <Input
                              id="facebookPassword"
                              type="text"
                              placeholder="tu_clave_aquí"
                              value={formData.facebookPassword}
                              onChange={(e) => updateFormData("facebookPassword", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Credentials */}
                    {formData.socialMediaPlatforms.includes("LinkedIn") && (
                      <div className="space-y-3 p-4 border border-blue-300 rounded-xl bg-blue-50/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Linkedin className="w-5 h-5 text-blue-800" />
                          <Label className="text-blue-900 font-semibold">LinkedIn</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="linkedinEmail" className="text-slate-700 text-sm">
                              Correo
                            </Label>
                            <Input
                              id="linkedinEmail"
                              type="email"
                              placeholder="ejemplo@correo.com"
                              value={formData.linkedinEmail}
                              onChange={(e) => updateFormData("linkedinEmail", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedinPassword" className="text-slate-700 text-sm">
                              Contraseña
                            </Label>
                            <Input
                              id="linkedinPassword"
                              type="text"
                              placeholder="tu_clave_aquí"
                              value={formData.linkedinPassword}
                              onChange={(e) => updateFormData("linkedinPassword", e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horarioAtencion" className="text-slate-700 dark:text-slate-200">
                      Horario de atención <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="horarioAtencion"
                      placeholder="Ej: Lunes a Viernes de 9:00 AM a 6:00 PM"
                      value={formData.horarioAtencion}
                      onChange={(e) => updateFormData("horarioAtencion", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="text-slate-700 dark:text-slate-200">
                      Dirección física
                    </Label>
                    <Input
                      id="direccion"
                      placeholder="Ej: Av. Principal #123, Edificio Swipe, Piso 2"
                      value={formData.direccion}
                      onChange={(e) => updateFormData("direccion", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappClientes" className="text-slate-700 dark:text-slate-200">
                      WhatsApp para clientes
                    </Label>
                    <Input
                      id="whatsappClientes"
                      placeholder="Ej: ventas@marca.com / +1 829 000 0000"
                      value={formData.whatsappClientes}
                      onChange={(e) => updateFormData("whatsappClientes", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Cierre Operativo */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactoAprobacion" className="text-slate-700 dark:text-slate-200">
                      Contacto para aprobación <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactoAprobacion"
                      placeholder="Ej: María García - +1 849 000 0000"
                      value={formData.contactoAprobacion}
                      onChange={(e) => updateFormData("contactoAprobacion", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios" className="text-slate-700 dark:text-slate-200">
                      Comentarios adicionales
                    </Label>
                    <Textarea
                      id="comentarios"
                      placeholder="Ej: Me gustaría enfocar la campaña en el lanzamiento de verano."
                      value={formData.comentarios}
                      onChange={(e) => updateFormData("comentarios", e.target.value)}
                      className="rounded-xl min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="rounded-xl bg-transparent border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep(5)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enviar
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="py-6 text-center">
        <p className="text-sm text-slate-500">
          © 2026 Swipe. Todos los derechos reservados |{" "}
          <a
            href="https://www.swipe.com.do"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-slate-700 transition-colors"
          >
            www.swipe.com.do
          </a>
        </p>
      </footer>
    </>
  )
}
