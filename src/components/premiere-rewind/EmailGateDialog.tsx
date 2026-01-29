import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('mailing_list')
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        console.error('[EmailGate] Insert error:', error);
        // Don't block download on error, just log it
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
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
