import React from 'react';
import { useCollapse } from 'react-collapsed';
import './LegalPage.css';
import TermsPage from './TermsPage';
import PrivacyPage from './PrivacyPage';
import Credits from '../componentsShared/Credits';
import { useTranslation } from 'react-i18next';

function LegalPage() {
    // Create separate instances for each collapsible
    const termsCollapse = useCollapse();
    const privacyCollapse = useCollapse();
    const creditsCollapse = useCollapse();
    const { t } = useTranslation();

    return (
            <div className ="legal-container">
            <h2>{t('footer.legal')}</h2>
                {/* Terms Section */}
                <div className="collapsible-wrapper">
                    <div
                        className="collapsible-header"
                        {...termsCollapse.getToggleProps()}
                    >
                        {termsCollapse.isExpanded ? t('legal.terms_of_service') : t('legal.terms_of_service')}
                    </div>
                    <div {...termsCollapse.getCollapseProps()}>
                        <div className="collapsible-content">
                            <TermsPage />
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="collapsible-wrapper">
                    <div
                        className="collapsible-header"
                        {...privacyCollapse.getToggleProps()}
                    >
                        {privacyCollapse.isExpanded ? t('legal.privacy_policy') : t('legal.privacy_policy')}
                    </div>
                    <div {...privacyCollapse.getCollapseProps()}>
                        <div className="collapsible-content">
                            <PrivacyPage />
                        </div>
                    </div>
                </div>

                                {/* Credits Section */}
                <div className="collapsible-wrapper">
                    <div
                        className="collapsible-header"
                        {...creditsCollapse.getToggleProps()}
                    >
                        {creditsCollapse.isExpanded ? t('legal.credits') : t('legal.credits')}
                    </div>
                    <div {...creditsCollapse.getCollapseProps()}>
                        <div className="collapsible-content">
                            <Credits />
                        </div>
                    </div>
                </div>
            </div>

    );
}

export default LegalPage;
