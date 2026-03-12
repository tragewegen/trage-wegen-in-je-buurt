import './Loader.css';

const Loader = () => (
  <div className="map-loader-overlay">
    <div className="map-spinner" />
    <span className="map-loader-text">Loading...</span>
  </div>
);

export default Loader;