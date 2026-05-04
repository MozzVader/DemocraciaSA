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
