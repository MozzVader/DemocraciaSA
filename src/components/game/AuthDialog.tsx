'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const signUp = useAuthStore((s) => s.signUp);
  const signIn = useAuthStore((s) => s.signIn);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'register') {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('Cuenta creada. Revisa tu email para confirmar (si es necesario).');
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          onOpenChange(false);
        }
      }
    } catch {
      setError('Error de conexion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { resetForm(); onOpenChange(v); }}>
      <DialogContent
        className="sm:max-w-md border-border/50"
        style={{ background: 'rgba(15, 23, 41, 0.98)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-center" style={{ color: '#d4af37' }}>
            Acceso Clasificado
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {tab === 'login'
              ? '"Ingresá tus credenciales. No le contes a nadie."'
              : '"Registrate. Tu identidad esta a salvo... mas o menos."'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as 'login' | 'register'); setError(''); setSuccess(''); }}>
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-border/30 rounded-none h-auto p-0 mb-4">
            <TabsTrigger
              value="login"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#d4af37] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-[#d4af37] pb-2 text-sm font-semibold"
            >
              Ingresar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#d4af37] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-[#d4af37] pb-2 text-sm font-semibold"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          {/* Google OAuth button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 gap-2 cursor-pointer border-border/50 bg-background/50 hover:bg-background/80 mb-4"
            onClick={() => signInWithGoogle()}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </Button>

          {/* Divider */}
          <div className="relative mb-4">
            <Separator className="border-border/30" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f1729] px-2 text-[10px] text-muted-foreground/50 uppercase tracking-wider">
              o con email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="operador@democracia.sa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border/50 bg-background/50"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-password" className="text-xs uppercase tracking-wider text-muted-foreground">
                Contraseña
              </Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-border/50 bg-background/50"
                autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
              />
              {tab === 'register' && (
                <p className="text-[10px] text-muted-foreground">Minimo 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-2">
                {error}
              </div>
            )}

            {success && (
              <div className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded p-2">
                {success}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
              style={{ background: '#d4af37', color: '#0a0a12' }}
            >
              {loading
                ? 'Procesando...'
                : tab === 'login'
                  ? 'Ingresar al Sistema'
                  : 'Crear Cuenta'}
            </Button>
          </form>
        </Tabs>

        {tab === 'login' && (
          <p className="text-[10px] text-center text-muted-foreground/60 mt-2">
            Sin cuenta? Juga de todos modos. El guardado local siempre funciona.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
