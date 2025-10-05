import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { AlertTriangle, MapPin, Calendar, ExternalLink } from "lucide-react";
import { EONETEvent } from "@/services/api";
import { Button } from "./ui/button";

interface AlertDetailsProps {
  alert: EONETEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDetails = ({ alert, open, onOpenChange }: AlertDetailsProps) => {
  if (!alert) return null;

  const latestGeometry = alert.geometry[alert.geometry.length - 1];
  const severity = latestGeometry?.magnitudeValue && latestGeometry.magnitudeValue > 70 ? "high" : 
                   latestGeometry?.magnitudeValue && latestGeometry.magnitudeValue > 40 ? "medium" : "low";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-md border-primary/20 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-warning" />
            {alert.title}
          </DialogTitle>
          <DialogDescription>
            {alert.categories[0]?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Badge variant={severity === "high" ? "destructive" : "secondary"}>
              Severidade: {severity === "high" ? "Alta" : severity === "medium" ? "Média" : "Baixa"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Coordenadas: {latestGeometry?.coordinates[1].toFixed(4)}, {latestGeometry?.coordinates[0].toFixed(4)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Última atualização: {new Date(latestGeometry?.date).toLocaleString('pt-BR')}
              </span>
            </div>

            {latestGeometry?.magnitudeValue && (
              <div className="text-sm">
                <span className="text-muted-foreground">
                  Magnitude: {latestGeometry.magnitudeValue} {latestGeometry.magnitudeUnit}
                </span>
              </div>
            )}
          </div>

          {alert.description && (
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-semibold mb-2">Descrição:</h4>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            </div>
          )}

          {alert.sources && alert.sources.length > 0 && (
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-semibold mb-2">Fontes:</h4>
              <div className="space-y-2">
                {alert.sources.map((source: any, idx: number) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <span>{source.id}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-primary/10 pt-4">
            <h4 className="font-semibold mb-2">Recomendações de Segurança:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {alert.categories[0]?.id === "floods" && (
                <>
                  <li>Evite áreas próximas a rios e córregos</li>
                  <li>Não dirija por áreas alagadas</li>
                  <li>Mantenha documentos em local seguro e elevado</li>
                  <li>Tenha um kit de emergência preparado</li>
                </>
              )}
              {alert.categories[0]?.id === "wildfires" && (
                <>
                  <li>Mantenha janelas fechadas para evitar fumaça</li>
                  <li>Prepare-se para evacuação se necessário</li>
                  <li>Tenha água e documentos à mão</li>
                  <li>Siga as instruções das autoridades locais</li>
                </>
              )}
              {alert.categories[0]?.id === "severeStorms" && (
                <>
                  <li>Procure abrigo em local seguro</li>
                  <li>Evite áreas abertas e árvores</li>
                  <li>Desligue aparelhos eletrônicos da tomada</li>
                  <li>Mantenha-se informado sobre a evolução da tempestade</li>
                </>
              )}
              {(alert.categories[0]?.id === "earthquakes" || alert.categories[0]?.id === "volcanoes") && (
                <>
                  <li>Proteja-se debaixo de móveis resistentes</li>
                  <li>Afaste-se de janelas e objetos que possam cair</li>
                  <li>Esteja preparado para réplicas</li>
                  <li>Tenha um plano de evacuação</li>
                </>
              )}
            </ul>
          </div>

          {alert.geometry.length > 1 && (
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-semibold mb-2">Histórico do Evento ({alert.geometry.length} pontos)</h4>
              <p className="text-xs text-muted-foreground">
                De {new Date(alert.geometry[0].date).toLocaleDateString('pt-BR')} até {new Date(latestGeometry.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetails;
