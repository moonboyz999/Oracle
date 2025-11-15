import { Shield, Users, FileBarChart, ArrowRight, Mail } from "lucide-react";
import { Card } from "./ui/card";
import { useApp } from "../lib/AppContext";

export function LoginFlowDiagram() {
  const { t, isDarkMode } = useApp();

  return (
    <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}>
      <div className="text-center mb-8">
        <h2 className={`text-2xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
          Login Flow Diagram
        </h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Role-based authentication system
        </p>
      </div>

      {/* Flow Steps */}
      <div className="space-y-4">
        {/* Login Step */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-[#E0E0E0]'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#08796B]/10 rounded-xl">
              <Mail className="w-6 h-6 text-[#08796B]" />
            </div>
            <div className="flex-1">
              <h3 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                Step 1: Login
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your email and password
              </p>
            </div>
          </div>
        </Card>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className={`w-6 h-6 rotate-90 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>

        {/* Email Detection */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-[#E0E0E0]'}`}>
          <div className="space-y-4">
            <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
              Step 2: Email-Based Routing
            </h3>
            
            {/* Admin Route */}
            <div className="flex items-center gap-3 p-3 bg-[#08796B]/5 rounded-lg border-l-4 border-[#08796B]">
              <Shield className="w-5 h-5 text-[#08796B]" />
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  Email contains <code className="px-2 py-1 bg-[#08796B]/10 rounded">@admin</code>
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  → Routes to Admin Dashboard
                </p>
              </div>
            </div>

            {/* HR Route */}
            <div className="flex items-center gap-3 p-3 bg-[#2196F3]/5 rounded-lg border-l-4 border-[#2196F3]">
              <FileBarChart className="w-5 h-5 text-[#2196F3]" />
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  Email contains <code className="px-2 py-1 bg-[#2196F3]/10 rounded">@hr</code>
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  → Routes to HR Dashboard
                </p>
              </div>
            </div>

            {/* Warden Route */}
            <div className="flex items-center gap-3 p-3 bg-[#3B8E3C]/5 rounded-lg border-l-4 border-[#3B8E3C]">
              <Users className="w-5 h-5 text-[#3B8E3C]" />
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  Other email formats
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  → Routes to Warden Dashboard (Standard View)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Example Emails */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-[#E0E0E0]'}`}>
          <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
            Example Login Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className={`p-2 rounded ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Admin:</p>
              <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                user@admin.com
              </p>
            </div>
            <div className={`p-2 rounded ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>HR Officer:</p>
              <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                officer@hr.com
              </p>
            </div>
            <div className={`p-2 rounded ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Warden:</p>
              <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                warden@hostel.edu
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
