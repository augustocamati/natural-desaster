import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Satellite, Shield, AlertTriangle, MapPin, MessageSquare, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: AlertTriangle,
      title: "Alertas em Tempo Real",
      description: "Receba notificações instantâneas sobre riscos de desastres naturais na sua região",
    },
    {
      icon: MessageSquare,
      title: "Agente IA Inteligente",
      description: "Chatbot interativo com checklists personalizados e orientações de proteção",
    },
    {
      icon: MapPin,
      title: "Localização Personalizada",
      description: "Alertas geo-referenciados para seu continente, país e estado",
    },
    {
      icon: BarChart3,
      title: "Previsão com IA",
      description: "Motor de previsão baseado em dados da NASA e machine learning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <nav className="relative border-b border-primary/20 backdrop-blur-sm bg-card/30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="h-6 w-6 text-primary animate-glow-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Natural Disasters
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="hover:bg-primary/10"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary-glow text-background font-semibold"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-scale-in">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">NASA Space Apps Challenge 2025</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Previsão e Proteção
              </span>
              <br />
              Inteligente contra
              <br />
              <span className="bg-gradient-to-r from-warning to-destructive bg-clip-text text-transparent">
                Catástrofes
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Sistema de alerta antecipado que transforma dados abertos da NASA em segurança personalizada
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary-glow text-background font-semibold text-lg px-8 py-6 animate-glow-pulse"
              >
                <Satellite className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-lg px-8 py-6"
              >
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Como <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Funciona</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta com dados da NASA para sua segurança
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Pronto para se <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Proteger</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de usuários que confiam no Natural Disasters para sua segurança
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary-glow text-background font-semibold text-lg px-8 py-6"
            >
              Criar Conta Gratuita
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Natural Disasters. Desenvolvido para NASA Space Apps Challenge 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
