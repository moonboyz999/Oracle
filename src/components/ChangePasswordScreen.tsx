import { ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useApp } from "../lib/AppContext";
import { toast } from "sonner@2.0.3";

interface ChangePasswordScreenProps {
  onBack: () => void;
}

export function ChangePasswordScreen({ onBack }: ChangePasswordScreenProps) {
  const { t, isDarkMode } = useApp();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && isPasswordValid && doPasswordsMatch;

  const handleUpdatePassword = () => {
    if (!canSubmit) return;
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(t('passwordUpdated'));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
            <h1 className="text-2xl">{t('changePassword')}</h1>
            <p className="text-white/80 text-sm">{t('managePreferences')}</p>
          </div>
        </div>

        {/* Security Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-white/20 rounded-3xl">
            <Lock className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Security Notice */}
        <Card className={`p-4 border-l-4 border-[#08796B] ${
          isDarkMode ? 'bg-[#2A2A2A]/50' : 'bg-[#B2DFB8]/20'
        }`}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#08796B] flex-shrink-0 mt-0.5" />
            <div className={isDarkMode ? 'text-gray-300' : 'text-[#263238]'}>
              <p className="text-sm">{t('passwordRequirements')}</p>
            </div>
          </div>
        </Card>

        {/* Password Form */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-[#E0E0E0]'}`}>
          <div className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label 
                htmlFor="currentPassword" 
                className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
              >
                <Lock className="w-4 h-4 text-[#08796B]" />
                {t('currentPassword')}
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pr-12 ${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  }`}
                  placeholder={t('currentPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showCurrent ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label 
                htmlFor="newPassword" 
                className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
              >
                <Lock className="w-4 h-4 text-[#08796B]" />
                {t('newPassword')}
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pr-12 ${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  } ${
                    newPassword.length > 0 && !isPasswordValid 
                      ? 'border-[#E53935] focus-visible:ring-[#E53935]' 
                      : ''
                  }`}
                  placeholder={t('newPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {newPassword.length > 0 && !isPasswordValid && (
                <p className="text-xs text-[#E53935] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('passwordRequirements')}
                </p>
              )}
              {newPassword.length > 0 && isPasswordValid && (
                <p className="text-xs text-[#3B8E3C] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Password meets requirements
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword" 
                className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#263238]'}`}
              >
                <Lock className="w-4 h-4 text-[#08796B]" />
                {t('confirmNewPassword')}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pr-12 ${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-[#E0E0E0] text-[#263238]'
                  } ${
                    confirmPassword.length > 0 && !doPasswordsMatch 
                      ? 'border-[#E53935] focus-visible:ring-[#E53935]' 
                      : ''
                  }`}
                  placeholder={t('confirmNewPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="text-xs text-[#E53935] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('passwordsMatch')}
                </p>
              )}
              {doPasswordsMatch && (
                <p className="text-xs text-[#3B8E3C] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>
          </div>
        </Card>

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
            onClick={handleUpdatePassword}
            disabled={!canSubmit || isSaving}
            className="flex-1 h-12 bg-[#08796B] text-white hover:bg-[#06665A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('updatePassword')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>{t('updatePassword')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
