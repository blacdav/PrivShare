import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface ComplianceControl {
  id: string;
  standard: string;
  control: string;
  description: string;
  status: "pass" | "warning" | "fail";
  evidence: string;
  lastChecked: string;
}

export function ControlDetails() {
  const [activeTab, setActiveTab] = useState("overview");

  const overviewData = [
    { name: "Access Control", value: 95, fill: "#10b981" },
    { name: "Encryption", value: 100, fill: "#3b82f6" },
    { name: "Logging", value: 88, fill: "#f59e0b" },
  ];

  const trendData = [
    { month: "Jun", compliance: 82 },
    { month: "Jul", compliance: 85 },
    { month: "Aug", compliance: 88 },
    { month: "Sep", compliance: 91 },
    { month: "Oct", compliance: 94 },
  ];

  const controls: ComplianceControl[] = [
    {
      id: "1",
      standard: "ISO 27001",
      control: "A.9.2.3",
      description: "Privileged Access Management",
      status: "pass",
      evidence: "Blockchain log #12345",
      lastChecked: "2025-10-22",
    },
    {
      id: "2",
      standard: "ISO 27001",
      control: "A.12.4.1",
      description: "Event Logging",
      status: "pass",
      evidence: "Blockchain log #12346",
      lastChecked: "2025-10-22",
    },
    {
      id: "3",
      standard: "NIST",
      control: "AU-6",
      description: "Audit Review, Analysis, and Reporting",
      status: "pass",
      evidence: "Blockchain log #12347",
      lastChecked: "2025-10-22",
    },
    {
      id: "4",
      standard: "NIST",
      control: "AU-8",
      description: "Time Stamps",
      status: "pass",
      evidence: "Blockchain log #12348",
      lastChecked: "2025-10-22",
    },
    {
      id: "5",
      standard: "ISO 27001",
      control: "A.18.1.4",
      description: "Ensure data sharing is backed by users' consent",
      status: "warning",
      evidence: "Pending verification",
      lastChecked: "2025-10-21",
    },
    {
      id: "6",
      standard: "ISO 27001",
      control: "A.10.4.1",
      description: "Confirm system logs are being reviewed",
      status: "warning",
      evidence: "Scheduled for 2025-10-25",
      lastChecked: "2025-10-20",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case "warning":
        return (
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
        );
      case "fail":
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs">
            Pass
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 text-xs">
            Warning
          </Badge>
        );
      case "fail":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20 text-xs">
            Fail
          </Badge>
        );
      default:
        return null;
    }
  };

  const passCount = controls.filter((c) => c.status === "pass").length;
  const warningCount = controls.filter((c) => c.status === "warning").length;
  const failCount = controls.filter((c) => c.status === "fail").length;
  const complianceScore = Math.round((passCount / controls.length) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Compliance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            ISO 27001 & NIST compliance monitoring
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {complianceScore}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last audit: 2 days ago
            </p>
          </CardContent>
        </Card>
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Controls Passing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
              {passCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {controls.length} controls
            </p>
          </CardContent>
        </Card>
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
              {warningCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card className="sm:min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
              {failCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate action needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="controls" className="text-xs sm:text-sm">
            Control Details
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Control Categories
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Distribution of compliance controls by category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={overviewData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Status Summary
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Current compliance status across all controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      <span className="text-sm font-medium text-foreground">
                        Passing
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {passCount}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(passCount / controls.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-foreground">
                        Warnings
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {warningCount}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: `${(warningCount / controls.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                      <span className="text-sm font-medium text-foreground">
                        Failures
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {failCount}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${(failCount / controls.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Control Details Tab */}
        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Control Matrix
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Detailed status of all compliance controls
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
                          Standard
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                          Control
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                          Evidence
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                          Last Checked
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {controls.map((control) => (
                        <tr
                          key={control.id}
                          className="border-b border-border hover:bg-muted/50 transition"
                        >
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">
                              {control.standard}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground text-sm">
                            {control.control}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {control.description}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(control.status)}
                              {getStatusBadge(control.status)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent hover:text-accent text-xs"
                            >
                              {control.evidence}
                            </Button>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {control.lastChecked}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {controls.map((control) => (
                  <Card key={control.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {control.standard}
                            </Badge>
                            <span className="font-semibold text-foreground text-sm">
                              {control.control}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {control.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(control.status)}
                          {getStatusBadge(control.status)}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span className="font-medium">Evidence:</span>
                          <span className="text-accent">
                            {control.evidence}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Last Checked:</span>
                          <span>{control.lastChecked}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        View Evidence
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Compliance Trend
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Historical compliance score over the last 5 months
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="compliance"
                    fill="var(--color-accent)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compliance Info */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            About This Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This dashboard monitors compliance with ISO 27001 and NIST
            standards. All controls are verified through blockchain-backed audit
            logs.
          </p>
          <p>
            Controls are automatically checked daily. Evidence links point to
            immutable blockchain records that prove compliance.
          </p>
          <p>
            Export compliance reports for regulatory submissions. All data is
            cryptographically signed and timestamped.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
