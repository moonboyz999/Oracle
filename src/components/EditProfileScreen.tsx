import { ArrowLeft, User, Mail, Phone, Building2, Briefcase, Check } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";
import { useApp } from "../lib/AppContext";
import { toast } from "sonner";

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { t, isDarkMode } = useApp();
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@hostel.edu");
  const [phoneNumber, setPhoneNumber] = useState("+60123456789");
  const [hostelName, setHostelName] = useState("Oracle Student Residence");
  const [position, setPosition] = useState("Hostel Warden");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(t('profileUpdated'));
    }, 1000);
  };

  return (
    <div className={`min-h-screen pb-8 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}>
      {/* Header */}
      <div className="bg-[#08796B] text-white px-6 pt-8 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">{t('editProfile')}</h1>
            <p className="text-white/80 text-sm">{t('managePreferences')}</p>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24 bg-white/20 border-4 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 bg-[#B2DFB8] rounded-full hover:bg-[#9ECFA4] transition-colors">
              <User className="w-4 h-4 text-[#08796B]" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
            {t('accountSettings')}
          </h3>
          <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-[#E0E0E0]'}`}>
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label 
                  htmlFor="fullName" 
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
                >
                  <User className="w-4 h-4 text-[#08796B]" />
                  {t('fullName')}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('fullNamePlaceholder')}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
                >
                  <Mail className="w-4 h-4 text-[#08796B]" />
                  {t('email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label 
                  htmlFor="phone" 
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
                >
                  <Phone className="w-4 h-4 text-[#08796B]" />
                  {t('phoneNumber')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('phoneNumberPlaceholder')}
                />
              </div>

              {/* Hostel Name */}
              <div className="space-y-2">
                <Label 
                  htmlFor="hostelName" 
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
                >
                  <Building2 className="w-4 h-4 text-[#08796B]" />
                  {t('hostelName')}
                </Label>
                <Input
                  id="hostelName"
                  type="text"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('hostelNamePlaceholder')}
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label 
                  htmlFor="position" 
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
                >
                  <Briefcase className="w-4 h-4 text-[#08796B]" />
                  {t('position')}
                </Label>
                <Input
                  id="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className={`${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('positionPlaceholder')}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={onBack}
            className={`flex-1 h-12 ${
              isDarkMode 
                ? 'border-gray-700 text-gray-300 hover:bg-[#2A2A2A]' 
                : 'border-[#E0E0E0] text-[#263238]'
            }`}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-12 bg-[#08796B] text-white hover:bg-[#06665A]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('saveChanges')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>{t('saveChanges')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
