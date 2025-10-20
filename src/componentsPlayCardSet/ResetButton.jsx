// ResetButton.jsx
import { useTranslation } from 'react-i18next';

function ResetButton({ onClick }) {
  const { t } = useTranslation();
  return (
    <button onClick={onClick}>{t('play_again_button')}
    </button>
  );
}

export default ResetButton;




