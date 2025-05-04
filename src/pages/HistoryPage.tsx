
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalculations } from "@/contexts/calculations";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, User, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calculation, PartnershipCalculation, TargetCalculation } from "@/types";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { calculations } = useCalculations();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCalculations = calculations
    .filter(calc => {
      const nameMatch = calc.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const partnerMatch = calc.type === 'partnership' && 
        (calc as PartnershipCalculation).partnerName.toLowerCase().includes(searchTerm.toLowerCase());
      const queryMatch = calc.type === 'target' && 
        (calc as TargetCalculation).targetQuery.toLowerCase().includes(searchTerm.toLowerCase());
      
      return nameMatch || partnerMatch || queryMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'basic':
        return 'Базовый';
      case 'partnership':
        return 'Партнерский';
      case 'target':
        return 'Целевой';
      default:
        return type;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy", { locale: ru });
    } catch {
      return dateString;
    }
  };
  
  const formatDateDistance = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ru });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">История расчетов</h1>
        <p className="text-muted-foreground">
          Просмотр ранее выполненных расчетов
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени клиента..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="h-9"
              disabled={!searchTerm}
            >
              Сбросить
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тип</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead className="hidden md:table-cell">Дата рождения</TableHead>
              <TableHead className="hidden lg:table-cell">Дата создания</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalculations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm 
                    ? "Нет результатов по вашему поисковому запросу"
                    : "История расчетов пуста"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredCalculations.map((calculation) => (
                <TableRow key={calculation.id}>
                  <TableCell>
                    <span className="font-medium">{getTypeLabel(calculation.type)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{calculation.clientName}</span>
                    </div>
                    {calculation.type === 'partnership' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        + {calculation.partnerName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(calculation.birthDate)}</span>
                    </div>
                    {calculation.type === 'partnership' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(calculation.partnerBirthDate || '')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div>{formatDate(calculation.createdAt)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateDistance(calculation.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/calculations/${calculation.id}`)}
                    >
                      Открыть
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryPage;
