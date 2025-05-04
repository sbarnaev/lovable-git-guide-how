
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const goToLogin = () => navigate("/login");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/40">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-numerica mb-4">Numerica</h1>
        <h2 className="text-2xl mb-6">Консультационный портал</h2>
        <p className="text-lg mb-8">
          Профессиональный инструмент для консультантов по системному анализу личности
        </p>
        <Button size="lg" onClick={goToLogin} className="px-8">
          Войти в систему
        </Button>
      </div>
    </div>
  );
};

export default Index;
