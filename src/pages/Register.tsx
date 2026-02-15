import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, User, Shield, ShoppingBag, Sparkles, UserPlus } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "usuario">("usuario");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: "Error al registrarse", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Registro exitoso!", description: "Revisa tu email para confirmar tu cuenta." });
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Grace Divine Marketplace
          </h1>
          <p className="text-muted-foreground mt-2">Únete a nuestro marketplace</p>
        </div>

        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              Crear cuenta nueva
            </CardTitle>
            <CardDescription className="text-base">
              Completa los datos para unirte a la comunidad
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Tu nombre completo" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20" 
                    required 
                    maxLength={100} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20" 
                    required 
                    maxLength={255} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Mínimo 6 caracteres" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20" 
                    required 
                    minLength={6} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de cuenta</Label>
                <Select value={role} onValueChange={(v) => setRole(v as "admin" | "usuario")}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Usuario - Comprar productos
                    </SelectItem>
                    <SelectItem value="admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Administrador - Gestionar tienda
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Crear cuenta
                  </div>
                )}
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link 
                    to="/login" 
                    className="text-purple-600 hover:text-purple-700 font-medium underline-offset-4 hover:underline transition-colors"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Al registrarte, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}
