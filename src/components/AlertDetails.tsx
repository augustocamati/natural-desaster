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
              Severity: {severity === "high" ? "High" : severity === "medium" ? "Medium" : "Low"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Coordinates: {latestGeometry?.coordinates[1].toFixed(4)}, {latestGeometry?.coordinates[0].toFixed(4)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Last update: {new Date(latestGeometry?.date).toLocaleString('en-US')}
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
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            </div>
          )}

          {alert.sources && alert.sources.length > 0 && (
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-semibold mb-2">Sources:</h4>
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
            <h4 className="font-semibold mb-2">Safety Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {alert.categories[0]?.id === "floods" && (
                <>
                  <li>Avoid areas near rivers and streams</li>
                  <li>Do not drive through flooded areas</li>
                  <li>Keep documents in a safe, elevated location</li>
                  <li>Have an emergency kit ready</li>
                </>
              )}
              {alert.categories[0]?.id === "wildfires" && (
                <>
                  <li>Keep windows closed to avoid smoke</li>
                  <li>Be ready to evacuate if necessary</li>
                  <li>Have water and documents at hand</li>
                  <li>Follow instructions from local authorities</li>
                </>
              )}
              {alert.categories[0]?.id === "severeStorms" && (
                <>
                  <li>Seek shelter in a safe location</li>
                  <li>Avoid open areas and trees</li>
                  <li>Unplug electronic devices</li>
                  <li>Stay informed about storm developments</li>
                </>
              )}
              {(alert.categories[0]?.id === "earthquakes" || alert.categories[0]?.id === "volcanoes") && (
                <>
                  <li>Take cover under sturdy furniture</li>
                  <li>Stay away from windows and falling objects</li>
                  <li>Be prepared for aftershocks</li>
                  <li>Have an evacuation plan</li>
                </>
              )}
            </ul>
          </div>

          {alert.geometry.length > 1 && (
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-semibold mb-2">Event History ({alert.geometry.length} points)</h4>
              <p className="text-xs text-muted-foreground">
                From {new Date(alert.geometry[0].date).toLocaleDateString('en-US')} to {new Date(latestGeometry.date).toLocaleDateString('en-US')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetails;
