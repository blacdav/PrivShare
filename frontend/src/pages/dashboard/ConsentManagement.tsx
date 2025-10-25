import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface Consent {
  id: string;
  entity: string;
  dataType: string;
  status: "active" | "revoked" | "pending" | "expired";
  grantedAt: string;
  expiresAt: string;
  timestamp: string;
}

export function ConsentManagement() {
  const [consents, setConsents] = useState<Consent[]>([
    {
      id: "1",
      entity: "Hospital X",
      dataType: "Medical Records #245",
      status: "active",
      grantedAt: "2025-09-10",
      expiresAt: "2025-12-01",
      timestamp: "2025-09-10",
    },
    {
      id: "2",
      entity: "Bank Y",
      dataType: "Financial Documents",
      status: "revoked",
      grantedAt: "2025-08-15",
      expiresAt: "2025-11-15",
      timestamp: "2025-10-20",
    },
    {
      id: "3",
      entity: "Insurance Corp",
      dataType: "Health Records",
      status: "active",
      grantedAt: "2025-10-01",
      expiresAt: "2025-12-31",
      timestamp: "2025-10-01",
    },
    {
      id: "4",
      entity: "School District",
      dataType: "Educational Records",
      status: "pending",
      grantedAt: "2025-10-22",
      expiresAt: "2025-10-29",
      timestamp: "2025-10-22",
    },
    {
      id: "5",
      entity: "Government Agency",
      dataType: "Tax Documents",
      status: "expired",
      grantedAt: "2025-07-01",
      expiresAt: "2025-10-01",
      timestamp: "2025-10-01",
    },
  ]);

  const [showNewConsent, setShowNewConsent] = useState(false);
  const [newEntity, setNewEntity] = useState("");
  const [newDataType, setNewDataType] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "revoked":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs">
            Active
          </Badge>
        );
      case "revoked":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20 text-xs">
            Revoked
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 text-xs">
            Pending
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 text-xs">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleRevokeConsent = (id: string) => {
    setConsents(
      consents.map((consent) =>
        consent.id === id ? { ...consent, status: "revoked" as const } : consent
      )
    );
  };

  const handleAddConsent = () => {
    if (newEntity && newDataType) {
      const newConsent: Consent = {
        id: String(consents.length + 1),
        entity: newEntity,
        dataType: newDataType,
        status: "pending",
        grantedAt: new Date().toISOString().split("T")[0],
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        timestamp: new Date().toISOString().split("T")[0],
      };
      setConsents([...consents, newConsent]);
      setNewEntity("");
      setNewDataType("");
      setShowNewConsent(false);
    }
  };

  const activeConsents = consents.filter((c) => c.status === "active").length;
  const revokedConsents = consents.filter((c) => c.status === "revoked").length;
  const pendingConsents = consents.filter((c) => c.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Manage consent
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage who has access to your data and when
          </p>
        </div>
        <Button
          onClick={() => setShowNewConsent(!showNewConsent)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Consents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {activeConsents}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {pendingConsents}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revoked Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {revokedConsents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Consent Form */}
      {showNewConsent && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Grant New Access
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Create a new consent record for an entity to access your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Entity Name
                </label>
                <Input
                  placeholder="e.g., Hospital X, Bank Y"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Data Type
                </label>
                <Input
                  placeholder="e.g., Medical Records, Financial Documents"
                  value={newDataType}
                  onChange={(e) => setNewDataType(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAddConsent} className="sm:flex-1">
                Create Consent
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewConsent(false)}
                className="sm:flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Consent Records</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            All active and historical consent grants for your data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Entity
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Data Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Granted
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Expires
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      Timestamp
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map((consent) => (
                    <tr
                      key={consent.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground text-sm">
                          {consent.entity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {consent.dataType}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(consent.status)}
                          {getStatusBadge(consent.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {consent.grantedAt}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {consent.expiresAt}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {consent.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {consent.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeConsent(consent.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          {consent.status === "expired" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <RefreshCw className="h-4 w-4 text-accent" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4 sm:p-0">
            {consents.map((consent) => (
              <Card key={consent.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-sm">
                        {consent.entity}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {consent.dataType}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(consent.status)}
                      {getStatusBadge(consent.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <div className="font-medium">Granted</div>
                      <div>{consent.grantedAt}</div>
                    </div>
                    <div>
                      <div className="font-medium">Expires</div>
                      <div>{consent.expiresAt}</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium">Timestamp</div>
                    <div>{consent.timestamp}</div>
                  </div>

                  {consent.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeConsent(consent.id)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Revoke Access
                    </Button>
                  )}
                  {consent.status === "expired" && (
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Renew
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            GDPR & Privacy Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Every consent grant and revocation is recorded on the blockchain
            with cryptographic proof of timestamp and user authorization.
          </p>
          <p>
            Consents automatically expire after the specified period, ensuring
            compliance with GDPR Article 7 (Conditions for consent).
          </p>
          <p>
            You can revoke access at any time. Revocation is immediate and
            immutably recorded for audit purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
