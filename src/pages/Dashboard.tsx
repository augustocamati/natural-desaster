import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { nasaService, EONETEvent } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CloudRain, Flame, Wind, LogOut, MessageSquare, Loader2 } from "lucide-react";
import Map from "@/components/Map";
import AlertDetails from "@/components/AlertDetails";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EONETEvent[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EONETEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const loadEvents = async () => {
      try {
        const data = await nasaService.getEvents({ status: 'open', limit: 50 });
        setEvents(data);
      } catch (error: any) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [isAuthenticated, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'floods': return CloudRain;
      case 'wildfires': return Flame;
      case 'severeStorms': return Wind;
      default: return AlertTriangle;
    }
  };

  const getSeverity = (event: EONETEvent): 'high' | 'medium' | 'low' => {
    const magnitude = event.geometry[0]?.magnitudeValue;
    if (!magnitude) return 'low';
    if (magnitude > 70) return 'high';
    if (magnitude > 40) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-primary/20 backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Natural Disasters
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/chat")}
              className="border-primary/20 hover:bg-primary/10"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Agente IA
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-primary/20 hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Dashboard de Alertas</h2>
          <p className="text-muted-foreground">
            Monitore riscos de desastres naturais em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 12).map((event, index) => {
            const Icon = getCategoryIcon(event.categories[0]?.id);
            const severity = getSeverity(event);
            const latestGeometry = event.geometry[event.geometry.length - 1];
            
            return (
              <Card
                key={event.id}
                className="border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge
                      variant={severity === "high" ? "destructive" : "secondary"}
                      className="animate-glow-pulse"
                    >
                      {severity === "high" ? "Alto" : severity === "medium" ? "Médio" : "Baixo"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-lg line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Categoria: {event.categories[0]?.title}
                  </p>
                  {latestGeometry?.magnitudeValue && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Magnitude: {latestGeometry.magnitudeValue} {latestGeometry.magnitudeUnit}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Última atualização: {new Date(latestGeometry?.date).toLocaleDateString('pt-BR')}
                  </p>
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary-glow text-background"
                    onClick={() => {
                      setSelectedAlert(event);
                      setDialogOpen(true);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 border-primary/20 bg-card/80 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-warning" />
              Mapa de Alertas Interativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border border-primary/10">
              <Map events={events} />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDetails 
        alert={selectedAlert}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Dashboard;