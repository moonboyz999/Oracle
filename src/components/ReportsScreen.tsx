import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReportsScreenProps {
  onBack: () => void;
}

const dailyData = [
  { day: "Mon", usage: 185 },
  { day: "Tue", usage: 192 },
  { day: "Wed", usage: 178 },
  { day: "Thu", usage: 205 },
  { day: "Fri", usage: 198 },
  { day: "Sat", usage: 165 },
  { day: "Sun", usage: 152 },
];

const monthlyData = [
  { month: "Jan", usage: 5200 },
  { month: "Feb", usage: 4800 },
  { month: "Mar", usage: 5400 },
  { month: "Apr", usage: 5100 },
  { month: "May", usage: 5600 },
  { month: "Jun", usage: 5300 },
];

const topRooms = [
  { room: "Room 104", usage: 245, change: 15 },
  { room: "Room 107", usage: 238, change: 12 },
  { room: "Room 203", usage: 225, change: -5 },
  { room: "Room 112", usage: 218, change: 8 },
  { room: "Room 156", usage: 210, change: -3 },
];

export function ReportsScreen({ onBack }: ReportsScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-[#08796B] text-white px-6 pt-8 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">Reports</h1>
            <p className="text-white/80 text-sm">Usage analytics & insights</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/95 p-4 border-0">
            <p className="text-xs text-[#78909C] mb-1">This Month</p>
            <p className="text-2xl text-[#263238]">5,300</p>
            <p className="text-xs text-[#78909C]">kWh</p>
          </Card>
          <Card className="bg-white/95 p-4 border-0">
            <p className="text-xs text-[#78909C] mb-1">Avg. Daily</p>
            <p className="text-2xl text-[#263238]">182</p>
            <p className="text-xs text-[#78909C]">kWh</p>
          </Card>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white mb-6">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="top-rooms">Top Rooms</TabsTrigger>
          </TabsList>

          {/* Daily Summary */}
          <TabsContent value="daily" className="space-y-4">
            <Card className="p-5 bg-white">
              <h3 className="mb-4">Weekly Usage Pattern</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    stroke="#78909C"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#78909C"
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="usage" fill="#08796B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4>Average Daily Consumption</h4>
                  <p className="text-3xl text-[#263238] mt-1">182 kWh</p>
                </div>
                <div className="flex items-center gap-2 text-[#3B8E3C]">
                  <TrendingDown className="w-5 h-5" />
                  <span>8%</span>
                </div>
              </div>
              <p className="text-sm text-[#78909C]">
                Consumption is 8% lower compared to last week
              </p>
            </Card>
          </TabsContent>

          {/* Monthly Report */}
          <TabsContent value="monthly" className="space-y-4">
            <Card className="p-5 bg-white">
              <h3 className="mb-4">6-Month Usage Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#78909C"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#78909C"
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="usage" fill="#08796B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4>Total This Month</h4>
                  <p className="text-3xl text-[#263238] mt-1">5,300 kWh</p>
                </div>
                <div className="flex items-center gap-2 text-[#E53935]">
                  <TrendingUp className="w-5 h-5" />
                  <span>3%</span>
                </div>
              </div>
              <p className="text-sm text-[#78909C]">
                Slightly higher than last month's 5,150 kWh
              </p>
            </Card>
          </TabsContent>

          {/* Top 5 High-Usage Rooms */}
          <TabsContent value="top-rooms" className="space-y-4">
            <h3 className="mb-3">Highest Consumption Rooms</h3>
            {topRooms.map((room, index) => (
              <Card key={room.room} className="p-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#B2DFB8]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#08796B]">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{room.room}</h4>
                    <p className="text-sm text-[#78909C]">{room.usage} kWh this week</p>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    room.change > 0 ? 'text-[#E53935]' : 'text-[#3B8E3C]'
                  }`}>
                    {room.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm">{Math.abs(room.change)}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" className="border-[#08796B] text-[#08796B] h-12">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-[#08796B] hover:bg-[#065D52] h-12">
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>
    </div>
  );
}
