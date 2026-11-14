import { useTranslation } from "react-i18next";
import "./SlidePuzzleSet.css";
function SlidePuzzleSet({ id, image, nameKey, onClick }) {
  const { t } = useTranslation();
  const handleClick = () => {
    onClick(id, nameKey);
  };
  return (
    <div className="slideset-card" onClick={handleClick}>
      <img src={image} alt={t(nameKey)} className="slideset-image" />
      <p className="slideset-name">{t(nameKey)}</p>
    </div>
  );
}
export default SlidePuzzleSet;
