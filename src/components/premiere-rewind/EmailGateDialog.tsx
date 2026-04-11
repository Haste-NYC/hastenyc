import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { premiereRewindButtonClassName } from '@/components/premiere-rewind/buttonStyles';

interface EmailGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSubmitted: () => void;
  fileName: string;
}

export function EmailGateDialog({ open, onOpenChange, onEmailSubmitted, fileName }: EmailGateDialogProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/notify/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: 'premiere-rewind' }),
      });

      if (!res.ok) {
        console.error('[EmailGate] Signup API error:', res.status);
      }

      // Store email in localStorage to not ask again
      localStorage.setItem('prproj_email', email.trim().toLowerCase());
      
      onEmailSubmitted();
      onOpenChange(false);
      setEmail('');
    } catch (err) {
      console.error('[EmailGate] Error:', err);
      // Still allow download
      onEmailSubmitted();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get your free download</DialogTitle>
          <DialogDescription>
            Enter your email to download <span className="font-medium text-foreground">{fileName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-email-gate="true"
              className="focus:border-input focus:outline-none focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className={`w-full ${premiereRewindButtonClassName}`} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We'll occasionally send you updates. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
