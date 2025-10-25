import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Users, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardOverview() {
  const stats = [
    {
      title: "Files Uploaded",
      value: "12",
      description: "Total encrypted files",
      icon: FileUp,
      color: "text-blue-500",
    },
    {
      title: "Active Shares",
      value: "8",
      description: "Active access grants",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Encryption Status",
      value: "100%",
      description: "All files encrypted",
      icon: Lock,
      color: "text-purple-500",
    },
    // {
    //   title: "Compliance Score",
    //   value: "94%",
    //   description: "ISO/NIST compliant",
    //   icon: AlertCircle,
    //   color: "text-orange-500",
    // },
  ];

  const recentActivity = [
    {
      action: "File uploaded",
      file: "financial_report_2025.pdf",
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      action: "Access granted",
      file: "medical_records.zip",
      entity: "Hospital X",
      timestamp: "5 hours ago",
      status: "success",
    },
    {
      action: "Access revoked",
      file: "contract_draft.docx",
      entity: "Bank Y",
      timestamp: "1 day ago",
      status: "warning",
    },
    {
      action: "Compliance check",
      file: "System audit",
      timestamp: "2 days ago",
      status: "success",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your data overview.
          </p>
        </div>
        <Button asChild style={{ backgroundColor: "#00B495" }}>
          <Link to="/dashboard/data" key={"Data"}>
            Upload Data
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest data transfers and access changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between pb-4 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.file}
                    {activity.entity && ` • ${activity.entity}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                  <div className="mt-1">
                    {activity.status === "success" && (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-700">
                        Success
                      </span>
                    )}
                    {activity.status === "warning" && (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-500/10 text-orange-700">
                        Revoked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
