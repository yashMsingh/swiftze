// src/pages/SettingsPage.jsx
import { useEffect, useState } from 'react';
import AccordionSection from '../components/settings/AccordionSection';
import ToggleRow from '../components/settings/ToggleRow';
import StaticStatusRow from '../components/settings/StaticStatusRow';
import RecoveryRow from '../components/settings/RecoveryRow';
import LockDropdownRow from '../components/settings/LockDropdownRow';
import SimpleRow from '../components/settings/SimpleRow';

import PasswordConfirmModal from '../components/modals/PasswordConfirmModal';
import NewValueModal from '../components/modals/NewValueModal';
import OtpVerificationModal from '../components/modals/OtpVerificationModal';
import SuccessModal from '../components/modals/SuccessModal';
import DeactivateConfirmModal from '../components/modals/DeactivateConfirmModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import LegalContentModal from '../components/modals/LegalContentModal';

import { getEmailPreferences, updateEmailPreferences, getProfileBundle, logout } from '../api/swiftzeApi';

// Maps frontend toggle keys → backend preference field names
const notificationPreferenceMap = {
  orderRequests: 'new_orders',
  earningAlerts: 'payment_notifications',
  emailUpdates: 'order_updates',
};

const DEFAULT_NOTIFICATIONS = {
  push: false,
  orderRequests: false,
  earningAlerts: false,
  emailUpdates: false,
};

function mapPreferencesToNotifications(preferences) {
  return {
    push: DEFAULT_NOTIFICATIONS.push,
    orderRequests: preferences.new_orders ?? false,
    earningAlerts: preferences.payment_notifications ?? false,
    emailUpdates: preferences.order_updates ?? false,
  };
}

