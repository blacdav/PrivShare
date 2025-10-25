import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileUp,
  Share2,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  Filter,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  status: "success" | "warning" | "error";
  details: string;
  txHash: string;
}

export function AuditTrail() {
  const [logs, _setLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2025-10-22 09:43",
      action: "File Uploaded",
      actor: "User 0x91...",
      resource: "financial_report_2025.pdf",
      status: "success",
      details: "File encrypted with AES-256 and stored",
      txHash: "0x1a2b3c4d5e6f7g8h9i0j",
    },
    {
      id: "2",
      timestamp: "2025-10-22 09:44",
      action: "Access Granted",
      actor: "User 0x91...",
      resource: "medical_records.zip",
      status: "success",
      details: "Consent granted to Hospital X (verified)",
      txHash: "0x2b3c4d5e6f7g8h9i0j1k",
    },
    {
      id: "3",
      timestamp: "2025-10-22 09:45",
      action: "Access Revoked",
      actor: "User 0x91...",
      resource: "contract_draft.docx",
      status: "success",
      details: "Consent revoked for Bank Y",
      txHash: "0x3c4d5e6f7g8h9i0j1k2l",
    },
    {
      id: "4",
      timestamp: "2025-10-22 10:12",
      action: "Data Accessed",
      actor: "Hospital X (0x92...)",
      resource: "medical_records.zip",
      status: "success",
      details: "Authorized access with valid consent",
      txHash: "0x4d5e6f7g8h9i0j1k2l3m",
    },
    {
      id: "5",
      timestamp: "2025-10-22 11:30",
      action: "Unauthorized Access Attempt",
      actor: "Unknown (0x93...)",
      resource: "financial_report_2025.pdf",
      status: "error",
      details: "Access denied - no valid consent",
      txHash: "0x5e6f7g8h9i0j1k2l3m4n",
    },
    {
      id: "6",
      timestamp: "2025-10-22 14:22",
      action: "Compliance Check",
      actor: "System",
      resource: "System Audit",
      status: "success",
      details: "ISO 27001 A.9.2.3 control verified",
      txHash: "0x6f7g8h9i0j1k2l3m4n5o",
    },
    {
      id: "7",
      timestamp: "2025-10-22 15:45",
      action: "Key Rotation",
      actor: "User 0x91...",
      resource: "Encryption Keys",
      status: "warning",
      details: "Key rotation initiated - pending confirmation",
      txHash: "0x7g8h9i0j1k2l3m4n5o6p",
    },
    {
      id: "8",
      timestamp: "2025-10-21 16:20",
      action: "Consent Expired",
      actor: "System",
      resource: "old_data.zip",
      status: "warning",
      details: "Consent for Bank Y expired automatically",
      txHash: "0x8h9i0j1k2l3m4n5o6p7q",
    },
  ]);

  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("All actions");
  const [filterStatus, setFilterStatus] = useState("All statuses");
  const [searchTerm, setSearchTerm] = useState("");

  const getActionIcon = (action: string) => {
    switch (action) {
      case "File Uploaded":
        return <FileUp className="h-5 w-5 text-blue-600" />;
      case "Access Granted":
      case "Data Accessed":
        return <Share2 className="h-5 w-5 text-green-600" />;
      case "Access Revoked":
        return <Lock className="h-5 w-5 text-red-600" />;
      case "Unauthorized Access Attempt":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "Compliance Check":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Key Rotation":
      case "Consent Expired":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <FileUp className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            Success
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            Warning
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser = !filterUser || log.actor.includes(filterUser);
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesStatus = !filterStatus || log.status === filterStatus;

    return matchesSearch && matchesUser && matchesAction && matchesStatus;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">
            Complete immutable record of all platform activities
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {logs.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {logs.filter((l) => l.status === "success").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter((l) => l.status === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search
              </label>
              <Input
                placeholder="Search by file, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                User/Wallet
              </label>
              <Input
                placeholder="Filter by wallet address"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Action
              </label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All actions">All actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All statuses">All statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Chronological record of all blockchain-verified events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex gap-4 pb-4 border-b border-border last:border-0"
                >
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {getActionIcon(log.action)}
                    </div>
                    {index < filteredLogs.length - 1 && (
                      <div className="w-0.5 h-12 bg-border mt-2"></div>
                    )}
                  </div>

                  {/* Log content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {log.action}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.details}
                        </p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Timestamp</p>
                        <p className="font-medium text-foreground">
                          {log.timestamp}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actor</p>
                        <p className="font-medium text-foreground font-mono">
                          {log.actor}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resource</p>
                        <p className="font-medium text-foreground">
                          {log.resource}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Blockchain Proof
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent p-0 h-auto"
                        >
                          <span className="font-mono text-xs">
                            {log.txHash.slice(0, 10)}...
                          </span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No logs match your filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-base">Audit Trail Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Every event is recorded on the BlockDAG blockchain with
            cryptographic proof. Events are immutable and timestamped for
            regulatory compliance.
          </p>
          <p>
            Meets ISO 27001 A.12.4.1 (Event Logging), NIST AU-6 (Audit Review),
            and NIST AU-8 (Time Stamps) requirements.
          </p>
          <p>
            Click blockchain proof links to verify events on the BlockDAG
            explorer. All data is cryptographically signed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
