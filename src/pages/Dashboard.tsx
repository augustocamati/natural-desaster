import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CloudRain, Flame, Wind, LogOut, MessageSquare } from "lucide-react";
import Map from "@/components/Map";
import AlertDetails from "@/components/AlertDetails";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary animate-glow-pulse">Carregando...</div>
      </div>
    );
  }

  const alerts = [
    { id: 1, type: "flood", severity: "high", location: "São Paulo, Brasil", icon: CloudRain, color: "primary" },
    { id: 2, type: "fire", severity: "medium", location: "Califórnia, EUA", icon: Flame, color: "warning" },
    { id: 3, type: "storm", severity: "low", location: "Flórida, EUA", icon: Wind, color: "accent" },
  ];

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
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <Card
                key={alert.id}
                className="border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className={`h-8 w-8 text-${alert.color}`} />
                    <Badge
                      variant={alert.severity === "high" ? "destructive" : "secondary"}
                      className="animate-glow-pulse"
                    >
                      {alert.severity === "high" ? "Alto" : alert.severity === "medium" ? "Médio" : "Baixo"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{alert.location}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tipo: {alert.type === "flood" ? "Inundação" : alert.type === "fire" ? "Incêndio" : "Tempestade"}
                  </p>
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary-glow text-background"
                    onClick={() => {
                      setSelectedAlert(alert);
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
              <Map />
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