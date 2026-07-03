// src/pages/SettingsPage.jsx
import { useState } from 'react';
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

import { userProfile, defaultNotifications } from '../data/mockSettings';

export default function SettingsPage() {
  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    notifications: true,
    security: true,
    legal: true,
    account: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggles state
  const [notifications, setNotifications] = useState(defaultNotifications);
  
  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Lock App state
  const [lockTime, setLockTime] = useState('10 Minutes');

  // Modal Flow state
  // null | 'recoveryEmail' | 'recoveryNumber' | 'deactivate' | 'delete' | 'terms' | 'tax'
  const [activeFlow, setActiveFlow] = useState(null);
  const [flowStep, setFlowStep] = useState(1);
  const [tempValue, setTempValue] = useState(''); // Store email/number during flow

  const closeFlow = () => {
    setActiveFlow(null);
    setFlowStep(1);
    setTempValue('');
  };

  const startFlow = (flow) => {
    setActiveFlow(flow);
    setFlowStep(1);
  };

  return (
    <div className="flex flex-col gap-[18px] w-full">
      {/* SECTION 1 — Notifications */}
      <AccordionSection 
        title="Notifications" 
        expanded={expandedSections.notifications} 
        onToggle={() => toggleSection('notifications')}
      >
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
              initialValue={userProfile.recoveryEmail}
              inputType="email"
              onContinue={(val) => {
                setTempValue(val);
                setFlowStep(3);
              }}
              onBack={() => setFlowStep(1)} // Or close, depending on preference
            />
          )}
          {flowStep === 3 && (
            <OtpVerificationModal 
              targetEmailOrPhone={tempValue || userProfile.recoveryEmail}
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

      {/* Flow B: Recovery Number */}
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
              initialValue={userProfile.recoveryPhone}
              inputType="tel"
              onContinue={(val) => {
                setTempValue(val);
                setFlowStep(3);
              }}
              onBack={() => setFlowStep(1)}
            />
          )}
          {flowStep === 3 && (
            <OtpVerificationModal 
              targetEmailOrPhone={tempValue || userProfile.recoveryPhone}
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
              onContinue={() => {
                console.log("Account deactivated");
                closeFlow();
              }}
              onBack={() => setFlowStep(1)}
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
              onContinue={() => {
                console.log("Account deleted");
                closeFlow();
              }}
              onBack={() => setFlowStep(1)}
            />
          )}
        </>
      )}

      {/* Legal Content Modals */}
      {activeFlow === 'terms' && (
        <LegalContentModal 
          title="Terms Of Service"
          onClose={closeFlow}
        />
      )}
      {activeFlow === 'tax' && (
        <LegalContentModal 
          title="Tax Information"
          onClose={closeFlow}
        />
      )}

    </div>
  );
}
