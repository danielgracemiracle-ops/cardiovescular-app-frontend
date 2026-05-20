'use client'

import { HeartPulse, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">CardioInsight</h1>
            <p className="text-xs text-muted-foreground">Cardiovascular Risk Prediction</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="About CardioInsight">
              <Info className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-secondary" />
                About CardioInsight
              </DialogTitle>
              <DialogDescription>
                Machine learning-powered cardiovascular disease risk prediction application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">What is Cardiovascular Disease?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Cardiovascular disease refers to conditions affecting the heart and blood vessels, 
                  including coronary heart disease, stroke, and heart failure. It is the leading 
                  cause of death worldwide.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">How Does This App Work?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  This application uses a machine learning model trained on 70,000 health records 
                  to predict cardiovascular risk based on age, blood pressure, cholesterol, 
                  and lifestyle factors.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> The prediction results are 
                  educational and not a medical diagnosis. Always consult a healthcare professional.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
