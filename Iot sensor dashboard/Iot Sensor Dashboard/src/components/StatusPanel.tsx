import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

interface StatusPanelProps {
  overallStatus: "normal" | "warning" | "danger";
  alerts: Array<{
    id: string;
    message: string;
    severity: "info" | "warning" | "error";
    timestamp: string;
  }>;
}

export function StatusPanel({ overallStatus, alerts }: StatusPanelProps) {
  const getStatusIcon = () => {
    switch (overallStatus) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "danger":
        return <AlertCircle className="h-5 w-5 text-danger" />;
    }
  };

  const getStatusColor = () => {
    switch (overallStatus) {
      case "normal":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "danger":
        return "bg-danger text-danger-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "bg-primary text-primary-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "error":
        return "bg-danger text-danger-foreground";
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">System Status</h3>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        {getStatusIcon()}
        <Badge className={getStatusColor()}>
          System {overallStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Recent Alerts</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/30"
              >
                <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                  {alert.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent alerts</p>
          )}
        </div>
      </div>
    </Card>
  );
}