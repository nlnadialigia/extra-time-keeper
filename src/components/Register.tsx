"use client";

import {registerUser} from "@/app/actions/user";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {Link} from "@/i18n/routing";
import {registerSchema} from "@/lib/validations/user";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckCircle2, Clock, Eye, EyeOff, XCircle} from "lucide-react";
import {signIn} from "next-auth/react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const t = useTranslations("Register");
  const tc = useTranslations("Common");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");

  // Validações de força da senha
  const passwordStrength = {
    hasMinLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password || ""),
    hasLowerCase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await registerUser(data);

      if (result.success) {
        toast({
          title: t("successTitle"),
          description: result.message,
        });
        router.push("/");
      } else {
        toast({
          title: t("errorTitle"),
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: tc("error"),
        description: t("genericError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <Clock className="h-16 w-16 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">
            {tc("title")}
          </h1>
          <p className="text-lg text-white/80">
            {tc("title")} - {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <div className="inline-flex items-center gap-3 rounded-xl p-3" style={{backgroundColor: 'hsl(var(--primary))'}}>
              <Clock className="h-8 w-8" style={{color: 'hsl(var(--primary-foreground))'}} />
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold" style={{color: 'hsl(var(--foreground))'}}>
              {t("title")}
            </h2>
            <p className="mt-2" style={{color: 'hsl(var(--muted-foreground))'}}>
              {t("description")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("namePlaceholder")}
                {...register("name")}
                className="h-12"
              />
              {errors.name && (
                <p className="text-sm" style={{color: 'hsl(var(--destructive))'}}>{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm" style={{color: 'hsl(var(--destructive))'}}>{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color: 'hsl(var(--muted-foreground))'}}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Indicador de força da senha */}
              {password && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3" style={{color: 'hsl(var(--muted-foreground))'}} />
                    )}
                    <span style={{color: passwordStrength.hasMinLength ? '#22c55e' : 'hsl(var(--muted-foreground))'}}>
                      {t("minChars")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3" style={{color: 'hsl(var(--muted-foreground))'}} />
                    )}
                    <span style={{color: passwordStrength.hasUpperCase ? '#22c55e' : 'hsl(var(--muted-foreground))'}}>
                      {t("uppercase")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasLowerCase ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3" style={{color: 'hsl(var(--muted-foreground))'}} />
                    )}
                    <span style={{color: passwordStrength.hasLowerCase ? '#22c55e' : 'hsl(var(--muted-foreground))'}}>
                      {t("lowercase")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3" style={{color: 'hsl(var(--muted-foreground))'}} />
                    )}
                    <span style={{color: passwordStrength.hasNumber ? '#22c55e' : 'hsl(var(--muted-foreground))'}}>
                      {t("number")}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-sm" style={{color: 'hsl(var(--destructive))'}}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color: 'hsl(var(--muted-foreground))'}}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm" style={{color: 'hsl(var(--destructive))'}}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("submitting")}
                </div>
              ) : (
                t("submit")
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("alternative")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("google")}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm" style={{color: 'hsl(var(--muted-foreground))'}}>
            {t("hasAccount")}{" "}
            <Link href="/" className="font-medium hover:underline" style={{color: 'hsl(var(--primary))'}}>
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
