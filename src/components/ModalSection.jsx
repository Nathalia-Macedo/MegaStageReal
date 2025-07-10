const ModalSection = ({ activeSection, sectionKey, children }) => (
  <div className={`space-y-6 ${activeSection !== sectionKey ? "hidden" : ""}`}>{children}</div>
);

export default ModalSection;