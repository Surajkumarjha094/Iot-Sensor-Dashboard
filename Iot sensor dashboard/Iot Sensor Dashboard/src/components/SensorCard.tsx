import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  type: "temperature" | "humidity" | "gas";
  status: "normal" | "warning" | "danger";
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "bg-success text-success-foreground";
    case "warning":
      return "bg-warning text-warning-foreground";
    case "danger":
      return "bg-danger text-danger-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCardGradient = (type: string) => {
  switch (type) {
    case "temperature":
      return "bg-gradient-to-br from-temperature/20 to-temperature/5 border-temperature/30";
    case "humidity":
      return "bg-gradient-to-br from-humidity/20 to-humidity/5 border-humidity/30";
    case "gas":
      return "bg-gradient-to-br from-gas/20 to-gas/5 border-gas/30";
    default:
      return "bg-gradient-to-br from-muted/20 to-muted/5 border-muted/30";
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "temperature":
      return <Thermometer className="h-6 w-6 text-temperature" />;
    case "humidity":
      return <Droplets className="h-6 w-6 text-humidity" />;
    case "gas":
      return <AlertTriangle className="h-6 w-6 text-gas" />;
    default:
      return null;
  }
};

export function SensorCard({
  title,
  value,
  unit,
  type,
  status,
  className
}: SensorCardProps) {
  return (
    <Card className={cn(
      "p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg",
      getCardGradient(type),
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getIcon(type)}
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-foreground">
              {value.toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </div>
          </div>
        </div>
        <Badge className={cn("capitalize", getStatusColor(status))}>
          {status}
        </Badge>
      </div>
      
      {/* Animated background effect */}
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <div className="w-24 h-24 rounded-full bg-current animate-pulse"></div>
      </div>
    </Card>
  );
}