export default function SettingsPage() {
  // Accordion state — all open by default
  const [expandedSections, setExpandedSections] = useState({
    notifications: true,
    security: true,
    legal: true,
    account: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Notification toggles — loaded from API
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [emailPreferences, setEmailPreferences] = useState(null);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState(null);

  // User profile data loaded from API (for recovery email/phone)
  const [userProfile, setUserProfile] = useState({ email: '', phone: '' });

  // Lock App state
  const [lockTime, setLockTime] = useState('10 Minutes');

  // Modal flow state
  // null | 'recoveryEmail' | 'recoveryNumber' | 'deactivate' | 'delete' | 'terms' | 'tax'
  const [activeFlow, setActiveFlow] = useState(null);
  const [flowStep, setFlowStep] = useState(1);
  const [tempValue, setTempValue] = useState('');

  const closeFlow = () => {
    setActiveFlow(null);
    setFlowStep(1);
    setTempValue('');
  };

  const startFlow = (flow) => {
    setActiveFlow(flow);
    setFlowStep(1);
  };

  // Load email preferences from API
  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        setNotifLoading(true);
        setNotifError(null);
        const preferences = await getEmailPreferences();
        if (cancelled) return;
        setEmailPreferences(preferences);
        setNotifications(mapPreferencesToNotifications(preferences));
      } catch (err) {
        if (!cancelled) setNotifError(err.message || 'Failed to load preferences');
      } finally {
        if (!cancelled) setNotifLoading(false);
      }
    }

    loadPreferences();
    return () => { cancelled = true; };
  }, []);

  // Load user profile from API for recovery email/phone display
  useEffect(() => {
    let cancelled = false;

    async function loadUserProfile() {
      try {
        const profile = await getProfileBundle();
        if (cancelled) return;
        setUserProfile({
          email: profile.email || '',
          phone: profile.phone || '',
        });
      } catch {
        // Non-critical — fields will just be empty
      }
    }

    loadUserProfile();
    return () => { cancelled = true; };
  }, []);

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const preferenceKey = notificationPreferenceMap[key];

      if (preferenceKey) {
        const nextPreferences = {
          ...(emailPreferences || {}),
          [preferenceKey]: next[key],
        };
        setEmailPreferences(nextPreferences);
        updateEmailPreferences(nextPreferences).catch((err) => {
          console.error('Failed to update notification preference:', err.message);
        });
      }

      return next;
    });
  };

  return (
    <div className="flex flex-col gap-[18px] w-full">
      {/* SECTION 1 — Notifications */}
      <AccordionSection
        title="Notifications"
        expanded={expandedSections.notifications}
        onToggle={() => toggleSection('notifications')}
      >
        {notifLoading ? (
          <div className="flex items-center gap-2 py-4 px-4">
            <div className="w-4 h-4 border-2 border-[#2F2F32] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#6B7280]">Loading preferences…</span>
          </div>
        ) : notifError ? (
          <div className="py-4 px-4 text-sm text-[#EF4444]">{notifError}</div>
        ) : (
          <>
            <ToggleRow
              label="Push notifications"
              description="Receive notifications on your device"
              checked={notifications.push}
              onChange={() => handleToggle('push')}
            />
            <ToggleRow
              label="Order Requests Alert"
              description="Get notified when you receive order requests"
              checked={notifications.orderRequests}
              onChange={() => handleToggle('orderRequests')}
            />
            <ToggleRow
              label="Earning Alerts"
              description="Get notified for every payment you receive"
              checked={notifications.earningAlerts}
              onChange={() => handleToggle('earningAlerts')}
            />
            <ToggleRow
              label="Receive Email Updates"
              description="Stay informed with swiftze logistics updates"
              checked={notifications.emailUpdates}
              onChange={() => handleToggle('emailUpdates')}
            />
          </>
        )}
      </AccordionSection>

      {/* SECTION 2 — Security */}
      <AccordionSection
        title="Security"
        expanded={expandedSections.security}
        onToggle={() => toggleSection('security')}
      >
        <StaticStatusRow label="Enable Two Factor Authentication" />
        <RecoveryRow
          label="Add Recovery Email"
          onChangeClick={() => startFlow('recoveryEmail')}
        />
        <RecoveryRow
          label="Add Recovery Phone Number"
          onChangeClick={() => startFlow('recoveryNumber')}
        />
        <StaticStatusRow label="Enable Fingerprint Unluck" />
        <LockDropdownRow
          label="Lock App If Inactive for"
          value={lockTime}
          onChange={setLockTime}
        />
      </AccordionSection>

      {/* SECTION 3 — Legal & Compliance */}
      <AccordionSection
        title="Legal & Compliance"
        expanded={expandedSections.legal}
        onToggle={() => toggleSection('legal')}
      >
        <SimpleRow label="Terms of Service" onClick={() => startFlow('terms')} />
        <SimpleRow label="Tax Information" onClick={() => startFlow('tax')} />
      </AccordionSection>

      {/* SECTION 4 — Account Control */}
      <AccordionSection
        title="Account Control"
        expanded={expandedSections.account}
        onToggle={() => toggleSection('account')}
      >
        <SimpleRow label="Deactivate Account" onClick={() => startFlow('deactivate')} />
        <SimpleRow label="Delete Account" onClick={() => startFlow('delete')} />
      </AccordionSection>

      {/* ================= MODAL FLOWS ================= */}

      {/* Flow A: Recovery Email */}
      {activeFlow === 'recoveryEmail' && (
        <>
          {flowStep === 1 && (
            <PasswordConfirmModal
              title="Change Recovery Email"
              onContinue={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 2 && (
            <NewValueModal
              title="Change Recovery Email"
              subtitle="Add your recovery email"
              initialValue={userProfile.email}
              inputType="email"
              onContinue={(val) => { setTempValue(val); setFlowStep(3); }}
              onBack={() => setFlowStep(1)}
            />
          )}
          {flowStep === 3 && (
            <OtpVerificationModal
              targetEmailOrPhone={tempValue || userProfile.email}
              onContinue={() => setFlowStep(4)}
              onChangeTarget={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 4 && (
            <SuccessModal
              message="Recovery Email Changed!"
              onClose={closeFlow}
            />
          )}
        </>
      )}

      {/* Flow B: Recovery Phone Number */}
      {activeFlow === 'recoveryNumber' && (
        <>
          {flowStep === 1 && (
            <PasswordConfirmModal
              title="Change Recovery Number"
              onContinue={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 2 && (
            <NewValueModal
              title="Change Recovery Number"
              subtitle="Add your recovery number"
              initialValue={userProfile.phone}
              inputType="tel"
              onContinue={(val) => { setTempValue(val); setFlowStep(3); }}
              onBack={() => setFlowStep(1)}
            />
          )}
          {flowStep === 3 && (
            <OtpVerificationModal
              targetEmailOrPhone={tempValue || userProfile.phone}
              onContinue={() => setFlowStep(4)}
              onChangeTarget={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 4 && (
            <SuccessModal
              message="Recovery Number Changed!"
              onClose={closeFlow}
            />
          )}
        </>
      )}

      {/* Flow C: Deactivate Account */}
      {activeFlow === 'deactivate' && (
        <>
          {flowStep === 1 && (
            <PasswordConfirmModal
              title="Deactivate Account"
              onContinue={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 2 && (
            <DeactivateConfirmModal
              onContinue={() => setFlowStep(3)}
              onBack={() => setFlowStep(1)}
            />
          )}
          {flowStep === 3 && (
            <SuccessModal
              message="Account Deactivated Successfully!"
              onClose={() => {
                logout();
                window.location.reload();
              }}
            />
          )}
        </>
      )}

      {/* Flow D: Delete Account */}
      {activeFlow === 'delete' && (
        <>
          {flowStep === 1 && (
            <PasswordConfirmModal
              title="Delete Account"
              onContinue={() => setFlowStep(2)}
              onBack={closeFlow}
            />
          )}
          {flowStep === 2 && (
            <DeleteConfirmModal
              onContinue={() => setFlowStep(3)}
              onBack={() => setFlowStep(1)}
            />
          )}
          {flowStep === 3 && (
            <SuccessModal
              message="Account Deleted Successfully!"
              onClose={() => {
                logout();
                window.location.reload();
              }}
            />
          )}
        </>
      )}

      {/* Legal Content Modals */}
      {activeFlow === 'terms' && (
        <LegalContentModal title="Terms Of Service" onClose={closeFlow} />
      )}
      {activeFlow === 'tax' && (
        <LegalContentModal title="Tax Information" onClose={closeFlow} />
      )}
    </div>
  );
}
