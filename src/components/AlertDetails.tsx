import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Calendar, Info } from "lucide-react";

interface Alert {
  id: number;
  type: string;
  severity: string;
  location: string;
  icon: any;
  color: string;
}

interface AlertDetailsProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDetails = ({ alert, open, onOpenChange }: AlertDetailsProps) => {
  if (!alert) return null;

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      flood: "Inundação",
      fire: "Incêndio",
      storm: "Tempestade",
    };
    return types[type] || type;
  };

  const getSeverityLabel = (severity: string) => {
    const severities: Record<string, string> = {
      high: "Alto",
      medium: "Médio",
      low: "Baixo",
    };
    return severities[severity] || severity;
  };

  const getRecommendations = (type: string) => {
    const recommendations: Record<string, string[]> = {
      flood: [
        "Mova-se para áreas mais elevadas imediatamente",
        "Evite atravessar águas em movimento",
        "Desligue a energia elétrica se houver risco de inundação",
        "Mantenha-se informado através dos canais oficiais",
        "Prepare um kit de emergência com água, alimentos e documentos",
      ],
      fire: [
        "Evacue a área imediatamente se ordenado",
        "Mantenha portas e janelas fechadas",
        "Use um pano úmido para cobrir nariz e boca",
        "Fique longe de áreas com fumaça densa",
        "Siga as rotas de evacuação designadas",
      ],
      storm: [
        "Procure abrigo em local seguro",
        "Afaste-se de janelas e portas",
        "Evite usar equipamentos elétricos",
        "Não saia durante a tempestade",
        "Tenha água potável e alimentos não perecíveis",
      ],
    };
    return recommendations[type] || [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <alert.icon className={`h-8 w-8 text-${alert.color}`} />
            Detalhes do Alerta - {getTypeLabel(alert.type)}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas e recomendações de segurança
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">{alert.location}</span>
            </div>
            <Badge
              variant={alert.severity === "high" ? "destructive" : "secondary"}
              className="animate-glow-pulse"
            >
              Severidade: {getSeverityLabel(alert.severity)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Atualizado: {new Date().toLocaleString('pt-BR')}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold">Recomendações de Segurança</h3>
            </div>
            <ul className="space-y-2 pl-7">
              {getRecommendations(alert.type).map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-warning/10 border border-warning/20 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-warning mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-warning">Importante</p>
                <p className="text-sm text-muted-foreground">
                  Siga sempre as instruções das autoridades locais e mantenha-se informado
                  através dos canais oficiais de comunicação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetails;
